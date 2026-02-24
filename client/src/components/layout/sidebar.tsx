"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import {
  Home,
  Megaphone,
  UserCircle,
  Briefcase,
  BarChart3,
  Settings,
  ShieldAlert,
  LogOut,
  Sparkles
} from "lucide-react";
import clsx from "clsx";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const brandItems = [
    { label: "Overview", href: "/dashboard/brand", icon: <Home size={20} /> },
    { label: "My Campaigns", href: "/dashboard/brand/campaigns", icon: <Megaphone size={20} /> },
    { label: "New Campaign", href: "/dashboard/brand/campaigns/new", icon: <Sparkles size={18} className="text-brand-secondary" /> },
  ];

  const influencerItems = [
    { label: "Overview", href: "/dashboard/influencer", icon: <Home size={20} /> },
    { label: "Social Profiles", href: "/dashboard/influencer/profiles", icon: <UserCircle size={20} /> },
    { label: "Browse Campaigns", href: "/dashboard/influencer/campaigns", icon: <Briefcase size={20} /> },
    { label: "My Applications", href: "/dashboard/influencer/applications", icon: <BarChart3 size={20} /> },
  ];

  const adminItems = [
    { label: "Admin Console", href: "/dashboard/admin", icon: <ShieldAlert size={20} /> },
  ];

  const items = user?.role === "brand" ? brandItems : user?.role === "influencer" ? influencerItems : adminItems;

  return (
    <aside className="glass flex h-[calc(100vh-2rem)] w-72 flex-col rounded-3xl p-6 shadow-2xl">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary">
          <Sparkles className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          RentMyHeader
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300",
              pathname === item.href
                ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                : "text-white/40 hover:bg-white/5 hover:text-white"
            )}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/10 pt-6">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/40 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
