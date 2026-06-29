import type { Metadata } from "next";
import { Sidebar } from "@/custom-components/layout/Sidebar";
import { AdminGuard } from "@/custom-components/auth/AdminGuard";

export const metadata: Metadata = {
  title: { default: "Admin | ShopHub", template: "%s | Admin — ShopHub" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:overflow-auto">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
