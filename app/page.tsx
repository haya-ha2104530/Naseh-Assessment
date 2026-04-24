import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">NASEH</h1>
          <p className="text-gray-400 text-lg">
            something something something
          </p>
        </div>
        <Link
          href="/assessmentwiz"
          className="inline-block bg-white text-gray-950 font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition-all duration-200"
        >
          GET STARTED
        </Link>
      </div>
    </main>
  );
}

