import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class UpdateStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @IsOptional()
  @IsString()
  decisionReason?: string;

  @IsOptional()
  @IsString()
  statusType?: 'preRegistration' | 'fullRegistration'; // Which status to update
}
