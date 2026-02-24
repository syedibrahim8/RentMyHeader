"use client";

import { useAuth } from "@/providers/auth-provider";
import { Role } from "@/types";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export const RoleGate = ({ allow, children }: PropsWithChildren<{ allow: Role[] }>) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!loading && user && !allow.includes(user.role)) router.replace("/dashboard");
  }, [allow, loading, router, user]);

  if (loading || !user || !allow.includes(user.role)) return <div className="p-6">Loading...</div>;
  return <>{children}</>;
};
