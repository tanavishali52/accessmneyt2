"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Store, ArrowRight, Check } from "lucide-react";
import { signupSchema, type SignupFormValues } from "@/lib/validations";
import { useSignupMutation } from "@/services/authService";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { Button } from "@/custom-components/ui/Button";
import { RHFInput } from "@/custom-components/ui/RHF";
import { Alert } from "@/custom-components/ui/Alert";
import { Divider } from "@/custom-components/ui/Divider";
import { Heading, Paragraph } from "@/custom-components/ui/Typography";

const PERKS = [
  "Track orders in real time",
  "Saved cart across devices",
  "Personalised product suggestions",
  "Faster checkout",
];

export function SignupSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();

  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setApiError(null);
    try {
      const result = await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials(result));
      router.push("/");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setApiError(error?.data?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">ShopHub</span>
        </Link>

        <div className="space-y-6">
          <Heading as="h1" size="3xl" className="text-white leading-tight">
            Join thousands of happy shoppers
          </Heading>
          <ul className="space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <span className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="text-slate-300 text-sm">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <Paragraph size="xs" className="text-slate-500">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </Paragraph>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">ShopHub</span>
          </Link>

          <Heading as="h2" size="2xl" className="mb-1">Create account</Heading>
          <Paragraph variant="muted" className="mb-8">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </Paragraph>

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
              hint="Must contain uppercase letter and number"
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

            <RHFInput
              name="confirmPassword"
              control={control}
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              required
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Create account
            </Button>
          </form>

          <Divider label="or" className="my-6" />

          <Link href="/">
            <Button variant="secondary" size="lg" fullWidth>
              Continue as guest
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
