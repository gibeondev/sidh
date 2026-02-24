import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

@Controller('parent/applications/:applicationId/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PARENT', 'ADMIN')
export class ParentDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('applicationId') applicationId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.documentsService.uploadDocument(
      applicationId,
      userId,
      userRole,
      dto,
      file,
    );
  }

  @Get()
  async list(@Param('applicationId') applicationId: string, @Request() req: any) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.documentsService.listDocumentsByParent(applicationId, userId, userRole);
  }

  @Get(':documentId/download')
  async download(
    @Param('applicationId') applicationId: string,
    @Param('documentId') documentId: string,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.documentsService.getDownloadUrlForParent(applicationId, documentId, userId, userRole);
  }
}

@Controller('admin/applications/:applicationId/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async list(@Param('applicationId') applicationId: string) {
    return this.documentsService.listDocumentsByAdmin(applicationId);
  }
}

@Controller('admin/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDocumentActionsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':id/download')
  async download(@Param('id') documentId: string, @Request() req: any) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.documentsService.getDownloadUrl(documentId, userId, userRole);
  }

  @Post(':id/approve')
  async approve(
    @Param('id') documentId: string,
    @Body() dto: ReviewDocumentDto,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.documentsService.reviewDocument(documentId, userId, userRole, {
      ...dto,
      status: dto.status || 'APPROVED',
    });
  }

  @Post(':id/reject')
  async reject(
    @Param('id') documentId: string,
    @Body() dto: ReviewDocumentDto,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.documentsService.reviewDocument(documentId, userId, userRole, {
      ...dto,
      status: 'REJECTED',
    });
  }
}
