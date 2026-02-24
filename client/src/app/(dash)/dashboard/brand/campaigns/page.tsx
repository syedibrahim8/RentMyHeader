"use client";

import Link from "next/link";
import { useBrandCampaigns } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { RoleGate } from "@/components/layout/role-gate";
import { EmptyState } from "@/components/states/empty";
import { Badge } from "@/components/kits/badge";

export default function BrandCampaignsPage() {
  const { data } = useBrandCampaigns();
  const list = data?.campaigns ?? [];

  return <RoleGate allow={["brand"]}>
    <Card className="space-y-3">
      <Link href="/dashboard/brand/campaigns/new" className="text-cyan-300">+ New Campaign</Link>
      {!list.length ? <EmptyState title="No campaigns yet" /> : list.map((item: { _id: string; title?: string; status: string }) => <Link key={item._id} href={`/dashboard/brand/campaigns/${item._id}`} className="flex items-center justify-between rounded-xl border border-white/20 p-3"><span>{item.title}</span><Badge label={item.status} /></Link>)}
    </Card>
  </RoleGate>;
}
