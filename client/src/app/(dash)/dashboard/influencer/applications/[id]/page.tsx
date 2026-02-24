"use client";

import { useMyApplications, useSubmitProof } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { Input } from "@/components/kits/input";
import { Field } from "@/components/kits/field";
import { Badge } from "@/components/kits/badge";
import { useParams, useRouter } from "next/navigation";
import { Megaphone, ExternalLink, Send } from "lucide-react";
import { useState } from "react";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const applicationId = id as string;
  const { data: applications } = useMyApplications();
  const { mutate: submitProof, isPending } = useSubmitProof();
  const [proofUrl, setProofUrl] = useState("");
  const [notes, setNotes] = useState("");

  const application = applications?.find((a: any) => a._id === applicationId);

  if (!application) return <div className="p-20 text-center text-white/40">Loading application details...</div>;

  const handleSubmit = () => {
    submitProof({ applicationId, proofUrl, proofNotes: notes });
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-bold text-white">Application Status</h1>
        <p className="text-white/40 mt-1">Ref: {applicationId}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Megaphone className="text-brand-primary" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{application.campaign?.title || "Campaign Title"}</h2>
                  <Badge variant="info">{application.status}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/40">My Proposal</p>
                <p className="text-2xl font-black text-brand-secondary">${application.proposedPrice}</p>
              </div>
            </div>

            <p className="text-white/60 leading-relaxed border-t border-white/5 pt-6">
              {application.campaign?.description}
            </p>
          </Card>

          {application.status === "active" && (
            <Card title="Submit Work Proof">
              <div className="space-y-6">
                <Field label="Link to Post/Content">
                  <Input
                    placeholder="https://instagram.com/p/..."
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                  />
                </Field>
                <Field label="Additional Notes">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any comments for the brand..."
                    className="w-full min-h-[100px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-brand-primary/50 transition-all"
                  />
                </Field>
                <Button onClick={handleSubmit} className="w-full h-14" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit for Review"} <Send size={18} className="ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {application.status === "proof_submitted" && (
            <Card className="border-brand-secondary/30 bg-brand-secondary/10">
              <div className="flex items-center gap-4 text-brand-secondary">
                <Clock size={24} />
                <div>
                  <h3 className="font-bold">Proof Under Review</h3>
                  <p className="text-sm">The brand is currently reviewing your submission. Funds will be released upon approval.</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Actions">
            <Button variant="outline" className="w-full justify-between group">
              View Campaign <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
