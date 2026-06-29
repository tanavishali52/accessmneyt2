"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart, Menu, X, User, LogOut, Package,
  ChevronDown, Search as SearchIcon, Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/custom-components/ui/Button";
import { Badge } from "@/custom-components/ui/Badge";
import { Avatar } from "@/custom-components/ui/Avatar";
import { Divider } from "@/custom-components/ui/Divider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { openCart } from "@/store/slices/cartSlice";

const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Categories", href: "/?view=categories" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, role } = useAppSelector((s) => s.auth);
  const localItems = useAppSelector((s) => s.cart.localItems);
  const cartCount = localItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg hidden sm:block">ShopHub</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-sm mx-4 relative"
          >
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Mobile search toggle */}
            <button
              className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => dispatch(openCart())}
              className="relative flex items-center justify-center h-10 w-10 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={`Cart — ${cartCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* User menu (desktop) */}
            {role !== "guest" && user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 h-10 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Avatar name={user.name} size="sm" />
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate hidden md:block">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden md:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Divider />
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                      {role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Store className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                      <Divider />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="flex md:hidden items-center justify-center h-10 w-10 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Divider />

          {/* Mobile auth */}
          <div className="px-4 py-3">
            {role !== "guest" && user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar name={user.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Package className="h-4 w-4" /> My Orders
                </Link>
                {role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50"
                  >
                    <Store className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="md" fullWidth>Sign in</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="md" fullWidth>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
