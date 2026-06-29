"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Paragraph } from "./Typography";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, total, limit, onPageChange, className }: PaginationProps) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div className={cn("flex items-center justify-between flex-wrap gap-3", className)}>
      <Paragraph size="xs" variant="muted">
        Showing {from}–{to} of {total} results
      </Paragraph>

      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-slate-400">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                page === p
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {p}
            </button>
          )
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
