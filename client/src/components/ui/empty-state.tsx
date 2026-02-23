"use client";

import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { Package, Inbox, Zap } from "lucide-react";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-12 text-center",
                className
            )}
        >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8 text-zinc-400">
                {icon ?? <Package className="h-6 w-6" />}
            </div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            {description && <p className="mt-1 max-w-sm text-sm text-zinc-400">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </motion.div>
    );
}

export function EmptyApplications({ action }: { action?: React.ReactNode }) {
    return (
        <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No applications yet"
            description="Browse open campaigns and apply to start earning from your audience."
            action={action}
        />
    );
}

export function EmptyCampaigns({ action }: { action?: React.ReactNode }) {
    return (
        <EmptyState
            icon={<Zap className="h-6 w-6" />}
            title="No campaigns yet"
            description="Create your first campaign and start connecting with influencers."
            action={action}
        />
    );
}
