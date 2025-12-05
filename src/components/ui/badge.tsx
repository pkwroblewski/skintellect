import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "mint";
  size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full",
          
          // Sizes
          {
            sm: "px-2 py-0.5 text-xs",
            md: "px-2.5 py-0.5 text-xs",
          }[size],
          
          // Variants (slightly desaturated backgrounds)
          {
            default: "bg-slate-100 text-slate-600",
            success: "bg-emerald-50/80 text-emerald-700",
            warning: "bg-amber-50/80 text-amber-700",
            danger: "bg-red-50/80 text-red-700",
            info: "bg-sky-50/80 text-sky-700",
            outline: "bg-white text-slate-600 ring-1 ring-inset ring-slate-200",
            mint: "bg-mint-50/80 text-mint-700",
          }[variant],
          
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
