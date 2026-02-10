'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select } from '@/components/ui/select';

export interface ParentGuardianData {
  applicantEmail: string;
  reasonLivingAbroad: string;
  reasonToApply: string;
  applicantRelationship: string;
  applicantName: string;
  assignmentCity: string;
  assignmentCountry: string;
  domicileStartDate: string;
  domicileEndDate: string;
  permitExpiryDate: string;
}

const RELATIONSHIP_OPTIONS = [
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Guardian', label: 'Guardian' },
];

const COUNTRY_OPTIONS = [
  { value: 'NL', label: 'Netherlands' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'DE', label: 'Germany' },
  { value: 'BE', label: 'Belgium' },
  { value: 'OTHER', label: 'Other' },
];

export interface ParentGuardianFormProps {
  data: ParentGuardianData;
  onChange: (field: keyof ParentGuardianData, value: string) => void;
}

export function ParentGuardianForm({ data, onChange }: ParentGuardianFormProps) {
  return (
    <section aria-labelledby="parent-guardian-heading" className="space-y-5">
      <h2
        id="parent-guardian-heading"
        className="text-base font-bold uppercase tracking-wide text-gray-900"
      >
        Student parent / guardian data
      </h2>

      <div className="grid gap-4 sm:grid-cols-1">
        <div className="space-y-2">
          <Label htmlFor="applicantEmail" required>
            Applicant email
          </Label>
          <Input
            id="applicantEmail"
            type="email"
            autoComplete="email"
            placeholder="Applicant email"
            value={data.applicantEmail}
            onChange={(e) => onChange('applicantEmail', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reasonLivingAbroad" required>
            Type of assignment / reason for living abroad
          </Label>
          <Input
            id="reasonLivingAbroad"
            type="text"
            placeholder="Type of Assignment / Reason for living abroad"
            value={data.reasonLivingAbroad}
            onChange={(e) => onChange('reasonLivingAbroad', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reasonToApply" required>
            Motivation for enrolling in SIDH
          </Label>
          <Input
            id="reasonToApply"
            type="text"
            placeholder="Motivation for enrolling in SIDH"
            value={data.reasonToApply}
            onChange={(e) => onChange('reasonToApply', e.target.value)}
          />
        </div>

        <RadioGroup
          name="applicantRelationship"
          label="Relationship to the student"
          required
          options={RELATIONSHIP_OPTIONS}
          value={data.applicantRelationship}
          onChange={(value) => onChange('applicantRelationship', value)}
          aria-label="Relationship to the student"
        />

        <div className="space-y-2">
          <Label htmlFor="applicantName" required>
            Parent/guardian name
          </Label>
          <Input
            id="applicantName"
            type="text"
            autoComplete="name"
            placeholder="Parent/guardian name"
            value={data.applicantName}
            onChange={(e) => onChange('applicantName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignmentCity" required>
            Address of domicile
          </Label>
          <Input
            id="assignmentCity"
            type="text"
            autoComplete="street-address"
            placeholder="Address of domicile"
            value={data.assignmentCity}
            onChange={(e) => onChange('assignmentCity', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignmentCountry" required>
            Country
          </Label>
          <Select
            id="assignmentCountry"
            placeholder="Country"
            options={COUNTRY_OPTIONS}
            value={data.assignmentCountry}
            onChange={(e) => onChange('assignmentCountry', e.target.value)}
            aria-label="Country"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="domicileStartDate" required>
              Planned domicile period — Start
            </Label>
            <Input
              id="domicileStartDate"
              type="date"
              value={data.domicileStartDate}
              onChange={(e) => onChange('domicileStartDate', e.target.value)}
              aria-label="Planned domicile period start date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domicileEndDate" required>
              Planned domicile period — End
            </Label>
            <Input
              id="domicileEndDate"
              type="date"
              value={data.domicileEndDate}
              onChange={(e) => onChange('domicileEndDate', e.target.value)}
              aria-label="Planned domicile period end date"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="permitExpiryDate" required>
            Visa/residence permit validity date
          </Label>
          <Input
            id="permitExpiryDate"
            type="date"
            value={data.permitExpiryDate}
            onChange={(e) => onChange('permitExpiryDate', e.target.value)}
            aria-label="Visa/residence permit validity date"
          />
        </div>
      </div>
    </section>
  );
}
