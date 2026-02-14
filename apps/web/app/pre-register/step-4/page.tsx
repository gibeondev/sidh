'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { PreRegisterPayload } from '@/lib/api/preRegistration';
import { submitPreRegister, ApiError } from '@/lib/api/preRegistration';
import {
  PreRegisterHeader,
  Stepper,
  Banner,
  StepActions,
  ReviewConfirmStep,
} from '@/components/pre-register';
import { validatePreRegisterForm } from '@/lib/pre-register-validation';

const STEP = 4 as const;

/** Maps backend property names to our form field names (same as payload per spec) */
const MESSAGE_FIELD_REGEX = /(\w+):/;

/**
 * Pre-register Step 4: Ringkasan & Konfirmasi.
 * Read-only summary (Data Orang Tua/Wali, Data Calon Siswa) + confirmation checkbox.
 * Submit only when checkbox is checked; Back → step-3.
 */
export default function PreRegisterStep4Page() {
  const router = useRouter();
  const { getValues, setError, clearErrors } = useFormContext<PreRegisterPayload>();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    clearErrors();
    const payload = getValues() as PreRegisterPayload;
    const fieldErrors = validatePreRegisterForm(payload);
    if (fieldErrors.length > 0) {
      fieldErrors.forEach(({ field, message }) => setError(field, { message }));
      setSubmitError('Periksa data yang wajib diisi dan format yang benar.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitPreRegister(payload);
      const params = new URLSearchParams({
        applicationNo: result.applicationNo,
        applicationId: result.applicationId,
      });
      router.push(`/pre-register/success?${params.toString()}`);
    } catch (err) {
      if (err instanceof ApiError && err.body?.message) {
        const msg = Array.isArray(err.body.message)
          ? err.body.message.join(' ')
          : err.body.message;
        setSubmitError(msg);
        const firstMsg = Array.isArray(err.body.message)
          ? err.body.message[0]
          : err.body.message;
        const match = typeof firstMsg === 'string' && firstMsg.match(MESSAGE_FIELD_REGEX);
        if (match) {
          const field = match[1] as keyof PreRegisterPayload;
          if (field in getValues()) setError(field, { message: firstMsg });
        }
      } else {
        setSubmitError(err instanceof Error ? err.message : 'Pengiriman gagal.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const form = getValues();

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PreRegisterHeader />
        <Stepper currentStep={STEP} />
        <Banner />

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {submitError && (
            <div
              className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700"
              role="alert"
            >
              {submitError}
            </div>
          )}

          <ReviewConfirmStep
            confirmed={confirmed}
            onConfirmedChange={setConfirmed}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="pt-8"
          >
            <StepActions
              currentStep={STEP}
              nextLabel={submitting ? 'Mengirim…' : 'Kirim Pendaftaran'}
              nextAsSubmit
              nextDisabled={!confirmed || submitting}
            />
          </form>
        </div>
      </div>
    </main>
  );
}
