"use client";

import { useCreateProfile, useDeleteProfile, useMyProfiles } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { Input } from "@/components/kits/input";
import { useState } from "react";

export default function ProfilesPage() {
  const { data } = useMyProfiles();
  const create = useCreateProfile();
  const remove = useDeleteProfile();
  const [platform, setPlatform] = useState("instagram");
  const [handle, setHandle] = useState("");
  const profiles = data?.profiles ?? [];

  return <Card className="space-y-3">
    <div className="flex gap-2"><Input value={platform} onChange={(e) => setPlatform(e.target.value)} /><Input value={handle} onChange={(e) => setHandle(e.target.value)} /><Button onClick={() => create.mutate({ platform, handle, followers: 0 })}>Add</Button></div>
    {profiles.map((p: { _id: string; platform: string; handle: string }) => <div key={p._id} className="flex justify-between rounded-xl border border-white/20 p-2"><span>{p.platform} · {p.handle}</span><Button className="bg-white/10" onClick={() => remove.mutate(p._id)}>Delete</Button></div>)}
  </Card>;
}
