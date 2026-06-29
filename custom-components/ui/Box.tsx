import { cn } from "@/lib/utils";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  rounded?: "none" | "md" | "lg" | "xl" | "full";
}

export function Box({
  as: Tag = "div",
  padding = "none",
  shadow = "none",
  border = false,
  rounded = "xl",
  className,
  children,
  ...props
}: BoxProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };
  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };
  const roundeds = {
    none: "",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <Tag
      className={cn(
        "bg-white",
        paddings[padding],
        shadows[shadow],
        border && "border border-slate-200",
        roundeds[rounded],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
