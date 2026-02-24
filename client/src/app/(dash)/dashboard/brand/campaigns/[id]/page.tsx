"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { useBrandCampaigns, useCampaignApplicationsForBrand, useSelectInfluencer, usePayForCampaign, useReviewProof } from "@/hooks/api-hooks";
import { Badge } from "@/components/kits/badge";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const { data } = useBrandCampaigns();
  const campaign = data?.campaigns?.find((c: { _id: string; title: string; description: string }) => c._id === params.id);
  const apps = useCampaignApplicationsForBrand(params.id).data?.applications ?? [];
  const select = useSelectInfluencer();
  const pay = usePayForCampaign();
  const review = useReviewProof();

  if (!campaign) return <Card>Campaign not found.</Card>;
  return <Card className="space-y-4">
    <h1 className="text-2xl font-bold">{campaign.title}</h1>
    <Badge label={campaign.status} />
    <p>{campaign.description}</p>
    <div className="flex flex-wrap gap-2 text-xs text-white/70"><span>Open</span><span>→</span><span>Selected</span><span>→</span><span>Funded</span><span>→</span><span>Active</span><span>→</span><span>Proof Submitted</span><span>→</span><span>Approved</span></div>
    {apps.map((app: { _id: string; coverMessage?: string }) => <div key={app._id} className="rounded-xl border border-white/20 p-3"><p>{app.coverMessage}</p><div className="mt-2 flex gap-2"><Button onClick={() => select.mutate({ campaignId: params.id, applicationId: app._id })}>Select</Button><Button className="bg-white/10" onClick={() => review.mutate({ applicationId: app._id, action: "approve" })}>Approve Proof</Button><Button className="bg-white/10" onClick={() => review.mutate({ applicationId: app._id, action: "reject", reason: "Need better proof" })}>Reject Proof</Button></div></div>)}
    <Button onClick={() => pay.mutate(params.id)}>Pay / Fund Campaign</Button>
  </Card>;
}
