import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-all duration-300",
        "focus:border-brand-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-brand-primary/10",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
