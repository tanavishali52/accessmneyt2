"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const checkId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <label
        htmlFor={checkId}
        className="flex items-start gap-2.5 cursor-pointer group"
      >
        <input
          ref={ref}
          type="checkbox"
          id={checkId}
          className={cn(
            "mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600",
            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer",
            className
          )}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-400">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
