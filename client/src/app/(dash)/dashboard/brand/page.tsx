"use client";

import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { useBrandCampaigns } from "@/hooks/api-hooks";
import { Megaphone, Users, DollarSign, Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BrandDashboard() {
  const { data: campaigns, isLoading } = useBrandCampaigns();

  const stats = [
    { label: "Total Campaigns", value: campaigns?.length || 0, icon: <Megaphone className="text-brand-primary" />, color: "from-brand-primary/20 to-transparent" },
    { label: "Active Influencers", value: 0, icon: <Users className="text-brand-secondary" />, color: "from-brand-secondary/20 to-transparent" },
    { label: "Total Budget Locked", value: "$0", icon: <DollarSign className="text-brand-accent" />, color: "from-brand-accent/20 to-transparent" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Brand Console</h1>
          <p className="text-white/40 mt-2">Manage your premium campaigns and collaborations.</p>
        </div>
        <Link href="/dashboard/brand/campaigns/new">
          <Button className="h-12 px-8">
            <Plus size={18} className="mr-2" /> Create Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br ${stat.color} before:opacity-30 p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">{stat.icon}</div>
              </div>
              <p className="text-sm font-medium text-white/40">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{isLoading ? "..." : stat.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card title="Your Campaigns">
        {isLoading ? (
          <div className="animate-pulse space-y-4 py-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-white/5" />
            ))}
          </div>
        ) : !campaigns || campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <Megaphone className="text-white/20" size={32} />
            </div>
            <p className="text-xl font-bold text-white mb-2">No campaigns yet</p>
            <p className="text-white/40 mb-8 max-w-sm mx-auto">Launch your first campaign to start receiving applications from elite influencers.</p>
            <Link href="/dashboard/brand/campaigns/new">
              <Button variant="outline">Create your first campaign</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign: any) => (
              <Link key={campaign._id} href={`/dashboard/brand/campaigns/${campaign._id}`}>
                <div className="group flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/20">
                      <Megaphone className="text-brand-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{campaign.title}</h4>
                      <p className="text-sm text-white/40">{campaign.status}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
