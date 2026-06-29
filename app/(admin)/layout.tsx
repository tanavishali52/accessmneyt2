import type { Metadata } from "next";
import { Sidebar } from "@/custom-components/layout/Sidebar";

export const metadata: Metadata = {
  title: { default: "Admin | ShopHub", template: "%s | Admin — ShopHub" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:overflow-auto">
        {children}
      </div>
    </div>
  );
}
