import clsx from "clsx";

export const Badge = ({ label, tone = "default" }: { label: string; tone?: "default" | "success" | "warn" }) => (
  <span
    className={clsx(
      "rounded-full border px-2 py-0.5 text-xs",
      tone === "success" && "border-emerald-300 text-emerald-200",
      tone === "warn" && "border-amber-300 text-amber-100",
      tone === "default" && "border-white/30 text-white/90",
    )}
  >
    {label}
  </span>
);
