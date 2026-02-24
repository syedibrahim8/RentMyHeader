"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/kits/field";
import { Input } from "@/components/kits/input";
import { Button } from "@/components/kits/button";
import { Card } from "@/components/kits/card";
import { useCreateCampaign } from "@/hooks/api-hooks";
import { useRouter } from "next/navigation";

const schema = z.object({ title: z.string().min(3), description: z.string().min(10), budget: z.coerce.number().positive() });

export default function NewCampaignPage() {
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const mutation = useCreateCampaign();
  const router = useRouter();

  return <Card className="space-y-3">
    <Field label="Title"><Input {...register("title")} /></Field>
    <Field label="Description"><Input {...register("description")} /></Field>
    <Field label="Budget"><Input type="number" {...register("budget")} /></Field>
    <Button onClick={handleSubmit(async (data) => { const res = await mutation.mutateAsync(data); router.push(`/dashboard/brand/campaigns/${res.data._id ?? ""}`); })}>Create</Button>
  </Card>;
}
