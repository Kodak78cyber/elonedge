"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h2>Something went wrong</h2>
      <p>{error?.message || "Unknown error"}</p>
      {error?.digest && <p style={{ fontSize: 12, color: "#888" }}>digest: {error.digest}</p>}
      <button onClick={reset} style={{ marginTop: 12, padding: "6px 12px" }}>
        Try again
      </button>
    </div>
  );
}
