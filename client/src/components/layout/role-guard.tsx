"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/src/hooks/use-auth";
import type { Role } from "@/src/lib/types";
import { Skeleton } from "@/src/components/ui/skeleton";

interface RoleGuardProps {
  allowed: Array<Role | "guest">;
  redirectTo?: string;
  children: ReactNode;
}

export function RoleGuard({ allowed, redirectTo = "/login", children }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const effectiveRole: Role | "guest" = user?.role ?? "guest";
    if (!allowed.includes(effectiveRole)) {
      router.replace(redirectTo);
    }
  }, [user, loading, allowed, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070c]">
        <div className="space-y-3 w-64">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  const effectiveRole: Role | "guest" = user?.role ?? "guest";
  if (!allowed.includes(effectiveRole)) return null;

  return <>{children}</>;
}