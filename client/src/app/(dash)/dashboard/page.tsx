"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(user.role === "brand" ? "/dashboard/brand" : user.role === "influencer" ? "/dashboard/influencer" : "/dashboard/admin");
  }, [loading, router, user]);

  return <div className="p-6">Redirecting...</div>;
}
