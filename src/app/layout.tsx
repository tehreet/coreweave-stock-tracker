import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

// Minimalist cow-themed metadata
export const metadata: Metadata = {
  title: "🐄", // Title is just a cow emoji
  description: "🐄", // Description is just a cow emoji
  openGraph: {
    title: "🐄",
    description: "🐄",
  },
  twitter: {
    title: "🐄",
    description: "🐄",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
        <Analytics />
      </body>
    </html>
  );
}
