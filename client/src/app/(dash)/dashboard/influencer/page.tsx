"use client";

import { RoleGate } from "@/components/layout/role-gate";
import { Card } from "@/components/kits/card";
import { useMyProfiles, useMyApplications, useStripeConnectOnboard } from "@/hooks/api-hooks";
import { Button } from "@/components/kits/button";

export default function InfluencerHome() {
  const profiles = useMyProfiles().data?.profiles ?? [];
  const apps = useMyApplications().data?.applications ?? [];
  const onboard = useStripeConnectOnboard();
  return <RoleGate allow={["influencer"]}><div className="grid gap-4 md:grid-cols-3"><Card>Profiles: {profiles.length}</Card><Card>Applications: {apps.length}</Card><Card><Button onClick={async () => { const res = await onboard.mutateAsync({}); window.open(res.data.url, "_blank"); }}>Stripe Onboard</Button></Card></div></RoleGate>;
}
