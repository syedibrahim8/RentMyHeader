import { DiscoveryPage } from "@/src/features/campaigns/discovery-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Discover campaigns" };

export default function Campaigns() {
  return <DiscoveryPage />;
}