"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Plus, DollarSign, Calendar, Megaphone, Users, CheckCircle, XCircle,
  Loader2, ChevronRight, Eye, CreditCard, Zap, TrendingUp,
} from "lucide-react";
import { campaignApi, applicationApi, stripeApi } from "@/src/lib/api";
import { mockCampaigns } from "@/src/lib/mock-data";
import { StatusChip } from "@/src/components/ui/status-chip";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Modal } from "@/src/components/ui/modal";
import { Input, Textarea, Select } from "@/src/components/ui/input";
import { Tabs } from "@/src/components/ui/tabs";
import { SkeletonCard } from "@/src/components/ui/skeleton";
import { EmptyCampaigns, EmptyApplications } from "@/src/components/ui/empty-state";
import { DashboardLayout } from "@/src/components/layout/dashboard-layout";
import { RoleGuard } from "@/src/components/layout/role-guard";
import { useAuth } from "@/src/hooks/use-auth";
import { formatCurrency, formatDate, formatNumber } from "@/src/lib/utils";
import type { Campaign, Application, AssetType } from "@/src/lib/types";
import { toast } from "sonner";

// ─── Create Campaign Wizard ────────────────────────────────────────────────
function CreateCampaignModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    assetType: "header" as AssetType,
    startDate: "",
    endDate: "",
    requirements: "",
    budgetMin: "",
    budgetMax: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      campaignApi.create({
        assetType: form.assetType,
        startDate: form.startDate,
        endDate: form.endDate,
        requirements: form.requirements,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns", "brand"] });
      toast.success("Campaign created and published!");
      setStep(1);
      onClose();
    },
    onError: () => toast.error("Failed to create campaign. Try again."),
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const assetTypes: Array<{ value: AssetType; label: string; description: string; emoji: string }> = [
    { value: "header", label: "Header image", description: "Profile or banner header swap", emoji: "🖼" },
    { value: "bio", label: "Bio link", description: "Link placement in creator bio", emoji: "✍️" },
    { value: "post", label: "Sponsored post", description: "Thread, post, or article mention", emoji: "📝" },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Create New Campaign" description={`Step ${step} of 2`} size="lg">
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-300">Asset type</p>
            <div className="grid gap-2">
              {assetTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => update("assetType", t.value)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${form.assetType === t.value ? "border-violet-500/60 bg-violet-500/10" : "border-white/12 bg-white/4 hover:border-white/20"}`}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{t.label}</p>
                    <p className="text-xs text-zinc-400">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} required />
            <Input label="End date" type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} required />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!form.startDate || !form.endDate} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); mutate(); }} className="space-y-4">
          <Textarea label="Requirements" placeholder="Describe your campaign goals, audience, messaging, tone…" value={form.requirements} onChange={(e) => update("requirements", e.target.value)} rows={4} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Budget min (USD, optional)" type="number" placeholder="500" leftIcon={<DollarSign className="h-4 w-4" />} value={form.budgetMin} onChange={(e) => update("budgetMin", e.target.value)} />
            <Input label="Budget max (USD, optional)" type="number" placeholder="2000" leftIcon={<DollarSign className="h-4 w-4" />} value={form.budgetMax} onChange={(e) => update("budgetMax", e.target.value)} />
          </div>
          <div className="flex justify-between pt-2">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button type="submit" loading={isPending} leftIcon={<Zap className="h-4 w-4" />}>Launch campaign</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

// ─── Applications Panel ─────────────────────────────────────────────────────
function ApplicationsPanel({ campaign }: { campaign: Campaign }) {
  const qc = useQueryClient();
  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["applications", "campaign", campaign.id],
    queryFn: () => applicationApi.forCampaign(campaign.id),
    retry: false,
  });

  const { mutate: selectApp, isPending: selecting } = useMutation({
    mutationFn: (appId: string) => campaignApi.select(campaign.id, appId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns", "brand"] });
      qc.invalidateQueries({ queryKey: ["applications", "campaign", campaign.id] });
      toast.success("Influencer selected!");
    },
    onError: () => toast.error("Failed to select influencer."),
  });

  const { mutate: reviewProof, isPending: reviewing } = useMutation({
    mutationFn: ({ appId, action }: { appId: string; action: "approve" | "reject" }) =>
      applicationApi.review(appId, { action }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["applications", "campaign", campaign.id] });
      toast.success(vars.action === "approve" ? "Payment released to influencer!" : "Proof rejected.");
    },
    onError: () => toast.error("Review failed. Try again."),
  });

  const { mutate: pay, isPending: paying } = useMutation({
    mutationFn: () => stripeApi.payForCampaign(campaign.id),
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
      else toast.success("Payment initiated!");
    },
    onError: () => toast.error("Payment failed. Try again."),
  });

  if (isLoading) return <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>;
  if (apps.length === 0) return <EmptyApplications />;

  return (
    <div className="space-y-3">
      {/* Fund campaign CTA */}
      {campaign.status === "influencer_selected" && campaign.paymentStatus === "requires_payment" && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div>
            <p className="text-sm font-medium text-amber-300">Payment required</p>
            <p className="text-xs text-amber-400/80 mt-0.5">Fund escrow to activate the campaign.</p>
          </div>
          <Button size="sm" loading={paying} leftIcon={<CreditCard className="h-3.5 w-3.5" />} onClick={() => pay()}>
            Fund now
          </Button>
        </div>
      )}

      {apps.map((app: Application, i: number) => (
        <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white">
                {(app.influencerName ?? "?").charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{app.influencerName ?? `Influencer #${app.id.slice(-4)}`}</p>
                {app.socialProfile && (
                  <p className="text-xs text-zinc-500">{app.socialProfile.platform} · {formatNumber(app.socialProfile.followers)} followers · {app.socialProfile.engagementRate}% eng.</p>
                )}
              </div>
            </div>
            <StatusChip status={app.status} dot />
          </div>

          {app.coverMessage && (
            <p className="text-xs text-zinc-400 mb-3 italic leading-relaxed">&ldquo;{app.coverMessage}&rdquo;</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">{formatCurrency(app.proposedPrice)}</span>
            <div className="flex gap-2">
              {app.status === "applied" && campaign.status === "open" && (
                <Button size="sm" loading={selecting} onClick={() => selectApp(app.id)}>Select</Button>
              )}
              {app.status === "proof_submitted" && (
                <>
                  <Button size="sm" variant="destructive" loading={reviewing} leftIcon={<XCircle className="h-3.5 w-3.5" />}
                    onClick={() => reviewProof({ appId: app.id, action: "reject" })}>
                    Reject
                  </Button>
                  <Button size="sm" loading={reviewing} leftIcon={<CheckCircle className="h-3.5 w-3.5" />}
                    onClick={() => reviewProof({ appId: app.id, action: "approve" })}>
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>

          {app.proofUrl && (
            <a href={app.proofUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              <Eye className="h-3 w-3" /> View proof
            </a>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Campaign List Item ─────────────────────────────────────────────────────
function CampaignItem({ campaign, onViewApplications }: { campaign: Campaign; onViewApplications: (c: Campaign) => void }) {
  const assetEmoji: Record<AssetType, string> = { header: "🖼", bio: "✍️", post: "📝" };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">{assetEmoji[campaign.assetType]}</span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-white capitalize">{campaign.assetType} campaign</p>
              <StatusChip status={campaign.status} dot />
              {campaign.paymentStatus !== "none" && <StatusChip status={campaign.paymentStatus} />}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {formatDate(campaign.startDate)} → {formatDate(campaign.endDate)}
              {campaign.budgetMin && campaign.budgetMax && ` · ${formatCurrency(campaign.budgetMin)}–${formatCurrency(campaign.budgetMax)}`}
            </p>
            {campaign.requirements && (
              <p className="mt-1.5 text-xs text-zinc-400 line-clamp-1">{campaign.requirements}</p>
            )}
          </div>
        </div>
        <Button size="sm" variant="secondary" rightIcon={<ChevronRight className="h-3.5 w-3.5" />} onClick={() => onViewApplications(campaign)}>
          Applications {campaign.applicationCount !== undefined ? `(${campaign.applicationCount})` : ""}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export function BrandDashboardPage() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Campaign | null>(null);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns", "brand"],
    queryFn: campaignApi.brand,
    placeholderData: mockCampaigns,
    retry: false,
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => ["active", "funded", "influencer_selected"].includes(c.status)).length,
    completed: campaigns.filter((c) => c.status === "completed").length,
  };

  const tabs = [
    { id: "campaigns", label: "All Campaigns", icon: <Megaphone className="h-3.5 w-3.5" />, count: campaigns.length },
    ...(selected ? [{ id: "applications", label: `Applications — ${selected.assetType}`, icon: <Users className="h-3.5 w-3.5" /> }] : []),
  ];

  return (
    <RoleGuard allowed={["brand"]} redirectTo="/login">
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Brand Dashboard</h1>
              <p className="text-sm text-zinc-400 mt-0.5">Welcome, {user?.name}</p>
            </div>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
              New campaign
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total campaigns", value: stats.total, icon: Megaphone, color: "from-violet-600 to-indigo-600" },
              { label: "Active", value: stats.active, icon: Zap, color: "from-cyan-500 to-blue-600" },
              { label: "Completed", value: stats.completed, icon: TrendingUp, color: "from-emerald-500 to-teal-600" },
            ].map((s) => (
              <Card key={s.label}>
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}>
                  <s.icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{s.label}</p>
              </Card>
            ))}
          </div>

          <Tabs tabs={tabs} onChange={(t) => { if (t === "campaigns") setSelected(null); }}>
            {(activeTab) => (
              <>
                {activeTab === "campaigns" && (
                  <div className="space-y-3">
                    {isLoading ? (
                      <><SkeletonCard /><SkeletonCard /></>
                    ) : campaigns.length === 0 ? (
                      <EmptyCampaigns action={
                        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
                          Create first campaign
                        </Button>
                      } />
                    ) : (
                      campaigns.map((c) => (
                        <CampaignItem key={c.id} campaign={c} onViewApplications={(c) => setSelected(c)} />
                      ))
                    )}
                  </div>
                )}

                {activeTab === "applications" && selected && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(null)} className="text-xs text-zinc-400 hover:text-white transition-colors">← Back to campaigns</button>
                    </div>
                    <ApplicationsPanel campaign={selected} />
                  </div>
                )}
              </>
            )}
          </Tabs>
        </div>

        <CreateCampaignModal open={createOpen} onClose={() => setCreateOpen(false)} />
      </DashboardLayout>
    </RoleGuard>
  );
}