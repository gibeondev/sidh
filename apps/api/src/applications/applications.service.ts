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
