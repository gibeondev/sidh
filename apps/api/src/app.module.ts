import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RegistrationPeriodsModule } from './registration-periods/registration-periods.module';
import { ApplicationsModule } from './applications/applications.module';
import { DocumentsModule } from './documents/documents.module';
import { S3Module } from './s3/s3.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: [join(__dirname, '..', '.env'), '.env'],
    }),
    PrismaModule,
    AuthModule,
    RegistrationPeriodsModule,
    ApplicationsModule,
    S3Module,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
