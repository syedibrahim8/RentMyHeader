"use client";

import { useCampaignApplications, useSelectInfluencer, usePayForCampaign, useReviewProof } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { Badge } from "@/components/kits/badge";
import { useParams } from "next/navigation";
import { User, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function BrandCampaignDetail() {
  const { id } = useParams();
  const campaignId = id as string;
  const { data: applications, isLoading } = useCampaignApplications(campaignId);
  const { mutate: selectInfluencer } = useSelectInfluencer();
  const { mutate: pay } = usePayForCampaign();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Campaign Details</h1>
          <p className="text-white/40 mt-1">ID: {campaignId}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Influencer Applications">
            {isLoading ? (
              <div className="space-y-4 py-8 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-white/5" />)}
              </div>
            ) : !applications || applications.length === 0 ? (
              <div className="py-20 text-center grayscale opacity-50">
                <User size={48} className="mx-auto mb-4" />
                <p>No applications received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div key={app._id} className="glass-card flex flex-col gap-4 rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                          <User size={20} className="text-brand-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{app.influencer?.name || "Premium Creator"}</p>
                          <p className="text-xs text-white/40">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-brand-secondary">${app.proposedPrice}</p>
                        <Badge variant={app.status === "pending" ? "warning" : "success"}>{app.status}</Badge>
                      </div>
                    </div>

                    <p className="text-sm text-white/60 bg-white/5 p-4 rounded-xl border border-white/5 italic">
                      "{app.coverMessage || "No cover message provided."}"
                    </p>

                    {app.status === "applied" && (
                      <div className="flex justify-end pt-2">
                        <Button onClick={() => selectInfluencer({ campaignId, applicationId: app._id })}>
                          Select Influencer
                        </Button>
                      </div>
                    )}

                    {app.status === "influencer_selected" && (
                      <div className="flex justify-end pt-2">
                        <Button onClick={() => pay(campaignId)}>
                          Pay & Secure Funds
                        </Button>
                      </div>
                    )}

                    {app.status === "proof_submitted" && (
                      <div className="space-y-4 border-t border-white/10 pt-4 mt-2">
                        <p className="text-sm font-bold text-white">Work Proof Submitted:</p>
                        <a href={app.proofUrl} target="_blank" className="text-brand-secondary text-sm flex items-center gap-2 hover:underline">
                          View Work <AlertCircle size={14} />
                        </a>
                        <div className="flex gap-2">
                          <Button className="flex-1" variant="outline">Approve</Button>
                          <Button className="flex-1" variant="danger">Dispute</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Campaign Timeline">
            <div className="relative space-y-8 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-white/10">
              {[
                { label: "Open", icon: <Megaphone size={14} />, status: "completed" },
                { label: "Influencer Selected", icon: <User size={14} />, status: "active" },
                { label: "Funded", icon: <DollarSign size={14} />, status: "pending" },
                { label: "Proof Submitted", icon: <Clock size={14} />, status: "pending" },
                { label: "Completed", icon: <CheckCircle2 size={14} />, status: "pending" },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${step.status === "completed" ? "border-brand-primary bg-brand-primary/20 text-brand-primary" :
                      step.status === "active" ? "border-brand-secondary bg-brand-secondary/20 text-brand-secondary" :
                        "border-white/10 bg-white/5 text-white/20"
                    } z-10 animate-pulse-slow`}>
                    {step.icon}
                  </div>
                  <p className={`font-bold ${step.status === "pending" ? "text-white/20" : "text-white"}`}>{step.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
