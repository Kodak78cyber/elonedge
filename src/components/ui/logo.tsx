import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  mark = true,
  asLink = true,
}: {
  className?: string;
  mark?: boolean;
  asLink?: boolean;
}) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5 font-bold tracking-tight", className)}>
      {mark && (
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-gold">
          {/* Lightning bolt — sharp, futuristic */}
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="currentColor">
            <path d="M13 2L4.5 13.5H11L9 22L20 10H13L15 2Z" />
          </svg>
        </span>
      )}
      <span className="text-[18px] leading-none">
        <span className="text-fg">Elon</span>
        <span className="text-accent">Edge</span>
      </span>
    </span>
  );
  return asLink ? <Link href="/">{inner}</Link> : inner;
}
