import { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
}

export const Button = ({ className, variant = "primary", disabled, ...props }: ButtonProps) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-[0_0_20px_rgba(95,46,234,0.25)] hover:shadow-[0_0_30px_rgba(95,46,234,0.40)]",
    outline: "border border-border-glass hover:bg-white/5 text-white/90",
    ghost: "hover:bg-white/5 text-white/80",
    danger: "bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30",
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      disabled={disabled}
      className={clsx(
        "relative flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-semibold",
        "transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary/40",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
