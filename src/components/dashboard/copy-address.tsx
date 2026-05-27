"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success("Address copied to clipboard");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Could not copy address");
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1 text-xs text-muted hover:text-accent hover:border-accent transition"
      aria-label="Copy address"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
