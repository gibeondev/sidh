-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StudentGender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "application_no" TEXT NOT NULL,
    "applicant_email" TEXT NOT NULL,
    "parent_user_id" INTEGER,
    "registration_period_id" UUID NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "decision_reason" TEXT,
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_pre_registrations" (
    "application_id" UUID NOT NULL,
    "applicant_name" TEXT NOT NULL,
    "applicant_relationship" TEXT NOT NULL,
    "reason_living_abroad" TEXT NOT NULL,
    "reason_to_apply" TEXT NOT NULL,
    "assignment_city" TEXT NOT NULL,
    "assignment_country" TEXT NOT NULL,
    "domicile_start_date" DATE NOT NULL,
    "domicile_end_date" DATE NOT NULL,
    "permit_expiry_date" DATE NOT NULL,
    "program_choice" TEXT NOT NULL,
    "education_level" TEXT NOT NULL,
    "grade_applied" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "student_gender" "StudentGender" NOT NULL,
    "student_birth_date" DATE NOT NULL,
    "last_education_location" TEXT NOT NULL,
    "nisn" TEXT,

    CONSTRAINT "application_pre_registrations_pkey" PRIMARY KEY ("application_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_application_no_key" ON "applications"("application_no");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_registration_period_id_fkey" FOREIGN KEY ("registration_period_id") REFERENCES "registration_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_parent_user_id_fkey" FOREIGN KEY ("parent_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_pre_registrations" ADD CONSTRAINT "application_pre_registrations_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
