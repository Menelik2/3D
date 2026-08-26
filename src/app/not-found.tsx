import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20">
      <div className="text-center px-4">
        <h1 className="text-6xl font-light">404</h1>
        <p className="mt-4 text-muted">This frame does not exist.</p>
        <Link href="/" className="mt-8 inline-block text-xs uppercase tracking-widest text-accent hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
