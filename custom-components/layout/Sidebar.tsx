"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Store,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/custom-components/ui/Avatar";
import { Badge } from "@/custom-components/ui/Badge";
import { Divider } from "@/custom-components/ui/Divider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "Products",   href: "/admin/products",   icon: Package },
  { label: "Orders",     href: "/admin/orders",     icon: ShoppingBag },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const NavLinks = ({ onNav }: { onNav?: () => void }) => (
    <nav className="flex-1 px-3 py-2 space-y-0.5">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={onNav}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
              active
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
            {label}
            {active && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200",
        className
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-200 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight">ShopHub</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Admin</p>
          </div>
        </div>

        <NavLinks />

        <Divider className="mx-3" />

        {/* Bottom: storefront link + user */}
        <div className="px-3 py-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Store className="h-4 w-4 shrink-0" />
            View Storefront
          </Link>
        </div>

        <Divider className="mx-3" />

        {/* User block */}
        <div className="px-3 py-3">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
            <Avatar name={user?.name ?? "Admin"} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name ?? "Admin"}</p>
              <Badge variant="info" size="sm">Admin</Badge>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Store className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">ShopHub Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Store className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-900 text-sm">ShopHub Admin</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <NavLinks onNav={() => setMobileOpen(false)} />

            <Divider className="mx-3" />

            <div className="px-3 py-3">
              <div className="flex items-center gap-2.5 px-3 py-2">
                <Avatar name={user?.name ?? "Admin"} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user?.name ?? "Admin"}</p>
                  <Badge variant="info" size="sm">Admin</Badge>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
