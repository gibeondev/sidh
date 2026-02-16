import { redirect } from 'next/navigation';

/**
 * Wizard entry: redirect to step 1.
 */
export default function WizardPage({
  params,
}: {
  params: { applicationId: string };
}) {
  redirect(`/parent/applications/${params.applicationId}/wizard/step-1`);
}
