import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          "inline-flex items-center justify-center gap-2",
          "font-medium",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Sizes (standardized heights)
          {
            sm: "h-9 px-3.5 text-sm rounded-lg",
            md: "h-10 px-4 text-sm rounded-lg",
            lg: "h-11 px-5 text-sm rounded-lg",
          }[size],
          
          // Variants (reduced shadows)
          {
            primary: [
              "bg-mint-600 text-white",
              "hover:bg-mint-700",
            ],
            secondary: [
              "bg-slate-100 text-slate-700",
              "hover:bg-slate-200",
            ],
            ghost: [
              "text-slate-600",
              "hover:text-slate-900 hover:bg-slate-50",
            ],
            outline: [
              "border border-slate-200 text-slate-700 bg-white",
              "hover:border-slate-300 hover:bg-slate-50",
            ],
            danger: [
              "bg-red-500 text-white",
              "hover:bg-red-600",
            ],
          }[variant],
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
