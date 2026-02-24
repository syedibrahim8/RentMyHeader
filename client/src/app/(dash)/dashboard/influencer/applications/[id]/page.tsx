"use client";

import { useParams } from "next/navigation";
import { useMyApplications, useSubmitProof } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Input } from "@/components/kits/input";
import { Button } from "@/components/kits/button";
import { useState } from "react";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const app = useMyApplications().data?.applications?.find((item: { _id: string; title?: string; status: string }) => item._id === params.id);
  const submit = useSubmitProof();
  const [proofUrl, setProofUrl] = useState("");
  const [proofNotes, setProofNotes] = useState("");

  if (!app) return <Card>Application not found.</Card>;
  return <Card className="space-y-3"><h2 className="text-xl">{app.status}</h2><Input placeholder="Proof URL" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} /><Input placeholder="Proof Notes" value={proofNotes} onChange={(e) => setProofNotes(e.target.value)} /><Button onClick={() => submit.mutate({ applicationId: params.id, proofUrl, proofNotes })}>Submit Proof</Button></Card>;
}
