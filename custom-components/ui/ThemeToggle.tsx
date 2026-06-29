"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/custom-components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex items-center justify-center h-10 w-10 rounded-xl",
        "bg-zinc-100 dark:bg-zinc-800",
        "text-zinc-600 dark:text-zinc-300",
        "hover:bg-zinc-200 dark:hover:bg-zinc-700",
        "border border-zinc-200 dark:border-zinc-700",
        "transition-all duration-200",
        "active:scale-95",
        className
      )}
    >
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: theme === "light" ? 1 : 0, transform: theme === "light" ? "rotate(0deg)" : "rotate(90deg)" }}>
        <Moon className="h-4 w-4" />
      </span>
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: theme === "dark" ? 1 : 0, transform: theme === "dark" ? "rotate(0deg)" : "rotate(-90deg)" }}>
        <Sun className="h-4 w-4" />
      </span>
    </button>
  );
}
