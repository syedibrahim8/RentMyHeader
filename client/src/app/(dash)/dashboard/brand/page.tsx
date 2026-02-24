"use client";

import { Card } from "@/components/kits/card";
import { RoleGate } from "@/components/layout/role-gate";

export default function BrandHome() {
  return <RoleGate allow={["brand"]}><Card>Brand command center</Card></RoleGate>;
}
