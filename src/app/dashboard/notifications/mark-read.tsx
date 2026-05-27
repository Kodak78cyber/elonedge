"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function MarkAllRead() {
  const router = useRouter();
  async function go() {
    const r = await fetch("/api/notifications/read-all", { method: "POST" });
    if (r.ok) {
      toast.success("Marked all as read");
      router.refresh();
    }
  }
  return <Button onClick={go} variant="secondary" size="sm">Mark all as read</Button>;
}
