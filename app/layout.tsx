import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tl:dr;",
  description: "Time is money - summarize everything",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "p-4")}>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
