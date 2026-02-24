-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('REPORT_CARD', 'LAST_DIPLOMA', 'NISN_CARD', 'TRANSFER_LETTER', 'BIRTH_CERTIFICATE', 'FAMILY_CARD', 'STUDENT_RESIDENCE_PERMIT', 'STUDENT_PASSPORT', 'STUDENT_PHOTO', 'PARENT_RESIDENCE_PERMIT', 'PARENT_PASSPORT', 'SCHOOL_CERTIFICATE', 'ATDIKBUD_CERTIFICATE', 'EQUIVALENCY_LETTER', 'STUDENT_PERMIT_LETTER', 'PARENT_STATEMENT');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('OPEN', 'POSTPONED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'OPEN',
    "s3_key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER NOT NULL,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" INTEGER,
    "review_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_audit_logs" (
    "id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "performed_by" INTEGER NOT NULL,
    "performed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "document_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_application_id_document_type_key" ON "documents"("application_id", "document_type");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_audit_logs" ADD CONSTRAINT "document_audit_logs_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_audit_logs" ADD CONSTRAINT "document_audit_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
