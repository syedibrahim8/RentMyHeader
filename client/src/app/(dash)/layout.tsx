import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-4 p-4 md:grid-cols-[240px_1fr]">
      <Sidebar />
      <section className="space-y-4">
        <Topbar />
        {children}
      </section>
    </main>
  );
}
