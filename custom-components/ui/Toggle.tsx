"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function Toggle({ checked, onChange, label, disabled = false, size = "md", className }: ToggleProps) {
  const sizes = {
    sm: { track: "w-8 h-4", thumb: "h-3 w-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "h-5 w-5", translate: "translate-x-5" },
  };
  const s = sizes[size];

  return (
    <label className={cn("inline-flex items-center gap-2.5 cursor-pointer", disabled && "opacity-50 cursor-not-allowed", className)}>
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          s.track,
          checked ? "bg-blue-600" : "bg-slate-200"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-sm transition-transform duration-200 m-0.5",
            s.thumb,
            checked ? s.translate : "translate-x-0"
          )}
        />
      </button>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
