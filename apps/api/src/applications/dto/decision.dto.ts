import { IsString, MinLength } from 'class-validator';

export class DecisionNoteDto {
  @IsString()
  @MinLength(1, { message: 'Note/reason is required for this action' })
  note!: string;
}
