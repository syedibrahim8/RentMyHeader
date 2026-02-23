"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    count?: number;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    className?: string;
    children?: (activeTab: string) => ReactNode;
}

export function Tabs({ tabs, defaultTab, onChange, className, children }: TabsProps) {
    const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

    function handleChange(id: string) {
        setActive(id);
        onChange?.(id);
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div className="relative flex gap-1 rounded-xl bg-white/5 p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                            active === tab.id ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        {active === tab.id && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute inset-0 rounded-lg bg-white/10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                            {tab.icon}
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-xs">{tab.count}</span>
                            )}
                        </span>
                    </button>
                ))}
            </div>
            {children?.(active)}
        </div>
    );
}
