"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-dark">
      <div className="flex min-h-screen gap-4 p-4">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="glass rounded-3xl p-4 md:p-6 h-[calc(100vh-2rem)] overflow-y-auto">
            <Topbar />
            <div className="mx-auto w-full max-w-7xl px-1 md:px-2 pb-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}