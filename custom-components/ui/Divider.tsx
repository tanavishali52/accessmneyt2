import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Divider({ label, className, orientation = "horizontal" }: DividerProps) {
  if (orientation === "vertical") {
    return <div className={cn("w-px bg-slate-200 self-stretch", className)} />;
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
    );
  }

  return <div className={cn("h-px w-full bg-slate-200", className)} />;
}
