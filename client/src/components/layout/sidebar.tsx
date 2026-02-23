"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/hooks/use-auth";
import {
    LayoutDashboard,
    Megaphone,
    FileText,
    User,
    CreditCard,
    Zap,
    PlusCircle,
    ChevronRight,
} from "lucide-react";

const influencerLinks = [
    { href: "/dashboard/influencer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/influencer/profiles", label: "Social Profiles", icon: User },
    { href: "/dashboard/influencer/campaigns", label: "Browse Campaigns", icon: Megaphone },
    { href: "/dashboard/influencer/applications", label: "My Applications", icon: FileText },
    { href: "/dashboard/influencer/earnings", label: "Earnings", icon: CreditCard },
];

const brandLinks = [
    { href: "/dashboard/brand", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/brand/campaigns", label: "My Campaigns", icon: Megaphone },
    { href: "/dashboard/brand/campaigns/new", label: "New Campaign", icon: PlusCircle },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const links = user?.role === "brand" ? brandLinks : influencerLinks;

    return (
        <aside className="flex h-full flex-col border-r border-white/8 bg-[#09090f] w-60">
            {/* Logo */}
            <div className="flex items-center gap-2 px-4 py-5 border-b border-white/8">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                    <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">RentMyHeader</span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== "/dashboard/brand" && href !== "/dashboard/influencer" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                                    : "text-zinc-400 hover:bg-white/8 hover:text-white"
                            )}
                        >
                            <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                            {label}
                            {isActive && <ChevronRight className="ml-auto h-3 w-3 text-violet-400" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            {user && (
                <div className="border-t border-white/8 p-3">
                    <div className="flex items-center gap-2.5 rounded-xl p-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-white">{user.name}</p>
                            <p className="truncate text-xs text-zinc-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
