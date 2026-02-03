import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RegistrationPeriodsService } from './registration-periods.service';
import { PublicRegistrationPeriodsController } from './public-registration-periods.controller';
import { AdminRegistrationPeriodsController } from './admin-registration-periods.controller';

@Module({
  imports: [PrismaModule],
  providers: [RegistrationPeriodsService],
  controllers: [
    PublicRegistrationPeriodsController,
    AdminRegistrationPeriodsController,
  ],
})
export class RegistrationPeriodsModule {}

