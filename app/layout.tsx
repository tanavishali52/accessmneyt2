import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/custom-components/providers/ReduxProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopHub — Modern E-Commerce",
  description: "Discover products you love",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
