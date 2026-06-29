"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none shrink-0";

    const variants = {
      primary:   "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 rounded-lg",
      secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 rounded-lg",
      ghost:     "text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg",
      danger:    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 rounded-lg",
      outline:   "border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg",
    };

    // Touch-friendly minimum tap targets
    const sizes = {
      sm:   "h-8 min-h-[32px] px-3 text-xs",
      md:   "h-10 min-h-[40px] px-4 text-sm",
      lg:   "h-11 min-h-[44px] px-6 text-base",
      icon: "h-10 w-10 min-h-[40px] min-w-[40px] p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
