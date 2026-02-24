import { PropsWithChildren } from "react";

export const Table = ({ children }: PropsWithChildren) => (
  <div className="overflow-x-auto rounded-2xl border border-white/20">
    <table className="min-w-full text-sm">{children}</table>
  </div>
);
