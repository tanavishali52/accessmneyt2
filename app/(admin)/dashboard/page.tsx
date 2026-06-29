import { AdminPageWrapper } from "@/custom-components/layout/PageWrapper";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <AdminPageWrapper title="Dashboard" description="Store overview and analytics">
      <p className="text-slate-500 text-sm">Dashboard coming soon — Phase 5.</p>
    </AdminPageWrapper>
  );
}
