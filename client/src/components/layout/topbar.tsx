"use client";

import { useAuth } from "@/providers/auth-provider";
import { Bell, Search, User } from "lucide-react";

export const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="mb-8 flex items-center justify-between px-2">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-secondary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search campaigns, influencers..."
            className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-2xl bg-white/5 border border-white/10 p-3 text-white/60 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute right-3.5 top-3.5 h-1.5 w-1.5 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(249,83,198,0.5)]" />
        </button>

        <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-1.5 pr-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary/20 to-brand-secondary/20 border border-white/10">
            <User className="text-brand-secondary" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-none capitalize">{user?.name || "Guest"}</span>
            <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider mt-1">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
