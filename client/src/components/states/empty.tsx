import { Sparkles } from "lucide-react";
import { Button } from "@/components/kits/button";

export const EmptyState = ({ title, cta, onClick }: { title: string; cta?: string; onClick?: () => void }) => (
  <div className="glass rounded-2xl p-8 text-center">
    <Sparkles className="mx-auto mb-3" />
    <p className="mb-4 text-white/80">{title}</p>
    {cta && <Button onClick={onClick}>{cta}</Button>}
  </div>
);
