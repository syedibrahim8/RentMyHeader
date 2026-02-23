import { Suspense } from "react";
import { ResetPasswordPage } from "@/src/features/auth/pages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}