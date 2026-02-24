"use client";

import { SimpleForm } from "@/components/auth-form";
import { useLogin } from "@/hooks/api-hooks";
import { useToast } from "@/components/kits/toast";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export default function LoginPage() {
  const login = useLogin();
  const { refreshMe } = useAuth();
  const router = useRouter();
  const { push } = useToast();

  return <SimpleForm schema={schema} submitText="Login" fields={[{ name: "email", label: "Email" }, { name: "password", label: "Password", type: "password" }]} onSubmit={async (data) => {
    await login.mutateAsync(data);
    await refreshMe();
    push("Welcome back");
    router.push("/dashboard");
  }} />;
}
