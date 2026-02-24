export const Skeleton = ({ className = "h-20" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />
);
