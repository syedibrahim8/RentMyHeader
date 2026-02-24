export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg-dark">
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-brand-primary/10 blur-[150px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-brand-accent/5 blur-[150px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
