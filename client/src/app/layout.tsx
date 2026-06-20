import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Krishok.ai",
    template: "%s — Krishok.ai",
  },
  description: "কৃষকের ডিজিটাল AI সহকারী",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
