-- AlterTable
ALTER TABLE "registration_submissions" ADD COLUMN "parent_service_country" TEXT;
ALTER TABLE "registration_submissions" ADD COLUMN "domicile_period_start" DATE;
ALTER TABLE "registration_submissions" ADD COLUMN "domicile_period_end" DATE;
ALTER TABLE "registration_submissions" ADD COLUMN "parent_visa_type" TEXT;
ALTER TABLE "registration_submissions" ADD COLUMN "description" TEXT;
ALTER TABLE "registration_submissions" ADD COLUMN "additional_info" TEXT;
