"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, Store, ArrowRight,
  ShoppingCart, Heart, Tag, Package,
} from "lucide-react";
import { signupSchema, type SignupFormValues } from "@/lib/validations";
import { useSignupMutation as useRegisterMutation } from "@/services/authService";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { Button } from "@/custom-components/ui/Button";
import { RHFInput } from "@/custom-components/ui/RHF";
import { Alert } from "@/custom-components/ui/Alert";

const PERKS = [
  { icon: ShoppingCart, title: "Saved cart",      detail: "Pick up right where you left off, on any device." },
  { icon: Heart,        title: "Wishlist",         detail: "Save favourites and get notified when prices drop." },
  { icon: Tag,          title: "Exclusive deals",  detail: "Member-only offers sent straight to your inbox." },
  { icon: Package,      title: "Order tracking",   detail: "Real-time updates from warehouse to your door." },
];

const list = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const item  = { hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35 } } };

export function SignupSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [apiError,     setApiError]     = useState<string | null>(null);

  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setApiError(null);
    try {
      const result = await register(values).unwrap();
      dispatch(setCredentials(result));
      router.push("/");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setApiError(error?.data?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-transparent">

      {/* ── Left panel ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative overflow-hidden flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-700 to-violet-900" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-400/25 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-violet-300/15 blur-2xl" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">ShopHub</span>
          </Link>

          <div className="mt-auto space-y-7 mb-8">
            <div>
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
                Your next favourite<br />
                <span className="text-violet-200">store awaits.</span>
              </h1>
              <p className="text-violet-100/75 text-sm xl:text-base leading-relaxed max-w-sm">
                Join thousands of smart shoppers. Creating an account takes less than a minute.
              </p>
            </div>

            <motion.ul variants={list} initial="hidden" animate="visible" className="space-y-3">
              {PERKS.map(({ icon: Icon, title, detail }) => (
                <motion.li key={title} variants={item} className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{title}</p>
                    <p className="text-xs text-violet-200/80 mt-0.5">{detail}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <blockquote className="border-l-2 border-white/30 pl-4">
            <p className="text-xs text-violet-100/70 italic leading-relaxed">
              &ldquo;Signed up in 30 seconds. Now I can&apos;t stop shopping.&rdquo;
            </p>
            <footer className="mt-1.5 text-[11px] text-violet-200/60">— Sarah K., Verified customer</footer>
          </blockquote>
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 lg:py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <Store className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">ShopHub</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Create account</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-violet-600 dark:text-violet-400 hover:underline font-semibold">
                Sign in
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
              name="name"
              control={control}
              label="Full name"
              type="text"
              placeholder="Jane Smith"
              required
              leftIcon={<User className="h-4 w-4" />}
            />
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
              placeholder="Min. 8 characters"
              required
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <RHFInput
              name="confirmPassword"
              control={control}
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              required
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {/* Mobile perks strip */}
            <div className="lg:hidden grid grid-cols-2 gap-2 py-1">
              {PERKS.map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <Icon className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                  {title}
                </div>
              ))}
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />} className="mt-2">
              Create my account
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
            By creating an account you agree to our{" "}
            <Link href="#" className="hover:underline text-zinc-500 dark:text-zinc-400">Terms of Service</Link>
            {" and "}
            <Link href="#" className="hover:underline text-zinc-500 dark:text-zinc-400">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
