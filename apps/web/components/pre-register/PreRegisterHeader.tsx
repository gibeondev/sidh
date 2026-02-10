export function PreRegisterHeader() {
  return (
    <header className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-green-500 via-blue-500 to-red-500" aria-hidden />
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-600">
          Sekolah Indonesia di
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-600">Nederland</p>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          New Student Pre-Registration Form
        </h1>
      </div>
    </header>
  );
}
