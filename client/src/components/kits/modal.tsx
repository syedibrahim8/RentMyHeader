import { PropsWithChildren } from "react";

export const Modal = ({ open, children }: PropsWithChildren<{ open: boolean }>) => {
  if (!open) return null;
  return <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">{children}</div>;
};
