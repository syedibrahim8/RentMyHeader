import { Suspense } from "react";
import { VerifyEmailPage } from "@/src/features/auth/pages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmail() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}