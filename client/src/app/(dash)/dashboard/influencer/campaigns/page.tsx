"use client";

import { useOpenCampaigns, useApplyToCampaign, useMyProfiles } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { Badge } from "@/components/kits/badge";
import { Megaphone, DollarSign, Calendar, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "@/components/kits/modal";
import { Field } from "@/components/kits/field";
import { Input } from "@/components/kits/input";
import { useToast } from "@/providers/toast-provider";

export default function BrowseCampaignsPage() {
  const { data: campaigns, isLoading } = useOpenCampaigns();
  const { data: profiles, isLoading: profilesLoading } = useMyProfiles();
  const { mutate: apply, isPending } = useApplyToCampaign();
  const { push } = useToast();

  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [profileId, setProfileId] = useState<string>("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const profileOptions = useMemo(() => {
    const list = Array.isArray(profiles) ? profiles : [];
    return list.map((p: any) => ({
      id: p._id as string,
      label: `${String(p.platform ?? "platform").toUpperCase()} • @${p.handle ?? "handle"}`,
    }));
  }, [profiles]);

  const closeModal = () => {
    setSelectedCampaign(null);
    setProfileId("");
    setPrice("");
    setMessage("");
  };

  const handleApply = () => {
    if (!selectedCampaign) return;

    if (!profileId) {
      push("Select a social profile first", "error");
      return;
    }

    const amount = Number(price);
    if (!Number.isFinite(amount) || amount <= 0) {
      push("Enter a valid proposed price", "error");
      return;
    }

    apply(
      {
        campaignId: selectedCampaign._id,
        profileId,
        proposedPrice: amount,
        coverMessage: message,
      },
      {
        onSuccess: () => {
          push("Application submitted!", "success");
          closeModal();
        },
        onError: (err: any) => {
          push(err?.response?.data?.message ?? "Application failed", "error");
        },
      }
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-bold text-white">Open Campaigns</h1>
        <p className="text-white/40 mt-2">
          Discover premium opportunities and collaborate with top brands.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : !campaigns || campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Megaphone size={64} className="text-white/10 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">No campaigns available</h2>
          <p className="text-white/40 max-w-sm">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {campaigns.map((campaign: any) => (
            <Card key={campaign._id} className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Megaphone className="text-brand-primary" size={28} />
                </div>
                <Badge variant="info">{campaign.category || "General"}</Badge>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{campaign.title}</h3>
              <p className="text-white/40 line-clamp-2 mb-8 flex-1">{campaign.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/10">
                  <DollarSign size={18} className="text-brand-secondary" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Budget</p>
                    <p className="font-bold text-white">${campaign.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/10">
                  <Calendar size={18} className="text-brand-accent" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Deadline</p>
                    <p className="font-bold text-white">—</p>
                  </div>
                </div>
              </div>

              <Button onClick={() => setSelectedCampaign(campaign)} className="w-full">
                Apply Now <ArrowRight size={18} className="ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!selectedCampaign}
        onClose={closeModal}
        title={`Apply to ${selectedCampaign?.title ?? ""}`}
      >
        <div className="space-y-6">
          <Field label="Choose profile" error={!profileId && !profilesLoading ? "Select one profile" : undefined}>
            <select
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all"
              disabled={profilesLoading}
            >
              <option value="" disabled>
                {profilesLoading ? "Loading profiles..." : "Select a profile"}
              </option>
              {profileOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            {!profilesLoading && profileOptions.length === 0 && (
              <p className="text-xs text-white/40 mt-2">
                No profiles found. Add one in <span className="text-white/70">Social Profiles</span>.
              </p>
            )}
          </Field>

          <Field label="Proposed Price ($)">
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 500"
            />
          </Field>

          <Field label="Cover Message">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the brand why you're a great fit..."
              className="w-full min-h-[120px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-brand-primary/50 transition-all"
            />
          </Field>

          <Button
            onClick={handleApply}
            className="w-full h-12"
            disabled={isPending || !selectedCampaign || !profileId || profileOptions.length === 0}
          >
            {isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
