"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/custom-components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold",
        "border transition-all duration-200 active:scale-95",
        isDark
          ? "bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-zinc-700"
          : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200",
        className
      )}
    >
      {isDark ? (
        <>
          <Sun className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
