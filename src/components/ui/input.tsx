import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl",
          "border border-slate-200 bg-white px-4",
          "text-sm text-slate-900 placeholder:text-slate-400",
          "transition-all duration-200",
          "hover:border-slate-300",
          "focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[140px] w-full rounded-xl",
          "border border-slate-200 bg-white px-4 py-3",
          "text-sm text-slate-900 placeholder:text-slate-400",
          "transition-all duration-200 resize-none",
          "hover:border-slate-300",
          "focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
