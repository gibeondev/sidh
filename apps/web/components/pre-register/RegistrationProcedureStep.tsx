'use client';

/**
 * Registration Procedure Step: Informational content for Step 1.
 * Displays greeting, introduction, numbered procedure list, and disclaimer.
 * No form fields - purely informational.
 */
export function RegistrationProcedureStep() {
  const procedures = [
    'Isi formulir ini dengan ejaan dan informasi yang benar. Pastikan semua data yang diisi sesuai dengan dokumen resmi yang dimiliki (paspor, visa, dll).',
    'Formulir ini dapat digunakan HANYA bagi Orang tua & Siswa yang telah memiliki Visa/Ijin tinggal yang masih berlaku dan akan tinggal di Belanda minimal 1 tahun.',
    'Siswa wajib mengikuti pembelajaran di SIDH minimal 1 tahun/2 semester.',
    'Data awal yang kami terima dari formulir Pra-Registrasi ini akan kami cek validasinya. Jika data yang diberikan tidak sesuai dengan dokumen resmi, maka pendaftaran akan ditolak.',
    'Data yang kami terima melalui formulir ini hanya kami gunakan untuk kepentingan Pra-Registrasi di dalam SIDH.',
    'HANYA jika memenuhi syarat pendaftaran dan aturan pendaftaran SIDH yang akan kami lanjutkan ke tahap Registrasi selanjutnya.',
    'Jawaban/Pengumuman Konfirmasi Pendaftaran akan dikirimkan melalui email jika dokumen telah lengkap kami terima.',
    'Formulir aplikasi pendaftaran Pra-Registrasi akan gugur secara otomatis jika dalam waktu 1 bulan setelah pengisian formulir ini, dokumen yang diminta belum lengkap kami terima.',
  ];

  return (
    <section aria-labelledby="procedure-heading" className="space-y-6">
      <h2
        id="procedure-heading"
        className="text-center text-xl font-bold uppercase tracking-wide text-gray-900 mb-6"
      >
        PROSEDUR PENDAFTARAN
      </h2>

      <div className="space-y-6 text-sm text-gray-700">
        <div>
          <p className="font-medium mb-2">Yth. Orang tua Calon Siswa,</p>
          <p className="mb-4">
            Terima kasih atas minat mendaftarkan putra putri Bapak/Ibu ke Sekolah Indonesia Den Haag. Mohon membaca
            sebaik baiknya setiap persyaratan yang telah di sampaikan pada laman SPMB 2025/2026 sebelum mengisi formulir
            ini.{' '}
            <a
              href="https://bit.ly/SyaratDokumenSIDH"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://bit.ly/SyaratDokumenSIDH
            </a>
          </p>
        </div>

        <ol className="space-y-4 list-none">
          {procedures.map((procedure, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 text-sm font-semibold">
                {index + 1}
              </span>
              <span className="flex-1 pt-0.5">{procedure}</span>
            </li>
          ))}
        </ol>

        <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            <span className="font-semibold">*</span> Dengan mengisi dan mengirimkan formulir ini maka bapak ibu
            menyatakan telah membaca syarat pendaftaran dengan baik, siap melengkapi dokumen yang diperlukan dan siap
            mengikuti aturan yang berlaku bagi PD/siswa program Pembelajaran Tatap Muka (PTM) maupun siswa program
            Pembelajaran Jarak Jauh (PJJ).
          </p>
        </div>
      </div>
    </section>
  );
}
