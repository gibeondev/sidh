'use client';

export interface ReviewConfirmStepProps {
  confirmed: boolean;
  onConfirmedChange: (checked: boolean) => void;
}

/**
 * Step 4: Static confirmation summary per Figma design.
 * Shows bullet points for data categories (not dynamic values) + confirmation checkbox.
 * Order: Data Calon Siswa → Data Orang Tua/Wali → Data Pilihan Program/Kelas
 */
export function ReviewConfirmStep({
  confirmed,
  onConfirmedChange,
}: ReviewConfirmStepProps) {
  return (
    <section aria-labelledby="step4-heading" className="space-y-8">
      <h2
        id="step4-heading"
        className="text-center text-xl font-bold uppercase tracking-wide text-gray-900"
      >
        KONFIRMASI
      </h2>

      {/* Static summary categories as bullet points */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-gray-700 ml-4">Informatie yang kita sudah trima</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
          <li>Data Calon Siswa</li>
          <li>Data Orang Tua/Wali</li>
          <li>Data Pilihan Program/Kelas</li>
          <li>File visa/izin tinggal</li>
        </ul>
      </div>

      {/* Confirmation checkbox with full legal declaration */}
      <div className="grid grid-cols-[240px_1fr] gap-4 items-start border-t border-gray-200 pt-6">
        <div className="pt-2" aria-hidden="true" />
        <div className="flex gap-3 items-start">
          <input
            id="confirm-declaration"
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmedChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700"
            aria-describedby="confirm-declaration-text"
          />
          <label
            id="confirm-declaration-text"
            htmlFor="confirm-declaration"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Dengan ini Anda menyatakan bahwa Anda telah memberikan informasi di atas dengan jujur
            dan akan melengkapi data yang diminta secara lengkap dan akurat. Kami akan memproses
            semua data untuk kepentingan sekolah, hingga tingkat nasional. Segala kesalahan dalam
            nama dan data adalah tanggung jawab masing-masing pendaftar.
          </label>
        </div>
      </div>
    </section>
  );
}
