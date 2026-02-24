-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "student_full_name" TEXT NOT NULL,
    "program_choice" TEXT NOT NULL,
    "grade_applied" TEXT NOT NULL,
    "student_gender" "StudentGender" NOT NULL,
    "student_birth_date" DATE NOT NULL,
    "birth_place" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "height_cm" INTEGER NOT NULL,
    "weight_kg" INTEGER NOT NULL,
    "nisn" TEXT NOT NULL,
    "last_school_indonesia" TEXT NOT NULL,
    "current_school_name" TEXT NOT NULL,
    "current_school_country" TEXT NOT NULL,
    "child_order" INTEGER NOT NULL,
    "siblings_count" INTEGER NOT NULL,
    "last_diploma_serial_number" TEXT,
    "has_special_needs" TEXT NOT NULL,
    "address_indonesia" TEXT NOT NULL,
    "domicile_region" TEXT NOT NULL,
    "phone_country_code" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_application_id_key" ON "students"("application_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
