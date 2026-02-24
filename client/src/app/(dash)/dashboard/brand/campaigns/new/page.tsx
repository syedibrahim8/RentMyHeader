"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCampaign } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { Input } from "@/components/kits/input";
import { Field } from "@/components/kits/field";
import { Megaphone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const campaignSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  budget: z.coerce.number().min(10),
  category: z.string().min(2, "Category is required"),
  requirements: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function NewCampaignPage() {
  const { mutate: create, isPending } = useCreateCampaign();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = (data: CampaignFormValues) => {
    create(
      {
        title: data.title,
        description: data.description,
        budget: data.budget,
        category: data.category,
        requirements: data.requirements,
      } as any,
      {
        onSuccess: () => router.push("/dashboard/brand/campaigns"),
        onError: (err: any) => {
          console.log("CREATE CAMPAIGN ERROR:", err?.response?.data);
        },
      },
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          href="/dashboard/brand"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-white/60" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white">Launch Campaign</h1>
          <p className="text-white/40">
            Define your requirements and find top talent.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Field label="Campaign Title" error={errors.title?.message}>
              <Input
                {...register("title")}
                placeholder="e.g. Summer Collection Launch"
              />
            </Field>

            <Field
              label="Detailed Description"
              error={errors.description?.message}
            >
              <textarea
                {...register("description")}
                className="w-full min-h-[160px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-brand-primary/50 transition-all font-sans"
                placeholder="What is this campaign about? What are the goals?"
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Budget (USD)" error={errors.budget?.message}>
                <Input
                  {...register("budget")}
                  type="number"
                  placeholder="500"
                />
              </Field>
              <Field label="Category" error={errors.category?.message}>
                <Input
                  {...register("category")}
                  placeholder="e.g. Fashion, Lifestyle"
                />
              </Field>
            </div>

            <Field label="Specific Requirements (Optional)">
              <textarea
                {...register("requirements")}
                className="w-full min-h-[100px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-brand-primary/50 transition-all font-sans"
                placeholder="Micro-influencers only, must have 10k+ followers..."
              />
            </Field>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 text-lg"
                disabled={isPending}
              >
                {isPending ? "Launching..." : "Launch Campaign"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
