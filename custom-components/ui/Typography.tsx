import { cn } from "@/lib/utils";

// ─── Heading ─────────────────────────────────────────────────────────────────

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  muted?: boolean;
}

export function Heading({
  as: Tag = "h2",
  size = "lg",
  muted = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const sizes = {
    xs: "text-xs font-semibold",
    sm: "text-sm font-semibold",
    md: "text-base font-semibold",
    lg: "text-lg font-semibold",
    xl: "text-xl font-bold",
    "2xl": "text-2xl font-bold",
    "3xl": "text-3xl font-bold",
  };

  return (
    <Tag
      className={cn(
        sizes[size],
        muted ? "text-slate-500" : "text-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ─── Paragraph ───────────────────────────────────────────────────────────────

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "muted" | "subtle";
}

export function Paragraph({
  size = "sm",
  variant = "default",
  className,
  children,
  ...props
}: ParagraphProps) {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  const variants = {
    default: "text-slate-700",
    muted: "text-slate-500",
    subtle: "text-slate-400",
  };

  return (
    <p
      className={cn(sizes[size], variants[variant], "leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-slate-700", className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// ─── Caption ─────────────────────────────────────────────────────────────────

export function Caption({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("text-xs text-slate-400", className)}
      {...props}
    >
      {children}
    </span>
  );
}
