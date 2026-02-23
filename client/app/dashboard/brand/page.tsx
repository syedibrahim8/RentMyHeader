import { BrandDashboardPage } from "@/src/features/dashboard/brand-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Brand Dashboard" };

export default function BrandDashboard() {
  return <BrandDashboardPage />;
}