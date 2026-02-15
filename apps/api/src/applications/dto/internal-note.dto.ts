import { IsOptional, IsString } from 'class-validator';

export class InternalNoteDto {
  @IsOptional()
  @IsString()
  note?: string;
}
