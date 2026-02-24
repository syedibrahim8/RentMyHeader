import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={clsx(
      "rounded-xl px-4 py-2 font-medium transition hover:-translate-y-0.5 disabled:opacity-50",
      "bg-gradient-to-r from-fuchsia-500 to-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]",
      className,
    )}
    {...props}
  />
);
