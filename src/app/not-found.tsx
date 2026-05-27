import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-semibold tracking-tight text-accent">404</p>
        <h1 className="mt-3 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="mt-6 inline-block text-accent">← Back home</Link>
      </div>
    </div>
  );
}
