import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SIDH</h1>
        <p className="text-lg text-gray-600 mb-8">Student Information and Document Hub</p>
        <Link
          href="/pre-register"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Pre-register
        </Link>
      </div>
    </main>
  );
}
