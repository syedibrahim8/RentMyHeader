"use client";

import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

interface ProgressProps {
    value: number; // 0-100
    className?: string;
    showLabel?: boolean;
    color?: "violet" | "cyan" | "emerald" | "amber";
}

const colorMap = {
    violet: "from-violet-600 to-indigo-500",
    cyan: "from-cyan-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-400",
    amber: "from-amber-500 to-orange-400",
};

export function Progress({ value, className, showLabel, color = "violet" }: ProgressProps) {
    const clamped = Math.min(100, Math.max(0, value));
    return (
        <div className={cn("space-y-1.5", className)}>
            {showLabel && (
                <div className="flex justify-between text-xs text-zinc-400">
                    <span>Progress</span>
                    <span className="font-medium text-white">{clamped}%</span>
                </div>
            )}
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clamped}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("h-full rounded-full bg-gradient-to-r", colorMap[color])}
                />
            </div>
        </div>
    );
}
