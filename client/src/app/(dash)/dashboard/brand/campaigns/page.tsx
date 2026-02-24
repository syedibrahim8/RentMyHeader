"use client";

import { useBrandCampaigns } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { Badge } from "@/components/kits/badge";
import { Megaphone, Plus, ArrowRight, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BrandCampaignsPage() {
  const { data: campaigns, isLoading } = useBrandCampaigns();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">My Campaigns</h1>
          <p className="text-white/40 mt-1">Track and manage your brand collaborations.</p>
        </div>
        <Link href="/dashboard/brand/campaigns/new">
          <Button className="h-12 px-8">
            <Plus size={18} className="mr-2" /> Launch New
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />)}
        </div>
      ) : !campaigns || campaigns.length === 0 ? (
        <Card className="py-20 text-center flex flex-col items-center border-dashed border-white/10">
          <Megaphone size={48} className="text-white/10 mb-4" />
          <h2 className="text-xl font-bold text-white">No campaigns found</h2>
          <p className="text-white/40 mb-6">Start by creating your first campaign to find influencers.</p>
          <Link href="/dashboard/brand/campaigns/new">
            <Button variant="outline">Create Campaign</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign: any, i: number) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/brand/campaigns/${campaign._id}`}>
                <Card className="flex items-center justify-between hover:bg-white/10 transition-colors border-white/5 p-6">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                      <Megaphone className="text-brand-primary" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{campaign.title}</h4>
                      <p className="text-sm text-white/40">Budget: ${campaign.budget} • Status: {campaign.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="hidden md:flex items-center gap-6 text-white/40">
                      <div className="flex flex-col items-center">
                        <Users size={18} className="mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Apps</span>
                        <span className="text-white font-bold">0</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <DollarSign size={18} className="mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Spent</span>
                        <span className="text-white font-bold">$0</span>
                      </div>
                    </div>
                    <Badge variant={campaign.status === "open" ? "success" : "neutral"}>
                      {campaign.status}
                    </Badge>
                    <ArrowRight size={24} className="text-white/10" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
