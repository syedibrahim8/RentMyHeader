"use client";

import { Button } from "@/components/kits/button";
import { Card } from "@/components/kits/card";
import { RoleGate } from "@/components/layout/role-gate";
import { useRunAutomation } from "@/hooks/api-hooks";

export default function AdminPage() {
  const run = useRunAutomation();
  return <RoleGate allow={["admin"]}><Card><Button onClick={() => run.mutate({})}>Run Automation</Button></Card></RoleGate>;
}
