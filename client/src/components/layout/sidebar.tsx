"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";

export const Sidebar = () => {
  const { user } = useAuth();
  const items =
    user?.role === "brand"
      ? [["Brand Home", "/dashboard/brand"], ["Campaigns", "/dashboard/brand/campaigns"]]
      : user?.role === "influencer"
        ? [["Influencer Home", "/dashboard/influencer"], ["Profiles", "/dashboard/influencer/profiles"], ["Campaigns", "/dashboard/influencer/campaigns"], ["Applications", "/dashboard/influencer/applications"]]
        : [["Admin", "/dashboard/admin"]];

  return (
    <aside className="glass h-full w-full rounded-2xl p-4">
      <p className="mb-4 text-lg font-semibold">RentMyHeader Luxe</p>
      <nav className="space-y-2">
        {items.map(([label, href]) => (
          <Link key={href} href={href} className="block rounded-lg px-3 py-2 hover:bg-white/10">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
