import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Typography";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, required, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <Label htmlFor={textareaId} required={required}>{label}</Label>}
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={cn(
            "w-full rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2 text-sm",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-400 focus:ring-red-400" : "border-slate-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
