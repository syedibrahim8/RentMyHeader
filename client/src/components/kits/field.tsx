import { PropsWithChildren } from "react";

export const Field = ({ label, children }: PropsWithChildren<{ label: string }>) => (
  <label className="space-y-2 text-sm">
    <span className="text-white/80">{label}</span>
    {children}
  </label>
);
