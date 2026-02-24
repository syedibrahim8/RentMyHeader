"use client";

import Link from "next/link";
import { useMyApplications } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Badge } from "@/components/kits/badge";

export default function ApplicationsPage() {
  const apps = useMyApplications().data?.applications ?? [];
  return <Card className="space-y-2">{apps.map((a: { _id: string; campaign?: { title?: string }; campaignId: string; status: string }) => <Link key={a._id} href={`/dashboard/influencer/applications/${a._id}`} className="flex items-center justify-between rounded-xl border border-white/20 p-3"><span>{a.campaign?.title ?? a.campaignId}</span><Badge label={a.status} /></Link>)}</Card>;
}
