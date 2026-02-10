const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface PreRegisterRequest {
  applicantEmail: string;
  applicantName: string;
  applicantRelationship: string;
  reasonLivingAbroad: string;
  reasonToApply: string;
  assignmentCity: string;
  assignmentCountry: string;
  domicileStartDate: string;
  domicileEndDate: string;
  permitExpiryDate: string;
  programChoice: string;
  educationLevel: string;
  gradeApplied: string;
  studentName: string;
  studentGender: 'MALE' | 'FEMALE';
  studentBirthDate: string;
  lastEducationLocation: string;
  nisn?: string;
}

export interface PreRegisterResponse {
  applicationId: string;
  applicationNo: string;
}

export interface ApiError {
  message?: string | string[];
  statusCode?: number;
}

export async function preRegister(
  payload: PreRegisterRequest
): Promise<PreRegisterResponse> {
  const response = await fetch(`${API_URL}/public/applications/pre-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      typeof data.message === 'string'
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(' ')
          : response.status === 403
            ? 'Registration is currently closed.'
            : 'Pre-registration failed. Please check your entries and try again.';
    throw new Error(msg);
  }

  return data as PreRegisterResponse;
}
