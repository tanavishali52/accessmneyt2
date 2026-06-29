"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, Store, ArrowRight,
  ShoppingBag, Shield, Zap, ChevronDown, ChevronUp,
} from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { useLoginMutation } from "@/services/authService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { clearLocalCart } from "@/store/slices/cartSlice";
import { Button } from "@/custom-components/ui/Button";
import { RHFInput } from "@/custom-components/ui/RHF";
import { Alert } from "@/custom-components/ui/Alert";
import { Divider } from "@/custom-components/ui/Divider";

// ─── Left panel feature pills ─────────────────────────────────────────────────

const FEATURES = [
  { icon: ShoppingBag, label: "Track orders in real time" },
  { icon: Zap,         label: "Fast, seamless checkout" },
  { icon: Shield,      label: "Secure & private by design" },
];

const STATS = [
  { value: "500+", label: "Products" },
  { value: "10k+", label: "Customers" },
  { value: "4.8★", label: "Rating" },
];

export function LoginSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo,     setShowDemo]     = useState(false);
  const [apiError,     setApiError]     = useState<string | null>(null);

  const router   = useRouter();
  const dispatch = useAppDispatch();
  const localItems = useAppSelector((s) => s.cart.localItems);
  const [login, { isLoading }] = useLoginMutation();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      if (localItems.length > 0) dispatch(clearLocalCart());
      const destination = result.user.role === "admin" ? "/admin/dashboard" : "/";
      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setApiError(error?.data?.message ?? "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-transparent">

      {/* ── Left panel ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden flex-col">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800" />

        {/* Decorative orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-400/20 blur-2xl" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">ShopHub</span>
          </Link>

          {/* Main headline */}
          <div className="mt-auto mb-10 space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/90">Trusted by 10,000+ shoppers</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
              Welcome back.<br />
              <span className="text-violet-200">Good to see you.</span>
            </h1>

            <p className="text-violet-100/80 text-sm xl:text-base leading-relaxed max-w-sm">
              Sign in to access your orders, wishlist, and a personalised shopping experience tailored just for you.
            </p>

            {/* Feature list */}
            <ul className="space-y-2.5 pt-2">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-violet-100">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3 text-center">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-[11px] text-violet-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <Store className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">ShopHub</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Sign in</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              New to ShopHub?{" "}
              <Link href="/auth/signup" className="text-violet-600 dark:text-violet-400 hover:underline font-semibold">
                Create a free account
              </Link>
            </p>
          </div>

          {apiError && (
            <Alert variant="danger" onClose={() => setApiError(null)} className="mb-5">
              {apiError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <RHFInput
              name="email"
              control={control}
              label="Email address"
              type="email"
              placeholder="you@example.com"
              required
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <div className="space-y-1">
              <RHFInput
                name="password"
                control={control}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <div className="flex justify-end">
                <Link href="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="mt-2"
            >
              Sign in to ShopHub
            </Button>
          </form>

          <Divider label="or" className="my-5" />

          <Link href="/">
            <Button variant="secondary" size="lg" fullWidth>Continue as guest</Button>
          </Link>

          {/* Demo credentials — collapsible */}
          <div className="mt-5 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between px-4 py-3 text-left bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Demo credentials
              </span>
              {showDemo
                ? <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                : <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />}
            </button>
            {showDemo && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 0.2 }}
                className="px-4 py-3 space-y-1.5 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800"
              >
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Customer:{" "}
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">customer@shop.com / customer123</span>
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Admin:{" "}
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">admin@shop.com / admin123</span>
                </p>
              </motion.div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            By signing in you agree to our{" "}
            <Link href="#" className="hover:underline text-zinc-500 dark:text-zinc-400">Terms</Link>
            {" & "}
            <Link href="#" className="hover:underline text-zinc-500 dark:text-zinc-400">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
