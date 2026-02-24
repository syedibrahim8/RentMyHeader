import { PropsWithChildren } from "react";
import clsx from "clsx";

export const Card = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx("glass rounded-2xl p-5 shadow-2xl shadow-black/20", className)}>{children}</div>
);
