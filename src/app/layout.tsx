import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "ElonEdge — Invest in the Future. Invest in Vision.",
    template: "%s · ElonEdge",
  },
  description:
    "ElonEdge is the premium investment platform for Elon Musk-linked assets: Tesla, SpaceX, Starlink, xAI, Neuralink, X Corp, and Boring Company.",
  keywords: ["ElonEdge", "Tesla", "SpaceX", "Starlink", "xAI", "Neuralink", "invest", "fintech"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "ElonEdge — Invest in the Future. Invest in Vision.",
    description: "Premium investment platform for Elon Musk-linked ventures.",
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
