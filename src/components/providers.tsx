"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgb(22 21 30)",
            color: "rgb(240 228 196)",
            border: "1px solid rgb(44 40 28)",
            fontFamily: "var(--font-sans)",
          },
          success: { iconTheme: { primary: "#D4AF37", secondary: "#050508" } },
        }}
      />
    </ThemeProvider>
  );
}
