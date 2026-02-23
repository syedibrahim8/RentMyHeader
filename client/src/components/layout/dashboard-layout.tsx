"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { cn } from "@/src/lib/utils";

interface DashboardLayoutProps {
    children: ReactNode;
    className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-[#07070c] overflow-hidden">
            {/* Sidebar (desktop only) */}
            <div className="hidden md:flex md:flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main content */}
            <main className={cn("flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8", className)}>
                {children}
            </main>
        </div>
    );
}
