import { InfluencerDashboardPage } from "@/src/features/dashboard/influencer-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Influencer Dashboard" };

export default function InfluencerDashboard() {
  return <InfluencerDashboardPage />;
}