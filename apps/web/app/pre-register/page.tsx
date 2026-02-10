'use client';

import { useState } from 'react';
import Link from 'next/link';
import { preRegister, type PreRegisterRequest } from '@/lib/api/applications';
import { PreRegisterHeader } from '@/components/pre-register/PreRegisterHeader';
import { PreRegisterStepper, type StepId } from '@/components/pre-register/PreRegisterStepper';
import { PreRegisterBanner } from '@/components/pre-register/PreRegisterBanner';
import { ParentGuardianForm } from '@/components/pre-register/ParentGuardianForm';
import { StepActions } from '@/components/pre-register/StepActions';

const TOTAL_STEPS = 3;

const emptyForm: PreRegisterRequest = {
  applicantEmail: '',
  applicantName: '',
  applicantRelationship: '',
  reasonLivingAbroad: '',
  reasonToApply: '',
  assignmentCity: '',
  assignmentCountry: '',
  domicileStartDate: '',
  domicileEndDate: '',
  permitExpiryDate: '',
  programChoice: '',
  educationLevel: '',
  gradeApplied: '',
  studentName: '',
  studentGender: 'MALE',
  studentBirthDate: '',
  lastEducationLocation: '',
  nisn: '',
};

export default function PreRegisterPage() {
  const [step, setStep] = useState<StepId>(2);
  const [form, setForm] = useState<PreRegisterRequest>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ applicationNo: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof PreRegisterRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => (s + 1) as StepId);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as StepId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (payload.nisn === '') delete payload.nisn;
      const result = await preRegister(payload);
      setSuccess({ applicationNo: result.applicationNo });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-green-700">Pre-registration received</h1>
          <p className="mt-2 text-gray-600">
            Your application has been recorded. Reference number: <strong>{success.applicationNo}</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            You will receive further instructions by email when the next steps are available.
          </p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <PreRegisterHeader />
        <PreRegisterStepper currentStep={step} />
        <PreRegisterBanner />

        <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          {step === 1 && (
            <section aria-labelledby="step1-heading" className="space-y-4">
              <h2 id="step1-heading" className="text-base font-bold uppercase tracking-wide text-gray-900">
                Registration procedure
              </h2>
              <p className="text-sm text-gray-600">
                Please complete the following steps: first review the procedure, then provide parent/guardian data, and finally student identity.
              </p>
            </section>
          )}

          {step === 2 && (
            <ParentGuardianForm
              data={{
                applicantEmail: form.applicantEmail,
                applicantName: form.applicantName,
                applicantRelationship: form.applicantRelationship,
                reasonLivingAbroad: form.reasonLivingAbroad,
                reasonToApply: form.reasonToApply,
                assignmentCity: form.assignmentCity,
                assignmentCountry: form.assignmentCountry,
                domicileStartDate: form.domicileStartDate,
                domicileEndDate: form.domicileEndDate,
                permitExpiryDate: form.permitExpiryDate,
              }}
              onChange={update}
            />
          )}

          {step === 3 && (
            <section aria-labelledby="step3-heading" className="space-y-4">
              <h2 id="step3-heading" className="text-base font-bold uppercase tracking-wide text-gray-900">
                Student identity
              </h2>
              <p className="text-sm text-gray-600">
                Student identity step — full fields can be wired here. For this screen, use Back to return or Submit to send the current form.
              </p>
            </section>
          )}

          <StepActions
            step={step}
            totalSteps={TOTAL_STEPS}
            onBack={handleBack}
            onNext={handleNext}
            nextLabel={step === TOTAL_STEPS ? 'Submit pre-registration' : 'Next'}
            nextDisabled={step === TOTAL_STEPS ? submitting : false}
            nextAsSubmit={step === TOTAL_STEPS}
          />
        </form>
      </div>
    </main>
  );
}
