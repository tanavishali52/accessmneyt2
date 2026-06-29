import { AdminPageWrapper } from "@/custom-components/layout/PageWrapper";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <AdminPageWrapper title="Dashboard" description="Store overview and analytics">
      <p className="text-zinc-500 dark:text-zinc-400 text-sm">Dashboard coming soon — Phase 5.</p>
    </AdminPageWrapper>
  );
}
