"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "brand") {
        router.push("/dashboard/brand");
      } else if (user.role === "influencer") {
        router.push("/dashboard/influencer");
      } else if (user.role === "admin") {
        router.push("/dashboard/admin");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
    </div>
  );
}
