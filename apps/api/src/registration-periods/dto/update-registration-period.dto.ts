import { IsString, IsDateString, MinLength, IsOptional } from 'class-validator';

export class UpdateRegistrationPeriodDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;
}

