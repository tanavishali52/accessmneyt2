import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Skeleton({ width, height, rounded = "md", className, ...props }: SkeletonProps) {
  const roundeds = {
    sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", full: "rounded-full",
  };
  return (
    <div
      className={cn("animate-pulse bg-slate-200", roundeds[rounded], className)}
      style={{ width, height }}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="14px" className={i === lines - 1 ? "w-3/4" : "w-full"} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3", className)}>
      <Skeleton height="160px" rounded="lg" className="w-full sm:h-[180px]" />
      <Skeleton height="16px" className="w-3/4" />
      <Skeleton height="12px" className="w-1/2" />
      <div className="flex justify-between items-center pt-1">
        <Skeleton height="20px" className="w-1/4" />
        <Skeleton height="36px" className="w-1/3" rounded="lg" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("space-y-0 border border-slate-200 rounded-xl overflow-hidden", className)}>
      <div className="flex gap-3 sm:gap-4 px-3 sm:px-4 py-3 bg-slate-50 border-b border-slate-200">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="12px" className="flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 sm:gap-4 px-3 sm:px-4 py-3.5 border-b border-slate-100 last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height="14px" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  return <Skeleton rounded="full" className={cn(sizes[size], className)} />;
}
