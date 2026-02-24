"use client";

import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { SimpleForm } from "@/components/auth-form";
import { useResetPassword } from "@/hooks/api-hooks";

export default function ResetPage() {
  const mutation = useResetPassword();
  const params = useSearchParams();
  return <SimpleForm schema={z.object({ newPassword: z.string().min(6) })} submitText="Reset password" fields={[{ name: "newPassword", label: "New Password", type: "password" }]} onSubmit={async (data) => mutation.mutateAsync({ token: params.get("token"), ...data })} />;
}
