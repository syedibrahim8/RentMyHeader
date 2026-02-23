"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Calendar, DollarSign, Users, ArrowRight, Zap } from "lucide-react";
import { campaignApi } from "@/src/lib/api";
import { mockCampaigns } from "@/src/lib/mock-data";
import { StatusChip } from "@/src/components/ui/status-chip";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { SkeletonCard } from "@/src/components/ui/skeleton";
import { EmptyCampaigns } from "@/src/components/ui/empty-state";
import { TopNav } from "@/src/components/layout/top-nav";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import type { Campaign, AssetType } from "@/src/lib/types";

const assetColors: Record<AssetType, string> = {
  header: "from-violet-600 to-indigo-600",
  bio: "from-cyan-500 to-blue-600",
  post: "from-emerald-500 to-teal-600",
};

const assetIcons: Record<AssetType, string> = {
  header: "🖼",
  bio: "✍️",
  post: "📝",
};

function CampaignCard({ campaign, index }: { campaign: Campaign; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:-translate-y-1"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${assetColors[campaign.assetType]} text-base`}>
            {assetIcons[campaign.assetType]}
          </div>
          <div>
            <p className="font-semibold text-white capitalize">{campaign.assetType} Placement</p>
            {campaign.brandName && <p className="text-xs text-zinc-500">{campaign.brandName}</p>}
          </div>
        </div>
        <StatusChip status={campaign.status} dot />
      </div>

      <p className="flex-1 text-sm leading-relaxed text-zinc-300 line-clamp-3">{campaign.requirements}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-white/8 bg-white/4 p-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <DollarSign className="h-3.5 w-3.5 text-violet-400" />
          <span>
            {campaign.budgetMin && campaign.budgetMax
              ? `${formatCurrency(campaign.budgetMin)} – ${formatCurrency(campaign.budgetMax)}`
              : campaign.budgetMin
                ? `From ${formatCurrency(campaign.budgetMin)}`
                : "Open budget"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Calendar className="h-3.5 w-3.5 text-violet-400" />
          <span>{formatDate(campaign.startDate)}</span>
        </div>
        {campaign.applicationCount !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 col-span-2">
            <Users className="h-3.5 w-3.5 text-violet-400" />
            <span>{campaign.applicationCount} applicant{campaign.applicationCount !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          Ends {formatDate(campaign.endDate)}
        </span>
        <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} className="text-violet-400 hover:text-violet-300">
          View details
        </Button>
      </div>
    </motion.article>
  );
}

const assetOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All types" },
  { value: "header", label: "Header" },
  { value: "bio", label: "Bio" },
  { value: "post", label: "Post" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "budget_high", label: "Budget: High" },
  { value: "budget_low", label: "Budget: Low" },
];

export function DiscoveryPage() {
  const [search, setSearch] = useState("");
  const [assetFilter, setAssetFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", "open"],
    queryFn: campaignApi.open,
    placeholderData: mockCampaigns,
    retry: false,
  });

  const campaigns = data ?? mockCampaigns;

  const filtered = campaigns
    .filter((c) => {
      if (assetFilter !== "all" && c.assetType !== assetFilter) return false;
      if (search && !c.requirements.toLowerCase().includes(search.toLowerCase()) && !(c.brandName?.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "budget_high") return (b.budgetMax ?? 0) - (a.budgetMax ?? 0);
      if (sort === "budget_low") return (a.budgetMin ?? 0) - (b.budgetMin ?? 0);
      return (b.createdAt ?? b.startDate).localeCompare(a.createdAt ?? a.startDate);
    });

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <TopNav />
      <div className="pt-20">
        {/* Hero */}
        <div className="relative border-b border-white/8 py-14 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-violet-600/10 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-400">
              <Zap className="h-3 w-3 text-violet-400" />
              {campaigns.length} open campaigns
            </div>
            <h1 className="text-4xl font-bold md:text-5xl">Discover campaigns</h1>
            <p className="mt-3 text-zinc-400">Find brands looking for your audience. Apply, negotiate, and get paid.</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaigns, brands, requirements…"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1 rounded-xl bg-white/5 p-1">
                {assetOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAssetFilter(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${assetFilter === opt.value ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-white/15 bg-[#0f0f14] px-3 py-2 text-sm text-zinc-300 outline-none focus:border-violet-500/60"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyCampaigns />
          ) : (
            <>
              <p className="mb-4 text-sm text-zinc-500">{filtered.length} campaign{filtered.length !== 1 ? "s" : ""} found</p>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((campaign, i) => (
                  <CampaignCard key={campaign.id} campaign={campaign} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}