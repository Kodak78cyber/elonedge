"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 24, background: "#0a0a0a", color: "#fff" }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Global error</h2>
        <p style={{ color: "#aaa", marginBottom: 12 }}>{error?.message || "Unknown error"}</p>
        {error?.digest && (
          <p style={{ fontSize: 11, color: "#888", fontFamily: "monospace", marginBottom: 12 }}>
            digest: {error.digest}
          </p>
        )}
        <pre style={{ fontSize: 11, background: "#1a1a1a", padding: 12, borderRadius: 8, overflow: "auto", maxHeight: 240 }}>
{error?.stack}
        </pre>
        <button
          onClick={reset}
          style={{ marginTop: 12, padding: "8px 16px", background: "#d4af37", color: "#000", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
