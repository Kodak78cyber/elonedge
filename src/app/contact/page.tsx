import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 grid lg:grid-cols-2 gap-10">
        <div>
          <Badge tone="accent" className="mb-4">Contact</Badge>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Let's talk</h1>
          <p className="mt-3 text-muted">Have a question about the platform, an integration request, or want to partner on a fintech build? Drop a message — typically replied in 1 business day.</p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-start gap-3"><Mail className="size-5 text-accent" /> <span><strong>Email</strong> · hello@vaultflow.local</span></div>
            <div className="flex items-start gap-3"><Phone className="size-5 text-accent" /> <span><strong>Phone</strong> · +1 (555) 010-2026</span></div>
            <div className="flex items-start gap-3"><MessageCircle className="size-5 text-accent" /> <span><strong>Discord</strong> · discord.gg/vaultflow</span></div>
            <div className="flex items-start gap-3"><MapPin className="size-5 text-accent" /> <span><strong>HQ</strong> · 200 Mission St, San Francisco, CA</span></div>
          </div>
        </div>
        <Card className="p-6">
          <ContactForm />
        </Card>
      </main>
      <Footer />
    </>
  );
}
