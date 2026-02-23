import { Suspense } from "react";
import { LoginPage } from "@/src/features/auth/pages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function Login() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}