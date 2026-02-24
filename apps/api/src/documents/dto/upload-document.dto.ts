import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class UploadDocumentDto {
  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType!: DocumentType;
}
