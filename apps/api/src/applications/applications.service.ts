import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, Prisma, RegistrationPeriodStatus, StudentGender } from '@prisma/client';
import { PreRegisterDto } from './dto/pre-register.dto';
import { DecisionNoteDto } from './dto/decision.dto';
import { InternalNoteDto } from './dto/internal-note.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateFullRegistrationDto, ContactDto, ContactRelationshipDto } from './dto/update-full-registration.dto';
import { ContactRelationship } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async preRegister(dto: PreRegisterDto) {
    const period = await this.prisma.registrationPeriod.findFirst({
      where: {
        status: RegistrationPeriodStatus.OPEN,
        startAt: { lte: new Date() },
        endAt: { gt: new Date() },
      },
      orderBy: [{ startAt: 'desc' }, { createdAt: 'desc' }],
    });

    if (!period) {
      throw new ForbiddenException(
        'Registration is currently closed. No open registration period.',
      );
    }

    const domicileStart = new Date(dto.domicileStartDate);
    const domicileEnd = new Date(dto.domicileEndDate);
    if (domicileEnd < domicileStart) {
      throw new BadRequestException(
        'domicileEndDate must be on or after domicileStartDate',
      );
    }

    const applicationNo = await this.generateApplicationNo(period.id);

    const result = await this.prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          applicationNo,
          applicantEmail: dto.applicantEmail,
          registrationPeriodId: period.id,
          status: ApplicationStatus.DRAFT,
        },
      });

      await tx.applicationPreRegistration.create({
        data: {
          applicationId: application.id,
          applicantName: dto.applicantName,
          applicantRelationship: dto.applicantRelationship,
          reasonLivingAbroad: dto.reasonLivingAbroad,
          reasonToApply: dto.reasonToApply,
          assignmentCity: dto.assignmentCity,
          assignmentCountry: dto.assignmentCountry,
          domicileStartDate: new Date(dto.domicileStartDate),
          domicileEndDate: new Date(dto.domicileEndDate),
          permitExpiryDate: new Date(dto.permitExpiryDate),
          programChoice: dto.programChoice,
          educationLevel: dto.educationLevel,
          gradeApplied: dto.gradeApplied,
          studentName: dto.studentName,
          studentGender: dto.studentGender as StudentGender,
          studentBirthDate: new Date(dto.studentBirthDate),
          lastEducationLocation: dto.lastEducationLocation,
          nisn: dto.nisn ?? null,
        },
      });

      return application;
    });

    return {
      applicationId: result.id,
      applicationNo: result.applicationNo,
    };
  }

  /** Admin: list applications with pre-registration data, optional filters and sort */
  async adminList(params: {
    status?: ApplicationStatus;
    page?: number;
    limit?: number;
    search?: string;
    program?: string;
    country?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { status, page = 1, limit = 10, search, program, country, sortBy, sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;
    const term = search?.trim();
    const and: object[] = [{ preRegistration: { isNot: null } }];
    if (status) and.push({ status });
    if (term) {
      and.push({
        OR: [
          { applicationNo: { contains: term, mode: 'insensitive' as const } },
          { preRegistration: { studentName: { contains: term, mode: 'insensitive' as const } } },
          { preRegistration: { applicantName: { contains: term, mode: 'insensitive' as const } } },
        ],
      });
    }
    const programVal = program != null && String(program).trim() !== '' ? String(program).trim() : null;
    const countryVal = country != null && String(country).trim() !== '' ? String(country).trim() : null;
    if (programVal) {
      and.push({ preRegistration: { programChoice: programVal } });
    }
    if (countryVal) {
      and.push({ preRegistration: { assignmentCountry: countryVal } });
    }
    const where = and.length === 1 ? and[0] : { AND: and };

    const orderBy = this.buildAdminListOrderBy(sortBy, sortOrder);

    const [items, total, filterOpts] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: { preRegistration: true },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.application.count({ where }),
      this.adminListFilterOptions(),
    ]);
    return { items, total, page, limit, filterOptions: filterOpts };
  }

  private buildAdminListOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc'): Prisma.ApplicationOrderByWithRelationInput | Prisma.ApplicationOrderByWithRelationInput[] {
    const dir: 'asc' | 'desc' = sortOrder === 'asc' ? 'asc' : 'desc';
    switch (sortBy) {
      case 'applicationNo':
        return { applicationNo: dir };
      case 'studentName':
        return { preRegistration: { studentName: dir } };
      case 'programChoice':
        return { preRegistration: { programChoice: dir } };
      case 'assignmentCountry':
        return { preRegistration: { assignmentCountry: dir } };
      case 'submittedAt':
        return [{ submittedAt: dir }, { createdAt: dir }];
      case 'status':
        return { status: dir };
      case 'createdAt':
      default:
        return { createdAt: dir };
    }
  }

  /** Admin: distinct program and country values for filter dropdowns */
  async adminListFilterOptions(): Promise<{ programs: string[]; countries: string[] }> {
    const [programs, countries] = await Promise.all([
      this.prisma.applicationPreRegistration.findMany({
        select: { programChoice: true },
        distinct: ['programChoice'],
        orderBy: { programChoice: 'asc' },
      }),
      this.prisma.applicationPreRegistration.findMany({
        select: { assignmentCountry: true },
        distinct: ['assignmentCountry'],
        orderBy: { assignmentCountry: 'asc' },
      }),
    ]);
    return {
      programs: programs.map((p) => p.programChoice).filter(Boolean),
      countries: countries.map((c) => c.assignmentCountry).filter(Boolean),
    };
  }

  /** Admin: get one application by id with pre-registration */
  async adminGetById(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationPeriod: true },
    });
    if (!app || !app.preRegistration) {
      throw new NotFoundException('Application not found');
    }
    return app;
  }

  /** Admin: approve application */
  async adminApprove(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true },
    });
    if (!app || !app.preRegistration) throw new NotFoundException('Application not found');
    if (app.status === ApplicationStatus.APPROVED) {
      throw new BadRequestException('Application already approved');
    }
    return this.prisma.application.update({
      where: { id },
      data: { status: ApplicationStatus.APPROVED, decisionReason: null },
      include: { preRegistration: true },
    });
  }

  /** Admin: reject application (note required) */
  async adminReject(id: string, dto: DecisionNoteDto) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true },
    });
    if (!app || !app.preRegistration) throw new NotFoundException('Application not found');
    return this.prisma.application.update({
      where: { id },
      data: { status: ApplicationStatus.REJECTED, decisionReason: dto.note },
      include: { preRegistration: true },
    });
  }

  /** Admin: request changes (note required) */
  async adminRequestChanges(id: string, dto: DecisionNoteDto) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true },
    });
    if (!app || !app.preRegistration) throw new NotFoundException('Application not found');
    return this.prisma.application.update({
      where: { id },
      data: { status: ApplicationStatus.CHANGES_REQUESTED, decisionReason: dto.note },
      include: { preRegistration: true },
    });
  }

  /** Admin: update internal note (Catatan Internal) on pre-registration */
  async adminUpdateInternalNote(id: string, dto: InternalNoteDto) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true },
    });
    if (!app || !app.preRegistration) throw new NotFoundException('Application not found');
    const note = dto.note != null ? String(dto.note) : null;
    await this.prisma.applicationPreRegistration.update({
      where: { applicationId: id },
      data: { note: note || null },
    });
    return this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationPeriod: true },
    });
  }

  /** Admin: update application status (no constraints) */
  async adminUpdateStatus(id: string, dto: UpdateStatusDto) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true },
    });
    if (!app || !app.preRegistration) throw new NotFoundException('Application not found');
    
    return this.prisma.application.update({
      where: { id },
      data: {
        status: dto.status,
        decisionReason: dto.decisionReason || null,
      },
      include: { preRegistration: true, registrationPeriod: true },
    });
  }

  async listByParent(parentUserId: number, callerRole?: string) {
    const where =
      callerRole === 'ADMIN'
        ? {}
        : { parentUserId };
    return this.prisma.application.findMany({
      where,
      include: {
        registrationPeriod: true,
        preRegistration: true,
        registrationSubmission: true,
        contacts: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOneByParent(
    applicationId: string,
    parentUserId: number,
    parentEmail?: string,
    callerRole?: string,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        registrationPeriod: true,
        preRegistration: true,
        registrationSubmission: true,
        contacts: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (callerRole !== 'ADMIN') {
      const belongsToParent =
        application.parentUserId === parentUserId ||
        (application.parentUserId == null &&
          parentEmail != null &&
          application.applicantEmail.toLowerCase() === parentEmail.toLowerCase());

      if (!belongsToParent) {
        throw new ForbiddenException('Application does not belong to this user');
      }
    }

    return application;
  }

  /**
   * Parent: Update full registration data (Step 1 & 2) as draft
   */
  async parentUpdateFullRegistration(
    applicationId: string,
    parentUserId: number,
    parentEmail: string | undefined,
    callerRole: string | undefined,
    dto: UpdateFullRegistrationDto,
  ) {
    // Verify application exists and belongs to parent (or can be linked by email); ADMIN can update any
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { registrationPeriod: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (callerRole !== 'ADMIN') {
      const belongsToParent =
        application.parentUserId === parentUserId ||
        (application.parentUserId == null &&
          parentEmail != null &&
          application.applicantEmail.toLowerCase() === parentEmail.toLowerCase());

      if (!belongsToParent) {
        throw new ForbiddenException('Application does not belong to this user');
      }
    }

    // Check if registration period is open
    if (application.registrationPeriod.status !== RegistrationPeriodStatus.OPEN) {
      throw new ForbiddenException('Registration period is closed');
    }

    return this.prisma.$transaction(async (tx) => {
      // Link application to parent if not yet linked (e.g. after pre-registration, same email); skip when caller is ADMIN
      if (
        callerRole !== 'ADMIN' &&
        application.parentUserId == null &&
        parentEmail != null &&
        application.applicantEmail.toLowerCase() === parentEmail.toLowerCase()
      ) {
        await tx.application.update({
          where: { id: applicationId },
          data: { parentUserId },
        });
      }

      // Update or create registration submission (Step 1 data)
      if (
        dto.studentName != null ||
        dto.programChoice != null ||
        dto.gradeApplied != null ||
        dto.studentGender != null ||
        dto.studentBirthDate != null ||
        dto.birthPlace != null ||
        dto.nik != null ||
        dto.religion != null ||
        dto.heightCm != null ||
        dto.weightKg != null ||
        dto.nisn != null ||
        dto.lastSchoolIndonesia != null ||
        dto.currentSchoolName != null ||
        dto.currentSchoolCountry != null ||
        dto.childOrder != null ||
        dto.siblingCount != null ||
        dto.lastDiplomaSerialNumber != null ||
        dto.hasSpecialNeeds != null ||
        dto.addressIndonesia != null ||
        dto.domicileRegion != null ||
        dto.phoneCountryCode != null ||
        dto.phoneNumber != null
      ) {
        const num = (v: string | undefined, fallback: number) => {
          if (v == null || v === '') return fallback;
          const n = parseInt(String(v).trim(), 10);
          return Number.isNaN(n) ? fallback : n;
        };
        const str = (v: string | undefined, fallback: string) =>
          v != null && String(v).trim() !== '' ? String(v).trim() : fallback;
        const date = (v: string | undefined) =>
          v ? new Date(v) : new Date();

        const submissionData = {
          studentFullName: str(dto.studentName, ''),
          programChoice: str(dto.programChoice, ''),
          gradeApplied: str(dto.gradeApplied, ''),
          studentGender: (dto.studentGender ?? StudentGender.MALE) as StudentGender,
          studentBirthDate: date(dto.studentBirthDate),
          birthPlace: str(dto.birthPlace, ''),
          nik: str(dto.nik, ''),
          religion: str(dto.religion, ''),
          heightCm: num(dto.heightCm, 0),
          weightKg: num(dto.weightKg, 0),
          nisn: str(dto.nisn, ''),
          lastSchoolIndonesia: str(dto.lastSchoolIndonesia, ''),
          currentSchoolName: str(dto.currentSchoolName, ''),
          currentSchoolCountry: str(dto.currentSchoolCountry, ''),
          childOrder: num(dto.childOrder, 0),
          siblingsCount: num(dto.siblingCount, 0),
          lastDiplomaSerialNumber: dto.lastDiplomaSerialNumber?.trim() || null,
          hasSpecialNeeds: str(dto.hasSpecialNeeds, 'NO'),
          addressIndonesia: str(dto.addressIndonesia, ''),
          domicileRegion: str(dto.domicileRegion, ''),
          phoneCountryCode: str(dto.phoneCountryCode, '+62'),
          phoneNumber: str(dto.phoneNumber, ''),
        };

        await tx.registrationSubmission.upsert({
          where: { applicationId },
          update: submissionData,
          create: {
            applicationId,
            ...submissionData,
          },
        });
      }

      // Update contacts (Step 2 data)
      if (dto.contacts && dto.contacts.length > 0) {
        // Delete existing contacts for this application
        await tx.applicationContact.deleteMany({
          where: { applicationId },
        });

        // Create new contacts
        const contactData = dto.contacts.map((contact) => ({
          applicationId,
          relationship: this.mapContactRelationship(contact.relationship),
          fullName: contact.fullName,
          birthPlace: contact.birthPlace,
          birthDate: new Date(contact.birthDate),
          nik: contact.nik,
          educationLevel: contact.educationLevel,
          occupation: contact.occupation,
          incomeRange: contact.incomeRange,
          phone: contact.phone,
          email: contact.email,
        }));

        await tx.applicationContact.createMany({
          data: contactData,
        });
      }

      // Step 3 - Address & Domicile data
      // TODO: Persist Step 3 address fields when schema is updated
      // Fields accepted: parentServiceCountry, domicilePeriodStart, domicilePeriodEnd, parentVisaType
      // These fields are currently accepted by the API but not persisted to database.
      // When a table/model is added for Step 3 data, implement persistence here.

      // Step 4 - Special Needs & Additional Information data
      // TODO: Persist Step 4 fields when schema is updated
      // Fields accepted: description, additionalInfo
      // These fields are currently accepted by the API but not persisted to database.
      // When a table/model is added for Step 4 data, implement persistence here.

      // Step 5 - Documents
      // Note: Document uploads are handled via separate endpoint:
      // POST /parent/applications/:id/documents (see Task 06 - Documents Upload)
      // Documents are not saved through this update endpoint.

      return tx.application.findUnique({
        where: { id: applicationId },
        include: {
          registrationSubmission: true,
          contacts: true,
          registrationPeriod: true,
        },
      });
    });
  }

  private mapContactRelationship(
    relationship: ContactRelationshipDto,
  ): ContactRelationship {
    switch (relationship) {
      case ContactRelationshipDto.Father:
        return ContactRelationship.Father;
      case ContactRelationshipDto.Mother:
        return ContactRelationship.Mother;
      case ContactRelationshipDto.Guardian:
        return ContactRelationship.Guardian;
      default:
        throw new BadRequestException(`Invalid relationship: ${relationship}`);
    }
  }

  private async generateApplicationNo(periodId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.application.count({
      where: { registrationPeriodId: periodId },
    });
    const seq = String(count + 1).padStart(4, '0');
    const candidate = `APP-${year}-${seq}`;
    const existing = await this.prisma.application.findUnique({
      where: { applicationNo: candidate },
    });
    if (existing) {
      return `APP-${year}-${Date.now()}`;
    }
    return candidate;
  }
}
