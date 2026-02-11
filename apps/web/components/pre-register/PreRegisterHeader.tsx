import Image from 'next/image';

export function PreRegisterHeader() {
  return (
    <header className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6">
      <div className="flex min-w-0 justify-start">
        <Image
          src="/images/logo.png"
          alt="Logo Sekolah Indonesia di Nederland"
          width={70}
          height={28}
          className="h-auto w-[60px] sm:w-[70px]"
          priority
        />
      </div>
      <h1 className="min-w-0 text-center text-xl font-bold text-gray-900 sm:text-2xl">
        Formulir Pra-Registrasi Siswa Baru
      </h1>
      <div className="hidden min-w-0 sm:block" />
    </header>
  );
}
