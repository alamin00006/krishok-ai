import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="text-7xl font-black text-primary">404</div>
        <h1 className="mt-4 text-xl font-bold">পেজটি পাওয়া যায়নি</h1>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-primary-foreground">
          হোমে ফিরুন
        </Link>
      </div>
    </main>
  );
}
