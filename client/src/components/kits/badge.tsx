import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}

export const Badge = ({ children, className, variant = "neutral" }: BadgeProps) => {
  const variants = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
    info: "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20 shadow-[0_0_15px_rgba(33,212,253,0.1)]",
    neutral: "bg-white/5 text-white/60 border-white/10",
  };

  return (
    <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
};
