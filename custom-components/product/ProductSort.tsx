"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/lib/constants";

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ProductSort({ value, onChange, className }: ProductSortProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <ArrowUpDown className="absolute left-3 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 pl-9 pr-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
