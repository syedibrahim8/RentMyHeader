import { Suspense } from "react";
import { ForgotPasswordPage } from "@/src/features/auth/pages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPassword() {
  return (
    <Suspense>
      <ForgotPasswordPage />
    </Suspense>
  );
}