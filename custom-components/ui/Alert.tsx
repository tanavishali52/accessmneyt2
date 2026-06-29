import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const config = {
  info:    { icon: Info,           styles: "bg-blue-50 border-blue-200 text-blue-800",   iconClass: "text-blue-500" },
  success: { icon: CheckCircle2,   styles: "bg-green-50 border-green-200 text-green-800", iconClass: "text-green-500" },
  warning: { icon: TriangleAlert,  styles: "bg-amber-50 border-amber-200 text-amber-800", iconClass: "text-amber-500" },
  danger:  { icon: AlertCircle,    styles: "bg-red-50 border-red-200 text-red-800",       iconClass: "text-red-500" },
};

export function Alert({ variant = "info", title, children, onClose, className }: AlertProps) {
  const { icon: Icon, styles, iconClass } = config[variant];

  return (
    <div className={cn("flex gap-3 p-4 rounded-xl border text-sm", styles, className)} role="alert">
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconClass)} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
