import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import {
  DocumentType,
  DocumentStatus,
  ApplicationStatus,
  RegistrationPeriodStatus,
} from '@prisma/client';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const PRE_REGISTER_VISA_UPLOAD_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const SYSTEM_USER_EMAIL = 'pre-register-upload@system.local';
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Upload document for parent's application
   */
  async uploadDocument(
    applicationId: string,
    userId: number,
    userRole: string,
    dto: UploadDocumentDto,
    file: Express.Multer.File,
  ) {
    // Validate file
    this.validateFile(file);

    // Get application with relations
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { registrationPeriod: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check ownership (skip for ADMIN)
    if (userRole !== 'ADMIN' && application.parentUserId !== userId) {
      throw new ForbiddenException('Application does not belong to this user');
    }

    // Parent may upload/replace documents only when full-registration is in draft (DRAFT or CHANGES_REQUESTED)
    if (
      userRole !== 'ADMIN' &&
      application.status !== ApplicationStatus.DRAFT &&
      application.status !== ApplicationStatus.CHANGES_REQUESTED
    ) {
      throw new ForbiddenException(
        'Documents cannot be changed after submission. Application must be in draft or changes requested.',
      );
    }

    // Check registration period
    if (application.registrationPeriod.status !== RegistrationPeriodStatus.OPEN) {
      throw new ForbiddenException('Registration period is closed');
    }

    // Generate S3 key: applications/{applicationId}/documents/{documentType}/{timestamp}-{originalFilename}
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `applications/${applicationId}/documents/${dto.documentType}/${timestamp}-${sanitizedFilename}`;

    // Check if document of this type already exists (quick DB read, no transaction)
    const existingDocument = await this.prisma.document.findUnique({
      where: {
        applicationId_documentType: {
          applicationId,
          documentType: dto.documentType,
        },
      },
    });

    // Upload to S3 OUTSIDE transaction (S3 can be slow; Prisma tx timeout is 5s)
    try {
      await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);
    } catch (error: any) {
      throw new BadRequestException(
        `Gagal mengunggah dokumen ke penyimpanan: ${error.message || error.toString()}`
      );
    }

    // Delete old file from S3 if replacing (outside transaction to avoid tx timeout)
    if (existingDocument) {
      try {
        await this.s3Service.deleteFile(existingDocument.s3Key);
      } catch (error) {
        console.error('Failed to delete old S3 file:', error);
      }
    }

    // Short transaction: DB only (no slow I/O)
    return this.prisma.$transaction(async (tx) => {
      if (existingDocument) {
        return tx.document.update({
          where: { id: existingDocument.id },
          data: {
            s3Key: s3Key,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            uploadedAt: new Date(),
            uploadedBy: userId,
            status: DocumentStatus.OPEN,
            reviewNote: null,
            reviewedAt: null,
            reviewedBy: null,
          },
        });
      }
      return tx.document.create({
        data: {
          applicationId,
          documentType: dto.documentType,
          status: DocumentStatus.OPEN,
          s3Key: s3Key,
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: userId,
        },
      });
    });
  }

  /**
   * List documents for parent (metadata only)
   */
  async listDocumentsByParent(applicationId: string, userId: number, callerRole?: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check ownership (skip for ADMIN)
    if (callerRole !== 'ADMIN' && application.parentUserId !== userId) {
      throw new ForbiddenException('Application does not belong to this user');
    }

    return this.prisma.document.findMany({
      where: { applicationId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  /**
   * List documents for admin (metadata only)
   */
  async listDocumentsByAdmin(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.prisma.document.findMany({
      where: { applicationId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  /**
   * Get signed download URL for parent (view own application's documents)
   */
  async getDownloadUrlForParent(
    applicationId: string,
    documentId: string,
    userId: number,
    userRole: string,
  ) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { application: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.applicationId !== applicationId) {
      throw new ForbiddenException('Document does not belong to this application');
    }

    if (userRole !== 'ADMIN') {
      const application = document.application;
      const belongsToParent =
        application.parentUserId === userId;
      if (!belongsToParent) {
        throw new ForbiddenException('Document does not belong to this user');
      }
    }

    try {
      const signedUrl = await this.s3Service.getSignedDownloadUrl(document.s3Key);
      return {
        url: signedUrl,
        fileName: document.fileName,
        mimeType: document.mimeType,
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Gagal membuat URL unduhan: ${error.message || 'File tidak ditemukan di penyimpanan S3'}`,
      );
    }
  }

  /**
   * Get signed download URL for admin
   */
  async getDownloadUrl(documentId: string, userId: number, userRole: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { application: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Only admins can download
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can download documents');
    }

    try {
      // Generate signed URL
      const signedUrl = await this.s3Service.getSignedDownloadUrl(document.s3Key);

      // Log download action
      await this.prisma.documentAuditLog.create({
        data: {
          documentId,
          action: 'DOWNLOAD',
          performedBy: userId,
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      });

      return {
        url: signedUrl,
        fileName: document.fileName,
        mimeType: document.mimeType,
      };
    } catch (error: any) {
      // Wrap S3 errors in user-friendly messages
      throw new BadRequestException(
        `Gagal membuat URL unduhan: ${error.message || 'File tidak ditemukan di penyimpanan S3'}`
      );
    }
  }

  /**
   * Review document (approve/reject) - Admin only
   */
  async reviewDocument(
    documentId: string,
    userId: number,
    userRole: string,
    dto: ReviewDocumentDto,
  ) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can review documents');
    }

    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const status = dto.status || DocumentStatus.APPROVED;

    return this.prisma.$transaction(async (tx) => {
      // Update document status
      const updatedDocument = await tx.document.update({
        where: { id: documentId },
        data: {
          status: status,
          reviewNote: dto.reviewNote || null,
          reviewedAt: new Date(),
          reviewedBy: userId,
        },
      });

      // Log review action
      await tx.documentAuditLog.create({
        data: {
          documentId,
          action: status === DocumentStatus.APPROVED ? 'APPROVE' : 'REJECT',
          performedBy: userId,
          metadata: {
            reviewNote: dto.reviewNote,
            timestamp: new Date().toISOString(),
          },
        },
      });

      return updatedDocument;
    });
  }

  /**
   * Upload visa/izin tinggal document for pre-registration (public, no auth).
   * Called right after pre-register submit. Application must exist, have preRegistration,
   * and be created within the upload window to prevent abuse.
   */
  async uploadVisaDocumentForPreRegistration(
    applicationId: string,
    file: Express.Multer.File,
  ) {
    this.validateFile(file);

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { preRegistration: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (!application.preRegistration) {
      throw new BadRequestException('Application does not have pre-registration data');
    }

    const now = Date.now();
    const createdAt = application.createdAt.getTime();
    if (now - createdAt > PRE_REGISTER_VISA_UPLOAD_WINDOW_MS) {
      throw new BadRequestException(
        'Visa document upload window has expired. Please contact support if you need to add a document.',
      );
    }

    const systemUser = await this.prisma.user.findUnique({
      where: { email: SYSTEM_USER_EMAIL },
    });
    if (!systemUser) {
      throw new BadRequestException('System configuration error. Please try again later.');
    }

    const documentType = DocumentType.PARENT_RESIDENCE_PERMIT;
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `applications/${applicationId}/documents/${documentType}/${timestamp}-${sanitizedFilename}`;

    const existingDocument = await this.prisma.document.findUnique({
      where: {
        applicationId_documentType: {
          applicationId,
          documentType,
        },
      },
    });

    try {
      await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);
    } catch (error: any) {
      throw new BadRequestException(
        `Gagal mengunggah dokumen ke penyimpanan: ${error.message || error.toString()}`,
      );
    }

    if (existingDocument) {
      try {
        await this.s3Service.deleteFile(existingDocument.s3Key);
      } catch (error) {
        console.error('Failed to delete old S3 file:', error);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (existingDocument) {
        return tx.document.update({
          where: { id: existingDocument.id },
          data: {
            s3Key,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            uploadedAt: new Date(),
            uploadedBy: systemUser.id,
            status: DocumentStatus.OPEN,
            reviewNote: null,
            reviewedAt: null,
            reviewedBy: null,
          },
        });
      }
      return tx.document.create({
        data: {
          applicationId,
          documentType,
          status: DocumentStatus.OPEN,
          s3Key,
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: systemUser.id,
        },
      });
    });
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: PDF, JPG, PNG`,
      );
    }
  }
}
