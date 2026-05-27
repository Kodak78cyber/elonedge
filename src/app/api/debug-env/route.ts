import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * TEMPORARY diagnostic — shows which env vars are visible at runtime.
 * Values are masked to a length-only readout. Delete this file before going
 * fully public.
 */
export async function GET() {
  const keys = [
    "DATABASE_URL",
    "DIRECT_URL",
    "SESSION_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "NEXT_PUBLIC_APP_NAME",
    "NEXT_PUBLIC_APP_URL",
    "NODE_ENV",
    "VERCEL",
    "VERCEL_ENV",
  ];
  const report: Record<string, string> = {};
  for (const k of keys) {
    const v = process.env[k];
    if (v == null) {
      report[k] = "MISSING";
    } else {
      report[k] = `present (length ${v.length}, starts \"${v.slice(0, 12)}…\")`;
    }
  }
  return NextResponse.json(report);
}
