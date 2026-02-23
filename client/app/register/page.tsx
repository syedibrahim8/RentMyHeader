import { Suspense } from "react";
import { RegisterPage } from "@/src/features/auth/pages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create account" };

export default function Register() {
  return (
    <Suspense>
      <RegisterPage />
    </Suspense>
  );
}