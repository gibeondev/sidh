-- AlterTable
ALTER TABLE "application_pre_registrations" ADD COLUMN "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "application_pre_registrations" ADD COLUMN "decision_reason" TEXT;
ALTER TABLE "application_pre_registrations" ADD COLUMN "submitted_at" TIMESTAMP(3);
