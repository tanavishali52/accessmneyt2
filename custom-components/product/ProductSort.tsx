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
      <ArrowUpDown className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 pl-9 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
