import { Controller, Get } from '@nestjs/common';
import { RegistrationPeriodsService } from './registration-periods.service';

@Controller('public/registration-periods')
export class PublicRegistrationPeriodsController {
  constructor(
    private readonly registrationPeriodsService: RegistrationPeriodsService,
  ) {}

  @Get('active')
  async getActive() {
    const period = await this.registrationPeriodsService.getActive();
    return { period: period ?? null };
  }
}

