import { PropsWithChildren } from "react";
import clsx from "clsx";

export const Field = ({ label, children, className, error }: PropsWithChildren<{ label: string; className?: string; error?: string }>) => (
  <div className={clsx("space-y-2", className)}>
    <label className="text-sm font-medium text-white/50 px-1">{label}</label>
    {children}
    {error && <p className="text-xs text-rose-400 px-1 font-medium">{error}</p>}
  </div>
);
