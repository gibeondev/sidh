import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, Prisma, RegistrationPeriodStatus, StudentGender, UserRole } from '@prisma/client';
import { PreRegisterDto } from './dto/pre-register.dto';
import * as bcrypt from 'bcrypt';
import { DecisionNoteDto } from './dto/decision.dto';
import { InternalNoteDto } from './dto/internal-note.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateFullRegistrationDto, ContactDto, ContactRelationshipDto } from './dto/update-full-registration.dto';
import { ContactRelationship } from '@prisma/client';

/** Test credential for parent when pre-registration is approved (temporary; replace with real temp password + change flow later) */
const PARENT_TEST_PASSWORD = 'Test1234567!';

/** Placeholder values for full-registration draft: detect "not yet filled" on submit validation */
const DRAFT_STR = '';
const DRAFT_NUM = 0;
const DRAFT_CHILD_ORDER = -1;
const DRAFT_SIBLINGS_COUNT = -1;
const DRAFT_DATE = new Date(0); // 1970-01-01 UTC

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
    hasFullRegistration?: boolean;
  }) {
    const { status, page = 1, limit = 10, search, program, country, sortBy, sortOrder = 'desc', hasFullRegistration } = params;
    const skip = (page - 1) * limit;
    const term = search?.trim();
    const and: object[] = [{ preRegistration: { isNot: null } }];
    if (hasFullRegistration) {
      and.push({ registrationSubmission: { isNot: null } });
    }
    if (status) and.push({ status });
    if (term) {
      and.push({
        OR: [
          { applicationNo: { contains: term, mode: 'insensitive' as const } },
          { preRegistration: { studentName: { contains: term, mode: 'insensitive' as const } } },
          { preRegistration: { applicantName: { contains: term, mode: 'insensitive' as const } } },
          { registrationSubmission: { studentFullName: { contains: term, mode: 'insensitive' as const } } },
        ],
      });
    }
    const programVal = program != null && String(program).trim() !== '' ? String(program).trim() : null;
    const countryVal = country != null && String(country).trim() !== '' ? String(country).trim() : null;
    if (programVal) {
      and.push({
        OR: [
          { preRegistration: { programChoice: programVal } },
          { registrationSubmission: { programChoice: programVal } },
        ],
      });
    }
    if (countryVal) {
      and.push({ preRegistration: { assignmentCountry: countryVal } });
    }
    const where = and.length === 1 ? and[0] : { AND: and };

    const orderBy = this.buildAdminListOrderBy(sortBy, sortOrder);

    const include: { preRegistration: true; registrationSubmission?: true } = { preRegistration: true };
    if (hasFullRegistration) {
      include.registrationSubmission = true;
    }

    const [items, total, filterOpts] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include,
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

  /** Admin: get one application by id with pre-registration, full registration (submission, contacts, documents) */
  async adminGetById(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: {
        preRegistration: true,
        registrationPeriod: true,
        registrationSubmission: true,
        contacts: true,
        documents: true,
      },
    });
    if (!app || !app.preRegistration) {
      throw new NotFoundException('Application not found');
    }
    return app;
  }

  /** Admin: list students (profiles created when full registration is approved) */
  async adminListStudents() {
    return this.prisma.student.findMany({
      include: {
        application: {
          select: { applicationNo: true, applicantEmail: true, submittedAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Admin: get one student by id with application and contacts (for detail page) */
  async adminGetStudentById(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        application: {
          select: {
            applicationNo: true,
            applicantEmail: true,
            submittedAt: true,
            contacts: true,
          },
        },
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  /** Admin: get distinct values for export filters (grade, country of domicile, parent occupation) */
  async adminStudentExportFilterOptions(): Promise<{
    grades: string[];
    countries: string[];
    occupations: string[];
  }> {
    const [students, contacts] = await Promise.all([
      this.prisma.student.findMany({
        select: {
          gradeApplied: true,
          currentSchoolCountry: true,
        },
      }),
      this.prisma.applicationContact.findMany({
        select: { occupation: true },
      }),
    ]);
    const grades = [...new Set(students.map((s) => s.gradeApplied).filter(Boolean))].sort();
    const countries = [...new Set(students.map((s) => s.currentSchoolCountry).filter(Boolean))].sort();
    const occupations = [...new Set(contacts.map((c) => c.occupation).filter(Boolean))].sort();
    return { grades, countries, occupations };
  }

  /** Admin: list students for export with optional filters (grade, country of domicile, parent occupation) */
  async adminListStudentsForExport(filters: {
    grade?: string;
    country?: string;
    occupation?: string;
  }) {
    const where: Prisma.StudentWhereInput = {};
    if (filters.grade?.trim()) where.gradeApplied = filters.grade.trim();
    if (filters.country?.trim()) where.currentSchoolCountry = filters.country.trim();
    if (filters.occupation?.trim()) {
      where.application = {
        contacts: {
          some: { occupation: filters.occupation.trim() },
        },
      };
    }
    return this.prisma.student.findMany({
      where,
      include: {
        application: {
          select: {
            applicationNo: true,
            applicantEmail: true,
            contacts: { select: { relationship: true, fullName: true, occupation: true } },
          },
        },
      },
      orderBy: [{ gradeApplied: 'asc' }, { studentFullName: 'asc' }],
    });
  }

  /** Escape a CSV field (UTF-8); wrap in quotes if needed, double quotes inside */
  private csvEscape(val: string | number | null | undefined): string {
    const s = val == null ? '' : String(val);
    if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  /** Admin: build CSV export (UTF-8 with BOM, Excel-ready) filtered by grade, country, occupation */
  async adminGetStudentsExportCsv(filters: {
    grade?: string;
    country?: string;
    occupation?: string;
  }): Promise<string> {
    const rows = await this.adminListStudentsForExport(filters);
    const BOM = '\uFEFF';
    const headers = [
      'No. Aplikasi',
      'Nama Lengkap',
      'Program',
      'Kelas',
      'Jenis Kelamin',
      'Tanggal Lahir',
      'Tempat Lahir',
      'NIK',
      'NISN',
      'Agama',
      'Sekolah Saat Ini',
      'Negara Sekolah',
      'Wilayah Domisili',
      'Alamat Indonesia',
      'Telepon',
      'Pekerjaan Orang Tua/Wali',
    ];
    const lines = [headers.map((h) => this.csvEscape(h)).join(',')];
    for (const s of rows) {
      const parentOccupation = (s.application?.contacts ?? [])
        .map((c) => `${c.relationship}: ${c.occupation}`)
        .join('; ') || '';
      const birthDate = s.studentBirthDate
        ? new Date(s.studentBirthDate).toISOString().slice(0, 10)
        : '';
      lines.push(
        [
          this.csvEscape(s.application?.applicationNo),
          this.csvEscape(s.studentFullName),
          this.csvEscape(s.programChoice),
          this.csvEscape(s.gradeApplied),
          this.csvEscape(s.studentGender === 'MALE' ? 'Laki-laki' : s.studentGender === 'FEMALE' ? 'Perempuan' : s.studentGender),
          this.csvEscape(birthDate),
          this.csvEscape(s.birthPlace),
          this.csvEscape(s.nik),
          this.csvEscape(s.nisn),
          this.csvEscape(s.religion),
          this.csvEscape(s.currentSchoolName),
          this.csvEscape(s.currentSchoolCountry),
          this.csvEscape(s.domicileRegion),
          this.csvEscape(s.addressIndonesia),
          this.csvEscape(s.phoneCountryCode + ' ' + s.phoneNumber),
          this.csvEscape(parentOccupation),
        ].join(','),
      );
    }
    return BOM + lines.join('\r\n');
  }

  /** Admin: approve application */
  async adminApprove(id: string, statusType?: 'preRegistration' | 'fullRegistration') {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationSubmission: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    
    const type = statusType || 'fullRegistration'; // Default to full registration for backward compatibility
    
    if (type === 'preRegistration') {
      if (!app.preRegistration) throw new NotFoundException('Pre-registration not found');
      if (app.preRegistration.status === ApplicationStatus.APPROVED) {
        throw new BadRequestException('Pre-registration already approved');
      }
      const applicantEmail = app.applicantEmail.trim().toLowerCase();
      const passwordHash = await bcrypt.hash(PARENT_TEST_PASSWORD, 10);
      await this.prisma.$transaction(async (tx) => {
        await tx.applicationPreRegistration.update({
          where: { applicationId: id },
          data: { status: ApplicationStatus.APPROVED, decisionReason: null },
        });
        const parentUser = await tx.user.upsert({
          where: { email: applicantEmail },
          create: {
            email: applicantEmail,
            passwordHash,
            role: UserRole.PARENT,
          },
          update: { passwordHash },
        });
        await tx.application.update({
          where: { id },
          data: { parentUserId: parentUser.id },
        });
      });
    } else {
      if (app.status === ApplicationStatus.APPROVED) {
        throw new BadRequestException('Application already approved');
      }
      await this.prisma.$transaction(async (tx) => {
        await tx.application.update({
          where: { id },
          data: { status: ApplicationStatus.APPROVED, decisionReason: null },
        });
        // Create student profile when full registration is approved (if submission exists and no student yet)
        if (app.registrationSubmission) {
          const existing = await tx.student.findUnique({
            where: { applicationId: id },
          });
          if (!existing) {
            const sub = app.registrationSubmission;
            await tx.student.create({
              data: {
                applicationId: id,
                studentFullName: sub.studentFullName,
                programChoice: sub.programChoice,
                gradeApplied: sub.gradeApplied,
                studentGender: sub.studentGender,
                studentBirthDate: sub.studentBirthDate,
                birthPlace: sub.birthPlace,
                nik: sub.nik,
                religion: sub.religion,
                heightCm: sub.heightCm,
                weightKg: sub.weightKg,
                nisn: sub.nisn,
                lastSchoolIndonesia: sub.lastSchoolIndonesia,
                currentSchoolName: sub.currentSchoolName,
                currentSchoolCountry: sub.currentSchoolCountry,
                childOrder: sub.childOrder,
                siblingsCount: sub.siblingsCount,
                lastDiplomaSerialNumber: sub.lastDiplomaSerialNumber ?? null,
                hasSpecialNeeds: sub.hasSpecialNeeds,
                addressIndonesia: sub.addressIndonesia,
                domicileRegion: sub.domicileRegion,
                phoneCountryCode: sub.phoneCountryCode,
                phoneNumber: sub.phoneNumber,
              },
            });
          }
        }
      });
    }
    
    return this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationPeriod: true, registrationSubmission: true },
    });
  }

  /** Admin: reject application (note required) */
  async adminReject(id: string, dto: DecisionNoteDto) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationSubmission: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    
    const statusType = dto.statusType || 'fullRegistration'; // Default to full registration for backward compatibility
    
    if (statusType === 'preRegistration') {
      if (!app.preRegistration) throw new NotFoundException('Pre-registration not found');
      await this.prisma.applicationPreRegistration.update({
        where: { applicationId: id },
        data: { status: ApplicationStatus.REJECTED, decisionReason: dto.note },
      });
    } else {
      await this.prisma.application.update({
        where: { id },
        data: { status: ApplicationStatus.REJECTED, decisionReason: dto.note },
      });
    }
    
    return this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationPeriod: true, registrationSubmission: true },
    });
  }

  /** Admin: request changes (note required) */
  async adminRequestChanges(id: string, dto: DecisionNoteDto) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationSubmission: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    
    const statusType = dto.statusType || 'fullRegistration'; // Default to full registration for backward compatibility
    
    if (statusType === 'preRegistration') {
      if (!app.preRegistration) throw new NotFoundException('Pre-registration not found');
      await this.prisma.applicationPreRegistration.update({
        where: { applicationId: id },
        data: { status: ApplicationStatus.CHANGES_REQUESTED, decisionReason: dto.note },
      });
    } else {
      await this.prisma.application.update({
        where: { id },
        data: { status: ApplicationStatus.CHANGES_REQUESTED, decisionReason: dto.note },
      });
    }
    
    return this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationPeriod: true, registrationSubmission: true },
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
      include: { preRegistration: true, registrationSubmission: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    
    const statusType = dto.statusType || 'fullRegistration'; // Default to full registration for backward compatibility
    
    if (statusType === 'preRegistration') {
      if (!app.preRegistration) throw new NotFoundException('Pre-registration not found');
      // Update pre-registration status
      await this.prisma.applicationPreRegistration.update({
        where: { applicationId: id },
        data: {
          status: dto.status,
          decisionReason: dto.decisionReason || null,
          submittedAt: dto.status === ApplicationStatus.SUBMITTED ? new Date() : app.preRegistration.submittedAt,
        },
      });
    } else {
      // Update full registration status (Application.status)
      await this.prisma.application.update({
        where: { id },
        data: {
          status: dto.status,
          decisionReason: dto.decisionReason || null,
          submittedAt: dto.status === ApplicationStatus.SUBMITTED ? new Date() : app.submittedAt,
        },
      });
      // Create student profile when full registration is set to APPROVED (e.g. via Simpan on detail page)
      if (dto.status === ApplicationStatus.APPROVED && app.registrationSubmission) {
        const existing = await this.prisma.student.findUnique({
          where: { applicationId: id },
        });
        if (!existing) {
          const sub = app.registrationSubmission;
          await this.prisma.student.create({
            data: {
              applicationId: id,
              studentFullName: sub.studentFullName,
              programChoice: sub.programChoice,
              gradeApplied: sub.gradeApplied,
              studentGender: sub.studentGender,
              studentBirthDate: sub.studentBirthDate,
              birthPlace: sub.birthPlace,
              nik: sub.nik,
              religion: sub.religion,
              heightCm: sub.heightCm,
              weightKg: sub.weightKg,
              nisn: sub.nisn,
              lastSchoolIndonesia: sub.lastSchoolIndonesia,
              currentSchoolName: sub.currentSchoolName,
              currentSchoolCountry: sub.currentSchoolCountry,
              childOrder: sub.childOrder,
              siblingsCount: sub.siblingsCount,
              lastDiplomaSerialNumber: sub.lastDiplomaSerialNumber ?? null,
              hasSpecialNeeds: sub.hasSpecialNeeds,
              addressIndonesia: sub.addressIndonesia,
              domicileRegion: sub.domicileRegion,
              phoneCountryCode: sub.phoneCountryCode,
              phoneNumber: sub.phoneNumber,
            },
          });
        }
      }
    }
    
    return this.prisma.application.findUnique({
      where: { id },
      include: { preRegistration: true, registrationPeriod: true, registrationSubmission: true },
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
   * Parent: Update full registration data (Step 1 & 2) as draft.
   * Only allowed when Application.status is DRAFT or CHANGES_REQUESTED.
   * Partial save: only provided fields are updated; on first create use placeholder defaults for required fields.
   */
  async parentUpdateFullRegistration(
    applicationId: string,
    parentUserId: number,
    parentEmail: string | undefined,
    callerRole: string | undefined,
    dto: UpdateFullRegistrationDto,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { registrationPeriod: true, registrationSubmission: true },
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

      // Parent may edit full registration only when status is DRAFT or CHANGES_REQUESTED
      if (
        application.status !== ApplicationStatus.DRAFT &&
        application.status !== ApplicationStatus.CHANGES_REQUESTED
      ) {
        throw new ForbiddenException(
          'Application cannot be edited after submission. Status must be draft or changes requested.',
        );
      }
    }

    if (application.registrationPeriod.status !== RegistrationPeriodStatus.OPEN) {
      throw new ForbiddenException('Registration period is closed');
    }

    return this.prisma.$transaction(async (tx) => {
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

      const hasAnyStep1Field =
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
        dto.phoneNumber != null;

      if (hasAnyStep1Field) {
        const existing = application.registrationSubmission;

        if (existing) {
          const updateData = this.buildRegistrationSubmissionPartialUpdate(dto);
          if (Object.keys(updateData).length > 0) {
            await tx.registrationSubmission.update({
              where: { applicationId },
              data: updateData,
            });
          }
        } else {
          const createData = this.buildRegistrationSubmissionCreateData(dto);
          await tx.registrationSubmission.create({
            data: {
              application: { connect: { id: applicationId } },
              ...createData,
            },
          });
        }
      }

      if (dto.contacts && dto.contacts.length > 0) {
        await tx.applicationContact.deleteMany({
          where: { applicationId },
        });
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

  /** Build partial update: only fields present in dto (no overwrite with blanks) */
  private buildRegistrationSubmissionPartialUpdate(
    dto: UpdateFullRegistrationDto,
  ): Prisma.RegistrationSubmissionUpdateInput {
    const num = (v: string | undefined): number | undefined => {
      if (v == null || v === '') return undefined;
      const n = parseInt(String(v).trim(), 10);
      return Number.isNaN(n) ? undefined : n;
    };
    const str = (v: string | undefined): string | undefined =>
      v != null ? String(v).trim() : undefined;
    const date = (v: string | undefined): Date | undefined =>
      v ? new Date(v) : undefined;

    const data: Prisma.RegistrationSubmissionUpdateInput = {};
    if (dto.studentName !== undefined) data.studentFullName = str(dto.studentName) ?? DRAFT_STR;
    if (dto.programChoice !== undefined) data.programChoice = str(dto.programChoice) ?? DRAFT_STR;
    if (dto.gradeApplied !== undefined) data.gradeApplied = str(dto.gradeApplied) ?? DRAFT_STR;
    if (dto.studentGender !== undefined) data.studentGender = dto.studentGender as StudentGender;
    if (dto.studentBirthDate !== undefined) data.studentBirthDate = date(dto.studentBirthDate) ?? DRAFT_DATE;
    if (dto.birthPlace !== undefined) data.birthPlace = str(dto.birthPlace) ?? DRAFT_STR;
    if (dto.nik !== undefined) data.nik = str(dto.nik) ?? DRAFT_STR;
    if (dto.religion !== undefined) data.religion = str(dto.religion) ?? DRAFT_STR;
    if (dto.heightCm !== undefined) data.heightCm = num(dto.heightCm) ?? DRAFT_NUM;
    if (dto.weightKg !== undefined) data.weightKg = num(dto.weightKg) ?? DRAFT_NUM;
    if (dto.nisn !== undefined) data.nisn = str(dto.nisn) ?? DRAFT_STR;
    if (dto.lastSchoolIndonesia !== undefined) data.lastSchoolIndonesia = str(dto.lastSchoolIndonesia) ?? DRAFT_STR;
    if (dto.currentSchoolName !== undefined) data.currentSchoolName = str(dto.currentSchoolName) ?? DRAFT_STR;
    if (dto.currentSchoolCountry !== undefined) data.currentSchoolCountry = str(dto.currentSchoolCountry) ?? DRAFT_STR;
    if (dto.childOrder !== undefined) data.childOrder = num(dto.childOrder) ?? DRAFT_CHILD_ORDER;
    if (dto.siblingCount !== undefined) data.siblingsCount = num(dto.siblingCount) ?? DRAFT_SIBLINGS_COUNT;
    if (dto.lastDiplomaSerialNumber !== undefined) data.lastDiplomaSerialNumber = dto.lastDiplomaSerialNumber?.trim() || null;
    if (dto.hasSpecialNeeds !== undefined) data.hasSpecialNeeds = str(dto.hasSpecialNeeds) ?? 'NO';
    if (dto.addressIndonesia !== undefined) data.addressIndonesia = str(dto.addressIndonesia) ?? DRAFT_STR;
    if (dto.domicileRegion !== undefined) data.domicileRegion = str(dto.domicileRegion) ?? DRAFT_STR;
    if (dto.phoneCountryCode !== undefined) data.phoneCountryCode = str(dto.phoneCountryCode) ?? '+62';
    if (dto.phoneNumber !== undefined) data.phoneNumber = str(dto.phoneNumber) ?? DRAFT_STR;
    if (dto.parentServiceCountry !== undefined) data.parentServiceCountry = str(dto.parentServiceCountry) ?? null;
    if (dto.domicilePeriodStart !== undefined) data.domicilePeriodStart = date(dto.domicilePeriodStart) ?? null;
    if (dto.domicilePeriodEnd !== undefined) data.domicilePeriodEnd = date(dto.domicilePeriodEnd) ?? null;
    if (dto.parentVisaType !== undefined) data.parentVisaType = str(dto.parentVisaType) ?? null;
    if (dto.description !== undefined) data.description = str(dto.description) ?? null;
    if (dto.additionalInfo !== undefined) data.additionalInfo = str(dto.additionalInfo) ?? null;
    return data;
  }

  /** Build create data: provided values + placeholder defaults for required fields (scalar fields only; use application.connect at call site). */
  private buildRegistrationSubmissionCreateData(
    dto: UpdateFullRegistrationDto,
  ): Omit<Prisma.RegistrationSubmissionCreateInput, 'application'> {
    const num = (v: string | undefined, fallback: number) => {
      if (v == null || v === '') return fallback;
      const n = parseInt(String(v).trim(), 10);
      return Number.isNaN(n) ? fallback : n;
    };
    const str = (v: string | undefined, fallback: string) =>
      v != null && String(v).trim() !== '' ? String(v).trim() : fallback;
    const date = (v: string | undefined) =>
      v ? new Date(v) : DRAFT_DATE;

    return {
      studentFullName: str(dto.studentName, DRAFT_STR),
      programChoice: str(dto.programChoice, DRAFT_STR),
      gradeApplied: str(dto.gradeApplied, DRAFT_STR),
      studentGender: (dto.studentGender ?? StudentGender.MALE) as StudentGender,
      studentBirthDate: date(dto.studentBirthDate),
      birthPlace: str(dto.birthPlace, DRAFT_STR),
      nik: str(dto.nik, DRAFT_STR),
      religion: str(dto.religion, DRAFT_STR),
      heightCm: num(dto.heightCm, DRAFT_NUM),
      weightKg: num(dto.weightKg, DRAFT_NUM),
      nisn: str(dto.nisn, DRAFT_STR),
      lastSchoolIndonesia: str(dto.lastSchoolIndonesia, DRAFT_STR),
      currentSchoolName: str(dto.currentSchoolName, DRAFT_STR),
      currentSchoolCountry: str(dto.currentSchoolCountry, DRAFT_STR),
      childOrder: num(dto.childOrder, DRAFT_CHILD_ORDER),
      siblingsCount: num(dto.siblingCount, DRAFT_SIBLINGS_COUNT),
      lastDiplomaSerialNumber: dto.lastDiplomaSerialNumber?.trim() || null,
      hasSpecialNeeds: str(dto.hasSpecialNeeds, 'NO'),
      addressIndonesia: str(dto.addressIndonesia, DRAFT_STR),
      domicileRegion: str(dto.domicileRegion, DRAFT_STR),
      phoneCountryCode: str(dto.phoneCountryCode, '+62'),
      phoneNumber: str(dto.phoneNumber, DRAFT_STR),
      parentServiceCountry: (dto.parentServiceCountry?.trim() || null) as string | null,
      domicilePeriodStart: dto.domicilePeriodStart ? new Date(dto.domicilePeriodStart) : null,
      domicilePeriodEnd: dto.domicilePeriodEnd ? new Date(dto.domicilePeriodEnd) : null,
      parentVisaType: (dto.parentVisaType?.trim() || null) as string | null,
      description: (dto.description?.trim() || null) as string | null,
      additionalInfo: (dto.additionalInfo?.trim() || null) as string | null,
    };
  }

  /**
   * Parent: Submit full registration. Validates required fields (non-placeholder) then sets status SUBMITTED.
   */
  async parentSubmitFullRegistration(
    applicationId: string,
    parentUserId: number,
    parentEmail: string | undefined,
    callerRole: string | undefined,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        registrationPeriod: true,
        registrationSubmission: true,
        contacts: true,
        documents: true,
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

      if (
        application.status !== ApplicationStatus.DRAFT &&
        application.status !== ApplicationStatus.CHANGES_REQUESTED
      ) {
        throw new ForbiddenException('Application is already submitted or cannot be edited.');
      }
    }

    if (application.registrationPeriod.status !== RegistrationPeriodStatus.OPEN) {
      throw new ForbiddenException('Registration period is closed');
    }

    if (!application.registrationSubmission) {
      throw new BadRequestException('Full registration data is required before submit. Please complete and save the form.');
    }

    const errors = this.validateFullRegistrationForSubmit(application.registrationSubmission, application.contacts);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      },
      include: {
        registrationSubmission: true,
        contacts: true,
        registrationPeriod: true,
      },
    });
  }

  /** Validate required fields are not placeholder (for submit). Returns list of field errors. */
  private validateFullRegistrationForSubmit(
    submission: { studentFullName: string; programChoice: string; gradeApplied: string; studentGender: string; studentBirthDate: Date; birthPlace: string; nik: string; religion: string; heightCm: number; weightKg: number; nisn: string; lastSchoolIndonesia: string; currentSchoolName: string; currentSchoolCountry: string; childOrder: number; siblingsCount: number; hasSpecialNeeds: string; addressIndonesia: string; domicileRegion: string; phoneCountryCode: string; phoneNumber: string },
    contacts: { id: string }[],
  ): string[] {
    const errors: string[] = [];
    const str = (v: string) => v != null && String(v).trim() !== '';
    const num = (v: number) => v != null && !Number.isNaN(v) && v > 0;
    const numNonNegative = (v: number) => v != null && !Number.isNaN(v) && v >= 0;
    const dateValid = (d: Date) => d && d.getTime() > DRAFT_DATE.getTime();

    if (!str(submission.studentFullName)) errors.push('Nama lengkap siswa wajib diisi');
    if (!str(submission.programChoice)) errors.push('Program pilihan wajib diisi');
    if (!str(submission.gradeApplied)) errors.push('Kelas yang didaftarkan wajib diisi');
    if (!dateValid(submission.studentBirthDate)) errors.push('Tanggal lahir wajib diisi');
    if (!str(submission.birthPlace)) errors.push('Tempat lahir wajib diisi');
    if (!str(submission.nik)) errors.push('NIK wajib diisi');
    if (!str(submission.religion)) errors.push('Agama wajib diisi');
    if (!num(submission.heightCm)) errors.push('Tinggi badan wajib diisi (lebih dari 0)');
    if (!num(submission.weightKg)) errors.push('Berat badan wajib diisi (lebih dari 0)');
    if (!str(submission.nisn)) errors.push('NISN wajib diisi');
    if (!str(submission.lastSchoolIndonesia)) errors.push('Sekolah terakhir di Indonesia wajib diisi');
    if (!str(submission.currentSchoolName)) errors.push('Nama sekolah saat ini wajib diisi');
    if (!str(submission.currentSchoolCountry)) errors.push('Negara sekolah saat ini wajib diisi');
    if (!numNonNegative(submission.childOrder)) errors.push('Anak ke wajib diisi (0 atau lebih)');
    if (!numNonNegative(submission.siblingsCount)) errors.push('Jumlah saudara kandung wajib diisi (0 atau lebih)');
    if (!str(submission.addressIndonesia)) errors.push('Alamat di Indonesia wajib diisi');
    if (!str(submission.domicileRegion)) errors.push('Wilayah domisili wajib diisi');
    if (!str(submission.phoneNumber)) errors.push('Nomor telepon wajib diisi');

    if (contacts.length === 0) {
      errors.push('Minimal satu data kontak (ayah/ibu/wali) wajib diisi');
    }

    return errors;
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
