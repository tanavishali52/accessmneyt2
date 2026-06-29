"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import type { UserRole } from "@/types";
import { Spinner } from "@/custom-components/ui/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Minimum role required. "user" allows user + admin. "admin" allows admin only. */
  requiredRole?: Extract<UserRole, "user" | "admin">;
  /** Where to redirect if access is denied. Defaults to /auth/login */
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole = "user",
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { role, isLoading } = useAppSelector((s) => s.auth);

  const hasAccess =
    requiredRole === "admin" ? role === "admin" : role === "user" || role === "admin";

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      router.replace(redirectTo);
    }
  }, [isLoading, hasAccess, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-violet-600" />
      </div>
    );
  }

  if (!hasAccess) return null;

  return <>{children}</>;
}
