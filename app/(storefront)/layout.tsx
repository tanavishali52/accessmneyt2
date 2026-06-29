import type { Metadata } from "next";
import { Navbar } from "@/custom-components/layout/Navbar";
import { Footer } from "@/custom-components/layout/Footer";

export const metadata: Metadata = {
  title: { default: "ShopHub", template: "%s | ShopHub" },
  description: "Discover products you love",
};

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
