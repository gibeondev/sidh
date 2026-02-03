import { IsString, IsDateString, MinLength } from 'class-validator';

export class CreateRegistrationPeriodDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}

