"use client";

import { useApplyToCampaign, useMyProfiles, useOpenCampaigns } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";

export default function InfluencerCampaignsPage() {
  const campaigns = useOpenCampaigns().data?.campaigns ?? [];
  const profiles = useMyProfiles().data?.profiles ?? [];
  const apply = useApplyToCampaign();

  return <Card className="space-y-3">
    {campaigns.map((c: { _id: string; title: string; description: string }) => <div key={c._id} className="rounded-xl border border-white/20 p-3"><h3>{c.title}</h3><p className="text-sm text-white/70">{c.description}</p><Button className="mt-2" onClick={() => apply.mutate({ campaignId: c._id, profileId: profiles[0]?._id, proposedPrice: 500, coverMessage: "Luxury fit!" })}>Apply</Button></div>)}
  </Card>;
}
