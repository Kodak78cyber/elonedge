"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // POSTs to /api/contact which is rate-limited and logged server-side.
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
          const r = await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
          if (!r.ok) throw new Error(await r.text());
          toast.success("Message received — we'll reply within 1 business day.");
          (e.target as HTMLFormElement).reset();
        } catch (err) {
          toast.error((err as Error).message || "Failed to send");
        } finally {
          setSubmitting(false);
        }
      }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">Send a message</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required minLength={2} placeholder="Jane Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required placeholder="Integration help" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required minLength={10} placeholder="Tell us a bit about your use case…" />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
