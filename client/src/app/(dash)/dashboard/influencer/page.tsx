"use client";

import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { useMyProfiles, useMyApplications, useStripeOnboard } from "@/hooks/api-hooks";
import { UserCircle, Briefcase, CheckCircle2, Clock, DollarSign, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function InfluencerDashboard() {
  const { data: profiles, isLoading: profilesLoading } = useMyProfiles();
  const { data: applications, isLoading: appsLoading } = useMyApplications();
  const { mutate: onboardStripe, isPending: onboardLoading } = useStripeOnboard();
  
  const stats = [
    { label: "Active Profiles", value: profiles?.length || 0, icon: <UserCircle className="text-brand-primary" />, glow: "from-brand-primary/20" },
    { label: "Applications", value: applications?.length || 0, icon: <Briefcase className="text-brand-secondary" />, glow: "from-brand-secondary/20" },
    { label: "Pending", value: applications?.filter((a: any) => a.status === "pending").length || 0, icon: <Clock className="text-brand-accent" />, glow: "from-brand-accent/20" },
    { label: "Approved", value: applications?.filter((a: any) => a.status === "approved").length || 0, icon: <CheckCircle2 className="text-emerald-400" />, glow: "from-emerald-400/20" },
  ];

  const loading = profilesLoading || appsLoading;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white">Influencer Console</h1>
        <p className="text-white/40">Manage your creator presence and track opportunities.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br ${stat.glow} to-transparent before:opacity-30 p-6`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">{stat.icon}</div>
              </div>
              <p className="text-sm font-medium text-white/40">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-bold text-white">{loading ? "..." : stat.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Recent Activity">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Clock className="text-white/20" />
            </div>
            <p className="text-white/50 font-medium">No recent activity yet</p>
            <p className="mt-1 text-xs text-white/20 max-w-[320px]">
              Applications, approvals, and profile updates will show up here.
            </p>
          </div>
        </Card>

        <Card title="Payout Setup">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 p-3">
                  <DollarSign className="text-brand-secondary" size={18} />
                </div>
                <div>
                  <p className="font-bold text-white">Connect Stripe</p>
                  <p className="text-xs text-white/40">Required to receive payouts.</p>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => onboardStripe(undefined as any)} disabled={onboardLoading}>
              {onboardLoading ? "Starting..." : "Start Onboarding"} <Sparkles size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
