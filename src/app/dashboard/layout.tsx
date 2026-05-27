"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ElonStoreProvider } from "@/lib/elon-context";
import { useElonStore } from "@/lib/elon-context";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useElonStore();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-muted text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ElonStoreProvider>
      <DashboardInner>{children}</DashboardInner>
    </ElonStoreProvider>
  );
}
