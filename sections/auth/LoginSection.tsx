"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Store, ArrowRight } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { useLoginMutation } from "@/services/authService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { clearLocalCart } from "@/store/slices/cartSlice";
import { Button } from "@/custom-components/ui/Button";
import { RHFInput } from "@/custom-components/ui/RHF";
import { Alert } from "@/custom-components/ui/Alert";
import { Divider } from "@/custom-components/ui/Divider";
import { Heading, Paragraph } from "@/custom-components/ui/Typography";

export function LoginSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const router = useRouter();
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
      // If guest had local cart items, persist them before clearing
      if (localItems.length > 0) {
        dispatch(clearLocalCart());
      }
      const role = result.user.role;
      router.push(role === "admin" ? "/admin/dashboard" : "/");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setApiError(error?.data?.message ?? "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 to-violet-800 p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">ShopHub</span>
        </Link>

        <div className="space-y-4">
          <Heading as="h1" size="3xl" className="text-white leading-tight">
            Welcome back to ShopHub
          </Heading>
          <Paragraph size="lg" className="text-violet-100">
            Sign in to access your orders, saved items, and a personalised shopping experience.
          </Paragraph>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { value: "500+", label: "Products" },
            { value: "10k+", label: "Customers" },
            { value: "4.8★", label: "Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-violet-200 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">ShopHub</span>
          </Link>

          <Heading as="h2" size="2xl" className="mb-1">Sign in</Heading>
          <Paragraph variant="muted" className="mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-violet-600 hover:underline font-medium">
              Create one
            </Link>
          </Paragraph>

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
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex justify-end">
              <Link href="#" className="text-xs text-violet-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign in
            </Button>
          </form>

          <Divider label="or continue as" className="my-6" />

          <Link href="/">
            <Button variant="secondary" size="lg" fullWidth>
              Browse as guest
            </Button>
          </Link>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Demo credentials</p>
            <p className="text-xs text-slate-500">Customer: <span className="font-mono">customer@shop.com / customer123</span></p>
            <p className="text-xs text-slate-500">Admin: <span className="font-mono">admin@shop.com / admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
