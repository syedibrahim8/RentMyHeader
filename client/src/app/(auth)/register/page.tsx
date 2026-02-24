"use client";

import { z } from "zod";
import { useRegister } from "@/hooks/api-hooks";
import { useToast } from "@/components/kits/toast";
import { Card } from "@/components/kits/card";
import { Field } from "@/components/kits/field";
import { Input } from "@/components/kits/input";
import { Button } from "@/components/kits/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["brand", "influencer"]) });

export default function RegisterPage() {
  const registerMutation = useRegister();
  const { push } = useToast();
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { role: "brand" } });

  return <Card className="w-full space-y-4">
    <Field label="Name"><Input {...register("name")} /></Field>
    <Field label="Email"><Input {...register("email")} /></Field>
    <Field label="Password"><Input type="password" {...register("password")} /></Field>
    <Field label="Role"><select className="w-full rounded-xl border border-white/20 bg-black/30 p-2" {...register("role")}><option value="brand">Brand</option><option value="influencer">Influencer</option></select></Field>
    <Button className="w-full" onClick={handleSubmit(async (data) => {
      await registerMutation.mutateAsync(data);
      push("Registered. Check your email for verification.");
      router.push("/verify-email");
    })}>Create Account</Button>
  </Card>;
}
