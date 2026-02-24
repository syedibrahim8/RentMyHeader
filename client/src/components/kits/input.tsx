import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 outline-none transition focus:border-cyan-300 focus:shadow-[0_0_20px_rgba(34,211,238,0.35)]",
      className,
    )}
    {...props}
  />
);
