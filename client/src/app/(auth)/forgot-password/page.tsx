"use client";

import { z } from "zod";
import { SimpleForm } from "@/components/auth-form";
import { useForgotPassword } from "@/hooks/api-hooks";

export default function ForgotPage() {
  const mutation = useForgotPassword();
  return <SimpleForm schema={z.object({ email: z.string().email() })} submitText="Send reset link" fields={[{ name: "email", label: "Email" }]} onSubmit={async (data) => mutation.mutateAsync(data)} />;
}
