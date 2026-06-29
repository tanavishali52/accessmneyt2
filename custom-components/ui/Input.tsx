import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Typography";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, inputSize = "md", className, id, required, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    const sizes = {
      sm: "h-8 text-xs px-3",
      md: "h-9 text-sm px-3",
      lg: "h-11 text-base px-4",
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border bg-white text-slate-900 placeholder:text-slate-400",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-400 focus:ring-red-400" : "border-slate-200",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              sizes[inputSize],
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-slate-400">{rightIcon}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
