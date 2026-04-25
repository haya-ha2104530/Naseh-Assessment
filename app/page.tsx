import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight text-primary">NasehAI</h1>
          <p className="text-lg text-muted">
            Smart company policies, powered by AI
          </p>
        </div>
        <Link href="/assessment"
          className="inline-block font-semibold px-10 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-primary text-background">
          Get Started →
        </Link>
      </div>
    </main>
  );
}