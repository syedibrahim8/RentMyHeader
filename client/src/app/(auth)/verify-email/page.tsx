"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { Card } from "@/components/kits/card";
import { useAuth } from "@/providers/auth-provider";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your email...");
  const token = params.get("token");
  const { refreshMe } = useAuth();

  useEffect(() => {
    if (!token) return;
    api.get(`${endpoints.auth.verifyEmail}?token=${token}`).then(async () => {
      setMessage("Email verified. Redirecting to dashboard...");
      await refreshMe();
      router.replace("/dashboard");
    }).catch(() => setMessage("Verification failed."));
  }, [refreshMe, router, token]);

  return <Card className="w-full text-center">{token ? message : "Missing token."}</Card>;
}
