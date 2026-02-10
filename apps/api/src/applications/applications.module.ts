import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApplicationsService } from './applications.service';
import { PublicApplicationsController } from './public-applications.controller';

@Module({
  imports: [PrismaModule],
  providers: [ApplicationsService],
  controllers: [PublicApplicationsController],
})
export class ApplicationsModule {}
