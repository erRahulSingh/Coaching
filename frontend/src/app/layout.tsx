import type { Metadata } from "next";
import { Inter, Outfit, Dancing_Script } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/AppWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  title: "JMS Library & Coaching - Kushwaha Market, Parsauni",
  description: "JMS Library & Modern Classes is the perfect place to study, grow and achieve. Best environment, expert guidance, Bihar board (BSEB) toppers & 24x7 smart library access.",
  keywords: ["JMS Library", "JMS Modern Classes", "Coaching Parsauni", "Library Parsauni", "BSEB Topper Coaching", "Bihar Library 24 Hours"],
  authors: [{ name: "JMS Classes" }],
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: ReadType) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${dancingScript.variable} dark`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-navy-deep text-gray-100 select-none">
        <AppWrapper>
          <div className="relative z-10">{children}</div>
        </AppWrapper>
      </body>
    </html>
  );
}

type ReadType = Readonly<{
  children: React.ReactNode;
}>;
