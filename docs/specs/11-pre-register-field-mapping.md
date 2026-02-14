# Pre-Registration Field Mapping: UI ↔ API ↔ Database

## Files Inspected

### Database Schema
- `packages/prisma/prisma/schema.prisma` - Prisma models: `Application`, `ApplicationPreRegistration`

### API Layer
- `apps/api/src/applications/dto/pre-register.dto.ts` - Request DTO (`PreRegisterDto`)
- `apps/api/src/applications/applications.service.ts` - Service mapping logic
- `apps/api/src/applications/public-applications.controller.ts` - Controller endpoint

### Frontend UI
- `apps/web/lib/api/applications.ts` - Frontend API client (`PreRegisterRequest` interface)
- `apps/web/app/pre-register/step-1/page.tsx` - Step 1 page (informational, no form fields)
- `apps/web/components/pre-register/RegistrationProcedureStep.tsx` - Step 1 component
- `apps/web/app/pre-register/step-2/page.tsx` - Step 2 page
- `apps/web/components/pre-register/ParentGuardianStep.tsx` - Step 2 component
- `apps/web/app/pre-register/step-3/page.tsx` - Step 3 page
- `apps/web/components/pre-register/StudentIdentityStep.tsx` - Step 3 component
- `apps/web/app/pre-register/step-4/page.tsx` - Step 4 page (placeholder, no form fields)

---

## A) Database Fields (Prisma Models)

### Application Model
```prisma
model Application {
  id                     String               @id @default(uuid()) @db.Uuid
  applicationNo          String               @unique @map("application_no")
  applicantEmail         String               @map("applicant_email")
  parentUserId           Int?                 @map("parent_user_id")
  registrationPeriodId   String               @map("registration_period_id") @db.Uuid
  status                 ApplicationStatus    @default(DRAFT)
  decisionReason         String?              @map("decision_reason")
  submittedAt            DateTime?            @map("submitted_at")
  createdAt              DateTime             @default(now()) @map("created_at")
  updatedAt              DateTime             @updatedAt @map("updated_at")
}
```

**Fields populated during pre-registration:**
- `applicationNo` - Auto-generated (format: `APP-{YEAR}-{SEQ}`)
- `applicantEmail` - From UI Step 2
- `registrationPeriodId` - Auto-selected (current OPEN period)
- `status` - Set to `DRAFT` on creation
- `parentUserId` - NULL (no parent account created yet)
- `decisionReason` - NULL (not set during pre-registration)
- `submittedAt` - NULL (not submitted yet)

### ApplicationPreRegistration Model
```prisma
model ApplicationPreRegistration {
  applicationId          String       @id @map("application_id") @db.Uuid
  applicantName           String       @map("applicant_name")
  applicantRelationship   String       @map("applicant_relationship")
  reasonLivingAbroad      String       @map("reason_living_abroad")
  reasonToApply           String       @map("reason_to_apply")
  assignmentCity         String       @map("assignment_city")
  assignmentCountry      String       @map("assignment_country")
  domicileStartDate       DateTime     @map("domicile_start_date") @db.Date
  domicileEndDate        DateTime     @map("domicile_end_date") @db.Date
  permitExpiryDate       DateTime     @map("permit_expiry_date") @db.Date
  programChoice          String       @map("program_choice")
  educationLevel         String       @map("education_level")
  gradeApplied           String       @map("grade_applied")
  studentName            String       @map("student_name")
  studentGender          StudentGender @map("student_gender")
  studentBirthDate       DateTime     @map("student_birth_date") @db.Date
  lastEducationLocation  String       @map("last_education_location")
  nisn                   String?      @map("nisn")
}
```

**All fields** are populated from the pre-registration form.

---

## B) API Request Payload Shape

**Endpoint:** `POST /public/applications/pre-register`

**Request Body (PreRegisterDto):**
```json
{
  "applicantEmail": "parent@example.com",
  "applicantName": "John Doe",
  "applicantRelationship": "Ayah",
  "reasonLivingAbroad": "Diplomatic assignment",
  "reasonToApply": "Want Indonesian curriculum",
  "assignmentCity": "123 Main St, Den Haag",
  "assignmentCountry": "NL",
  "domicileStartDate": "2025-01-01",
  "domicileEndDate": "2026-12-31",
  "permitExpiryDate": "2026-12-31",
  "programChoice": "PTM",
  "educationLevel": "SMA",
  "gradeApplied": "10",
  "studentName": "Jane Doe",
  "studentGender": "MALE",
  "studentBirthDate": "2010-05-15",
  "lastEducationLocation": "Indonesia",
  "nisn": "1234567890"
}
```

**Response Shape:**
```json
{
  "applicationId": "uuid-string",
  "applicationNo": "APP-2025-0001"
}
```

**Validation Rules (from DTO):**
- `applicantEmail`: `@IsEmail()` - Must be valid email
- All string fields (except `nisn`): `@MinLength(1)` - Required, non-empty
- `nisn`: `@IsOptional()` - Optional field
- Date fields: `@IsDateString()` - ISO date string format (YYYY-MM-DD)
- `studentGender`: `@IsEnum(StudentGenderDto)` - Must be `'MALE'` or `'FEMALE'`

**Service Logic:**
- `domicileEndDate` must be >= `domicileStartDate` (validated in service)
- Dates converted from ISO strings to `Date` objects before DB insert
- `studentGender` cast to Prisma `StudentGender` enum
- `nisn` converted: empty string → `null` in database

---

## C) UI Field Inventory

### Step 1: PROSEDUR PENDAFTARAN
**Component:** `RegistrationProcedureStep`
**Fields:** None (informational only)
- Greeting text
- Introduction paragraph with link
- 8 numbered procedure guidelines
- Red disclaimer text

### Step 2: DATA ORANG TUA/WALI SISWA
**Component:** `ParentGuardianStep`
**Fields:**
1. **Email pendaftar** (`applicantEmail`) - Text input, email type
2. **Jenis penugasan/alasan tinggal di luar negeri** (`reasonLivingAbroad`) - Text input
3. **Alasan mendaftar ke SIDH** (`reasonToApply`) - Text input
4. **Hubungan pendaftar dengan calon siswa** (`applicantRelationship`) - Radio group
   - Options: "Ayah", "Ibu", "Wali"
5. **Nama orang tua pendaftar** (`applicantName`) - Text input
6. **Alamat domisili** (`assignmentCity`) - Text input
7. **Negara domisili** (`assignmentCountry`) - Select dropdown
   - Options: NL, ID, DE, BE, OTHER
8. **Rencana periode domisili** - Date range
   - **Mulai** (`domicileStartDate`) - Date input
   - **Akhir** (`domicileEndDate`) - Date input
9. **Tanggal masa berlaku visa/izin tinggal** (`permitExpiryDate`) - Date input

### Step 3: IDENTITAS SISWA
**Component:** `StudentIdentityStep`
**Fields:**
1. **Mendaftar untuk program** (`programChoice`) - Radio group
   - Options: "PJJ", "PTM"
2. **Jenjang pendidikan** (`educationLevel`) - Radio group
   - Options: "SD", "SMP", "SMA"
3. **Kelas** (`gradeApplied`) - Text input
4. **Nama calon siswa** (`studentName`) - Text input
5. **Jenis kelamin** (`studentGender`) - Radio group
   - Options: "Laki-laki" (MALE), "Perempuan" (FEMALE)
6. **Riwayat pendidikan terakhir** (`lastEducationLocation`) - Radio group
   - Options: "Indonesia", "Luar negeri"
7. **Tanggal lahir** (`studentBirthDate`) - Date input
8. **Informasi memiliki NISN atau tidak** (`nisn`) - Text input (optional)
9. **Upload scan visa/izin tinggal (jika tersedia)** - File input (UI only, not in API yet)

### Step 4: KONFIRMASI
**Component:** Placeholder page
**Fields:** None (summary/confirmation step - not yet implemented)

---

## D) Field Mapping Table

| UI Label (Indonesian) | UI Key | API Payload Field | Prisma Model.Field | Required? | Notes |
|------------------------|--------|-------------------|-------------------|-----------|-------|
| **Step 2: Parent/Guardian Data** |
| Email pendaftar | `applicantEmail` | `applicantEmail` | `Application.applicantEmail` | ✅ Yes | Email validation |
| Jenis penugasan/alasan tinggal di luar negeri | `reasonLivingAbroad` | `reasonLivingAbroad` | `ApplicationPreRegistration.reasonLivingAbroad` | ✅ Yes | String, min length 1 |
| Alasan mendaftar ke SIDH | `reasonToApply` | `reasonToApply` | `ApplicationPreRegistration.reasonToApply` | ✅ Yes | String, min length 1 |
| Hubungan pendaftar dengan calon siswa | `applicantRelationship` | `applicantRelationship` | `ApplicationPreRegistration.applicantRelationship` | ✅ Yes | Radio: "Ayah", "Ibu", "Wali" |
| Nama orang tua pendaftar | `applicantName` | `applicantName` | `ApplicationPreRegistration.applicantName` | ✅ Yes | String, min length 1 |
| Alamat domisili | `assignmentCity` | `assignmentCity` | `ApplicationPreRegistration.assignmentCity` | ✅ Yes | String, min length 1 |
| Negara domisili | `assignmentCountry` | `assignmentCountry` | `ApplicationPreRegistration.assignmentCountry` | ✅ Yes | Select: NL, ID, DE, BE, OTHER |
| Rencana periode domisili - Mulai | `domicileStartDate` | `domicileStartDate` | `ApplicationPreRegistration.domicileStartDate` | ✅ Yes | ISO date string (YYYY-MM-DD) → Date |
| Rencana periode domisili - Akhir | `domicileEndDate` | `domicileEndDate` | `ApplicationPreRegistration.domicileEndDate` | ✅ Yes | ISO date string → Date, must be >= start date |
| Tanggal masa berlaku visa/izin tinggal | `permitExpiryDate` | `permitExpiryDate` | `ApplicationPreRegistration.permitExpiryDate` | ✅ Yes | ISO date string → Date |
| **Step 3: Student Identity** |
| Mendaftar untuk program | `programChoice` | `programChoice` | `ApplicationPreRegistration.programChoice` | ✅ Yes | Radio: "PJJ", "PTM" |
| Jenjang pendidikan | `educationLevel` | `educationLevel` | `ApplicationPreRegistration.educationLevel` | ✅ Yes | Radio: "SD", "SMP", "SMA" |
| Kelas | `gradeApplied` | `gradeApplied` | `ApplicationPreRegistration.gradeApplied` | ✅ Yes | String, min length 1 |
| Nama calon siswa | `studentName` | `studentName` | `ApplicationPreRegistration.studentName` | ✅ Yes | String, min length 1 |
| Jenis kelamin | `studentGender` | `studentGender` | `ApplicationPreRegistration.studentGender` | ✅ Yes | Radio: "Laki-laki" → "MALE", "Perempuan" → "FEMALE" (enum) |
| Riwayat pendidikan terakhir | `lastEducationLocation` | `lastEducationLocation` | `ApplicationPreRegistration.lastEducationLocation` | ✅ Yes | Radio: "Indonesia", "Luar negeri" |
| Tanggal lahir | `studentBirthDate` | `studentBirthDate` | `ApplicationPreRegistration.studentBirthDate` | ✅ Yes | ISO date string → Date |
| Informasi memiliki NISN atau tidak | `nisn` | `nisn` | `ApplicationPreRegistration.nisn` | ❌ No | Optional string, empty string → null in DB |
| Upload scan visa/izin tinggal | (none) | (none) | (none) | ⚠️ UI only | File upload not yet in API/DB schema |

---

## Open Mapping Questions

1. **File Upload Field (Step 3)**
   - **UI:** "Upload scan visa/izin tinggal (jika tersedia)" - File input exists in UI
   - **API:** Not present in `PreRegisterDto`
   - **Database:** Not present in `ApplicationPreRegistration` model
   - **Question:** Should this be implemented? If yes, needs:
     - File storage strategy (local/S3/etc.)
     - Database field or separate document table
     - API endpoint for file upload
     - Frontend file handling logic

2. **Relationship Value Mapping**
   - **UI Options:** "Ayah", "Ibu", "Wali" (Indonesian)
   - **API/DB:** Stored as-is (string)
   - **Question:** Should these be normalized/enumerated? Currently stored as free text.

3. **Country Code Format**
   - **UI Options:** "NL", "ID", "DE", "BE", "OTHER"
   - **API/DB:** Stored as-is (string)
   - **Question:** Should "OTHER" be expanded to full country name? Currently stored as "OTHER".

4. **Education Location Value**
   - **UI Options:** "Indonesia", "Luar negeri" (Indonesian)
   - **API/DB:** Stored as-is (string)
   - **Question:** Should "Luar negeri" be normalized or expanded with specific country?

5. **Date Format Consistency**
   - **UI:** HTML5 date inputs (YYYY-MM-DD format)
   - **API:** `@IsDateString()` accepts ISO 8601 strings
   - **Database:** PostgreSQL `DATE` type
   - **Status:** ✅ Mapping is correct - UI sends ISO strings, API validates, service converts to Date objects

6. **Step 4 Implementation**
   - **Current:** Placeholder page with no form fields
   - **Question:** What fields/content should Step 4 contain? Confirmation summary? Additional fields?

7. **Missing Fields in UI**
   - All fields from `PreRegisterDto` are present in UI Steps 2-3
   - ✅ No missing required fields

8. **Extra Fields in UI**
   - File upload field exists in UI but not in API/DB (see Question #1)

---

## Summary

**Total Fields:**
- **Step 1:** 0 form fields (informational)
- **Step 2:** 9 form fields (all required)
- **Step 3:** 9 form fields (8 required, 1 optional, 1 file upload not in API)
- **Step 4:** 0 form fields (placeholder)

**Mapping Status:**
- ✅ All API fields have corresponding UI fields
- ✅ All UI form fields (except file upload) map to API/DB fields
- ✅ Field names match between UI (`PreRegisterRequest`) and API (`PreRegisterDto`)
- ✅ Date transformations handled correctly (ISO string → Date object)
- ✅ Enum handling correct (`studentGender`: MALE/FEMALE)
- ⚠️ File upload field exists in UI but not in API/DB schema

**Ready for Implementation:**
- All mapped fields can be safely saved/submitted
- No breaking changes needed to existing schema
- File upload needs separate implementation decision
