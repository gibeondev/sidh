import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApplicationsService } from './applications.service';
import { PublicApplicationsController } from './public-applications.controller';
import { AdminApplicationsController } from './admin-applications.controller';
import { ParentApplicationsController } from './parent-applications.controller';

@Module({
  imports: [PrismaModule],
  providers: [ApplicationsService],
  controllers: [
    PublicApplicationsController,
    AdminApplicationsController,
    ParentApplicationsController,
  ],
})
export class ApplicationsModule {}
