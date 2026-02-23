"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  User, Plus, Twitter, Linkedin, Facebook, CreditCard, Zap,
  TrendingUp, ChevronRight, ExternalLink, Trash2, Check, X,
  FileText, DollarSign, Clock,
} from "lucide-react";
import { socialApi, applicationApi, campaignApi, stripeApi } from "@/src/lib/api";
import { mockCampaigns, mockSocialProfiles } from "@/src/lib/mock-data";
import { StatusChip } from "@/src/components/ui/status-chip";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Modal } from "@/src/components/ui/modal";
import { Input, Textarea, Select } from "@/src/components/ui/input";
import { Progress } from "@/src/components/ui/progress";
import { Tabs } from "@/src/components/ui/tabs";
import { SkeletonCard } from "@/src/components/ui/skeleton";
import { EmptyApplications, EmptyCampaigns } from "@/src/components/ui/empty-state";
import { DashboardLayout } from "@/src/components/layout/dashboard-layout";
import { RoleGuard } from "@/src/components/layout/role-guard";
import { useAuth } from "@/src/hooks/use-auth";
import { formatCurrency, formatDate, formatNumber } from "@/src/lib/utils";
import type { SocialProfile, Campaign, AssetType, Platform } from "@/src/lib/types";
import { toast } from "sonner";

const platformIcons: Record<Platform, React.ReactNode> = {
  twitter: <Twitter className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
};

const platformColors: Record<Platform, string> = {
  twitter: "from-sky-500 to-blue-600",
  linkedin: "from-blue-600 to-indigo-700",
  facebook: "from-blue-500 to-violet-600",
};

function ProfileCompletionCard({ profiles }: { profiles: SocialProfile[] }) {
  const { user } = useAuth();
  const hasProfile = profiles.length > 0;
  const completion = hasProfile ? (profiles[0].availability.length > 0 ? 100 : 85) : 30;

  return (
    <Card className="col-span-2">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Profile Completion</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Complete your profile to get discovered by top brands</p>
        </div>
        <span className="text-2xl font-bold text-white">{completion}%</span>
      </div>
      <Progress value={completion} color={completion >= 80 ? "emerald" : completion >= 50 ? "cyan" : "amber"} />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Account created", done: true },
          { label: "Social profile", done: hasProfile },
          { label: "Availability set", done: hasProfile && profiles[0]?.availability.length > 0 },
        ].map((item) => (
          <div key={item.label} className={`flex items-center gap-1.5 rounded-lg p-2 text-xs ${item.done ? "bg-emerald-500/10 text-emerald-300" : "bg-white/5 text-zinc-500"}`}>
            {item.done ? <Check className="h-3 w-3 flex-shrink-0" /> : <Clock className="h-3 w-3 flex-shrink-0" />}
            {item.label}
          </div>
        ))}
      </div>
    </Card>
  );
}

function StripeConnectCard() {
  const { mutate: onboard, isPending } = useMutation({
    mutationFn: stripeApi.connectOnboard,
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: () => toast.error("Failed to start Stripe onboarding."),
  });

  return (
    <Card>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
        <CreditCard className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-sm font-semibold text-white">Stripe Connect</h3>
      <p className="mt-1 text-xs text-zinc-400 leading-relaxed">Connect your bank to receive campaign payouts instantly.</p>
      <Button size="sm" className="mt-4 w-full" loading={isPending} onClick={() => onboard()}>
        Set up payouts
      </Button>
    </Card>
  );
}

function AddProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    platform: "twitter" as Platform,
    profileUrl: "",
    followers: "",
    niche: "",
    engagementRate: "",
    pricingHeader: "",
    pricingBio: "",
    pricingPost: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      socialApi.create({
        platform: form.platform,
        profileUrl: form.profileUrl,
        followers: Number(form.followers),
        niche: form.niche,
        engagementRate: Number(form.engagementRate),
        pricing: {
          header: Number(form.pricingHeader),
          bio: Number(form.pricingBio),
          post: Number(form.pricingPost),
        },
        availability: [],
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["socialProfiles", "me"] });
      toast.success("Social profile added!");
      onClose();
    },
    onError: () => toast.error("Failed to add profile. Please try again."),
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title="Add Social Profile" description="Connect a social account to make yourself discoverable." size="lg">
      <form onSubmit={(e) => { e.preventDefault(); mutate(); }} className="space-y-4">
        <Select label="Platform" value={form.platform} onChange={(e) => update("platform", e.target.value)}>
          <option value="twitter">Twitter / X</option>
          <option value="linkedin">LinkedIn</option>
          <option value="facebook">Facebook</option>
        </Select>
        <Input label="Profile URL" type="url" placeholder="https://twitter.com/yourhandle" value={form.profileUrl} onChange={(e) => update("profileUrl", e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Followers" type="number" placeholder="125000" value={form.followers} onChange={(e) => update("followers", e.target.value)} required />
          <Input label="Niche" placeholder="Tech & SaaS" value={form.niche} onChange={(e) => update("niche", e.target.value)} required />
          <Input label="Engagement rate %" type="number" step="0.1" placeholder="4.2" value={form.engagementRate} onChange={(e) => update("engagementRate", e.target.value)} required />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-300">Pricing (USD)</p>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Header" type="number" placeholder="1800" value={form.pricingHeader} onChange={(e) => update("pricingHeader", e.target.value)} required />
            <Input label="Bio" type="number" placeholder="900" value={form.pricingBio} onChange={(e) => update("pricingBio", e.target.value)} required />
            <Input label="Post" type="number" placeholder="1200" value={form.pricingPost} onChange={(e) => update("pricingPost", e.target.value)} required />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>Add profile</Button>
        </div>
      </form>
    </Modal>
  );
}

function ApplyModal({ campaign, profiles, open, onClose }: { campaign: Campaign | null; profiles: SocialProfile[]; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [profileId, setProfileId] = useState(profiles[0]?.id ?? "");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      applicationApi.apply({
        campaignId: campaign!.id,
        socialProfileId: profileId,
        proposedPrice: Number(price),
        coverMessage: message || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications", "me"] });
      toast.success("Application submitted!");
      onClose();
    },
    onError: () => toast.error("Failed to apply. Please try again."),
  });

  return (
    <Modal open={open} onClose={onClose} title="Apply to Campaign" description={`${campaign?.assetType?.toUpperCase() ?? ""} placement · ${campaign?.brandName ?? ""}`}>
      <form onSubmit={(e) => { e.preventDefault(); mutate(); }} className="space-y-4">
        <Select label="Social Profile" value={profileId} onChange={(e) => setProfileId(e.target.value)}>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.platform} — {formatNumber(p.followers)} followers</option>
          ))}
        </Select>
        <Input label="Proposed price (USD)" type="number" placeholder="1500" value={price} onChange={(e) => setPrice(e.target.value)} leftIcon={<DollarSign className="h-4 w-4" />} required />
        <Textarea label="Cover message (optional)" placeholder="Tell the brand why you're a great fit…" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>Submit application</Button>
        </div>
      </form>
    </Modal>
  );
}

function SubmitProofModal({ applicationId, open, onClose }: { applicationId: string; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [proofUrl, setProofUrl] = useState("");
  const [proofNotes, setProofNotes] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => applicationApi.submitProof(applicationId, { proofUrl, proofNotes: proofNotes || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications", "me"] });
      toast.success("Proof submitted! Awaiting brand review.");
      onClose();
    },
    onError: () => toast.error("Failed to submit proof."),
  });

  return (
    <Modal open={open} onClose={onClose} title="Submit Proof" description="Provide proof of asset delivery for brand review.">
      <form onSubmit={(e) => { e.preventDefault(); mutate(); }} className="space-y-4">
        <Input label="Proof URL" type="url" placeholder="https://twitter.com/you — screenshot link" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} leftIcon={<ExternalLink className="h-4 w-4" />} required />
        <Textarea label="Notes (optional)" placeholder="Describe what you delivered…" value={proofNotes} onChange={(e) => setProofNotes(e.target.value)} rows={3} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>Submit proof</Button>
        </div>
      </form>
    </Modal>
  );
}

export function InfluencerDashboardPage() {
  const { user } = useAuth();
  const [addProfileOpen, setAddProfileOpen] = useState(false);
  const [applyTarget, setApplyTarget] = useState<Campaign | null>(null);
  const [proofTarget, setProofTarget] = useState<string | null>(null);

  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["socialProfiles", "me"],
    queryFn: socialApi.me,
    placeholderData: mockSocialProfiles,
    retry: false,
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ["applications", "me"],
    queryFn: applicationApi.me,
    retry: false,
  });

  const { data: openCampaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns", "open"],
    queryFn: campaignApi.open,
    placeholderData: mockCampaigns.filter((c) => c.status === "open"),
    retry: false,
  });

  const qc = useQueryClient();
  const { mutate: deleteProfile } = useMutation({
    mutationFn: (id: string) => socialApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["socialProfiles", "me"] });
      toast.success("Profile removed.");
    },
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { id: "campaigns", label: "Browse Campaigns", icon: <Zap className="h-3.5 w-3.5" />, count: openCampaigns.length },
    { id: "applications", label: "My Applications", icon: <FileText className="h-3.5 w-3.5" />, count: applications.length },
  ];

  return (
    <RoleGuard allowed={["influencer"]} redirectTo="/login">
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="text-sm text-zinc-400 mt-0.5">Creator dashboard · Influencer</p>
          </div>

          <Tabs tabs={tabs}>
            {(activeTab) => (
              <>
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-3">
                      <ProfileCompletionCard profiles={profiles} />
                      <StripeConnectCard />
                    </div>

                    {/* Social Profiles */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white">Social Profiles</h2>
                        <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddProfileOpen(true)}>
                          Add profile
                        </Button>
                      </div>

                      {profilesLoading ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          <SkeletonCard /><SkeletonCard />
                        </div>
                      ) : profiles.length === 0 ? (
                        <Card className="text-center py-8">
                          <User className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
                          <p className="text-sm text-zinc-400">No social profiles yet. Add one to get started.</p>
                          <Button size="sm" className="mt-4" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddProfileOpen(true)}>
                            Add your first profile
                          </Button>
                        </Card>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {profiles.map((profile) => (
                            <motion.div key={profile.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${platformColors[profile.platform]} text-white`}>
                                    {platformIcons[profile.platform]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-white capitalize">{profile.platform}</p>
                                    <p className="text-xs text-zinc-400">{formatNumber(profile.followers)} followers</p>
                                  </div>
                                </div>
                                <button className="text-zinc-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100" onClick={() => deleteProfile(profile.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-3 grid grid-cols-3 gap-2">
                                {(["header", "bio", "post"] as AssetType[]).map((type) => (
                                  <div key={type} className="rounded-lg bg-white/5 p-2 text-center">
                                    <p className="text-xs text-zinc-500 capitalize">{type}</p>
                                    <p className="text-sm font-semibold text-white">{formatCurrency(profile.pricing[type])}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs text-zinc-500 truncate">{profile.niche}</span>
                                <span className="ml-auto text-xs text-emerald-400 font-medium">{profile.engagementRate}% eng.</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* BROWSE CAMPAIGNS TAB */}
                {activeTab === "campaigns" && (
                  <div className="space-y-4">
                    {campaignsLoading ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <SkeletonCard /><SkeletonCard /><SkeletonCard />
                      </div>
                    ) : openCampaigns.length === 0 ? (
                      <EmptyCampaigns />
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {openCampaigns.map((campaign, i) => (
                          <motion.div key={campaign.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-white capitalize">{campaign.assetType} placement</p>
                                {campaign.brandName && <p className="text-xs text-zinc-500">{campaign.brandName}</p>}
                              </div>
                              <StatusChip status={campaign.status} dot />
                            </div>
                            <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{campaign.requirements}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">
                                {campaign.budgetMin && campaign.budgetMax
                                  ? `${formatCurrency(campaign.budgetMin)} – ${formatCurrency(campaign.budgetMax)}`
                                  : "Open budget"}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => setApplyTarget(campaign)}
                                disabled={profiles.length === 0}
                                rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                              >
                                Apply
                              </Button>
                            </div>
                            {profiles.length === 0 && (
                              <p className="mt-2 text-xs text-amber-400">Add a social profile to apply</p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* APPLICATIONS TAB */}
                {activeTab === "applications" && (
                  <div className="space-y-3">
                    {appsLoading ? (
                      <><SkeletonCard /><SkeletonCard /></>
                    ) : applications.length === 0 ? (
                      <EmptyApplications />
                    ) : (
                      applications.map((app, i) => (
                        <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate">
                                {app.campaign?.assetType ? `${app.campaign.assetType} campaign` : `Campaign #${app.campaignId.slice(-6)}`}
                              </p>
                              {app.coverMessage && (
                                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{app.coverMessage}</p>
                              )}
                            </div>
                            <StatusChip status={app.status} dot />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">{formatCurrency(app.proposedPrice)}</span>
                            {app.status === "selected" && (
                              <Button size="sm" variant="secondary" leftIcon={<FileText className="h-3.5 w-3.5" />} onClick={() => setProofTarget(app.id)}>
                                Submit proof
                              </Button>
                            )}
                            {app.createdAt && (
                              <span className="text-xs text-zinc-500">{formatDate(app.createdAt)}</span>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </Tabs>
        </div>

        {/* Modals */}
        <AddProfileModal open={addProfileOpen} onClose={() => setAddProfileOpen(false)} />
        <ApplyModal
          campaign={applyTarget}
          profiles={profiles}
          open={!!applyTarget}
          onClose={() => setApplyTarget(null)}
        />
        {proofTarget && (
          <SubmitProofModal
            applicationId={proofTarget}
            open={!!proofTarget}
            onClose={() => setProofTarget(null)}
          />
        )}
      </DashboardLayout>
    </RoleGuard>
  );
}