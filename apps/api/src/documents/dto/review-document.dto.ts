import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentStatus } from '@prisma/client';

export class ReviewDocumentDto {
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @IsString()
  reviewNote?: string;
}
