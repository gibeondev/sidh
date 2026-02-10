import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, RegistrationPeriodStatus, StudentGender } from '@prisma/client';
import { PreRegisterDto } from './dto/pre-register.dto';

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
