import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  ParentDocumentsController,
  AdminDocumentsController,
  AdminDocumentActionsController,
} from './documents.controller';
import { S3Module } from '../s3/s3.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [S3Module, PrismaModule],
  controllers: [
    ParentDocumentsController,
    AdminDocumentsController,
    AdminDocumentActionsController,
  ],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
