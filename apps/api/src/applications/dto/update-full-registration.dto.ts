import {
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudentGender } from '@prisma/client';

export enum ContactRelationshipDto {
  Father = 'Father',
  Mother = 'Mother',
  Guardian = 'Guardian',
}

export class ContactDto {
  @IsEnum(ContactRelationshipDto)
  relationship!: ContactRelationshipDto;

  @IsString()
  @MinLength(1)
  fullName!: string;

  @IsString()
  @MinLength(1)
  birthPlace!: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  @MinLength(1)
  nik!: string;

  @IsString()
  @MinLength(1)
  educationLevel!: string;

  @IsString()
  @MinLength(1)
  occupation!: string;

  @IsString()
  @MinLength(1)
  incomeRange!: string;

  @IsString()
  @MinLength(1)
  phone!: string;

  @IsEmail()
  email!: string;
}

export class UpdateFullRegistrationDto {
  // Step 1 - Student Data
  @IsOptional()
  @IsString()
  @MinLength(1)
  studentName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  programChoice?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  gradeApplied?: string;

  @IsOptional()
  @IsEnum(StudentGender)
  studentGender?: StudentGender;

  @IsOptional()
  @IsDateString()
  studentBirthDate?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  birthPlace?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  nik?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  religion?: string;

  @IsOptional()
  @IsString()
  heightCm?: string;

  @IsOptional()
  @IsString()
  weightKg?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  nisn?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  lastSchoolIndonesia?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  currentSchoolName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  currentSchoolCountry?: string;

  @IsOptional()
  @IsString()
  childOrder?: string;

  @IsOptional()
  @IsString()
  siblingCount?: string;

  @IsOptional()
  @IsString()
  lastDiplomaSerialNumber?: string;

  @IsOptional()
  @IsString()
  hasSpecialNeeds?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  addressIndonesia?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  domicileRegion?: string;

  @IsOptional()
  @IsString()
  phoneCountryCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  phoneNumber?: string;

  // Step 2 - Contacts
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  // Step 3 - Address & Domicile
  @IsOptional()
  @IsString()
  @MinLength(1)
  parentServiceCountry?: string;

  @IsOptional()
  @IsDateString()
  domicilePeriodStart?: string;

  @IsOptional()
  @IsDateString()
  domicilePeriodEnd?: string;

  @IsOptional()
  @IsString()
  parentVisaType?: string;

  // Step 4 - Special Needs & Additional Information
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  // Step 5 - Documents
  // Note: Document uploads are handled via separate endpoint:
  // POST /parent/applications/:id/documents (see Task 06)
  // This DTO does not include document fields as files are uploaded separately
}
