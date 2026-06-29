"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Heading } from "./Typography";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "right" | "left";
  width?: "sm" | "md" | "lg";
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = "right",
  width = "md",
  className,
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const widths = { sm: "w-72", md: "w-96", lg: "w-[480px]" };
  const translate = {
    right: open ? "translate-x-0" : "translate-x-full",
    left: open ? "translate-x-0" : "-translate-x-full",
  };
  const position = { right: "right-0", left: "left-0" };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed top-0 z-50 h-full bg-white shadow-2xl flex flex-col",
          "transition-transform duration-300 ease-in-out",
          widths[width],
          position[side],
          translate[side],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          {title && <Heading size="md">{title}</Heading>}
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto" aria-label="Close drawer">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 px-5 py-4 border-t border-slate-200">{footer}</div>
        )}
      </div>
    </>
  );
}
