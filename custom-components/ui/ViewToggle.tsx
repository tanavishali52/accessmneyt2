"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "./Tooltip";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
  className?: string;
}

export function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white", className)}>
      <Tooltip content="Grid view">
        <button
          type="button"
          onClick={() => onChange("grid")}
          className={cn(
            "flex items-center justify-center h-9 w-9 transition-colors",
            view === "grid"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:bg-slate-50"
          )}
          aria-label="Grid view"
          aria-pressed={view === "grid"}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip content="List view">
        <button
          type="button"
          onClick={() => onChange("list")}
          className={cn(
            "flex items-center justify-center h-9 w-9 transition-colors border-l border-slate-200",
            view === "list"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:bg-slate-50"
          )}
          aria-label="List view"
          aria-pressed={view === "list"}
        >
          <List className="h-4 w-4" />
        </button>
      </Tooltip>
    </div>
  );
}
