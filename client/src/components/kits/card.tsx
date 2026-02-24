import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ children, className, title, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "glass-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-1 transition-all duration-500",
        className
      )}
      {...props}
    >
      <div className="relative z-10 h-full w-full rounded-[22px] bg-gradient-to-br from-white/5 to-transparent p-6 shadow-2xl">
        {title && <h3 className="mb-6 text-xl font-bold tracking-tight text-white/90">{title}</h3>}
        {children}
      </div>
      <div className="absolute -right-20 -top-20 z-0 h-40 w-40 rounded-full bg-brand-primary/10 blur-[80px]" />
    </div>
  );
}
