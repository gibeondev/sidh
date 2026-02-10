import {
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export enum StudentGenderDto {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class PreRegisterDto {
  @IsEmail()
  applicantEmail!: string;

  @IsString()
  @MinLength(1)
  applicantName!: string;

  @IsString()
  @MinLength(1)
  applicantRelationship!: string;

  @IsString()
  @MinLength(1)
  reasonLivingAbroad!: string;

  @IsString()
  @MinLength(1)
  reasonToApply!: string;

  @IsString()
  @MinLength(1)
  assignmentCity!: string;

  @IsString()
  @MinLength(1)
  assignmentCountry!: string;

  @IsDateString()
  domicileStartDate!: string;

  @IsDateString()
  domicileEndDate!: string;

  @IsDateString()
  permitExpiryDate!: string;

  @IsString()
  @MinLength(1)
  programChoice!: string;

  @IsString()
  @MinLength(1)
  educationLevel!: string;

  @IsString()
  @MinLength(1)
  gradeApplied!: string;

  @IsString()
  @MinLength(1)
  studentName!: string;

  @IsEnum(StudentGenderDto)
  studentGender!: StudentGenderDto;

  @IsDateString()
  studentBirthDate!: string;

  @IsString()
  @MinLength(1)
  lastEducationLocation!: string;

  @IsOptional()
  @IsString()
  nisn?: string;
}
