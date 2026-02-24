"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@/hooks/api-hooks";
import { Button } from "@/components/kits/button";
import { Input } from "@/components/kits/input";
import { Field } from "@/components/kits/field";
import { Card } from "@/components/kits/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, User, Briefcase, Check } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["brand", "influencer"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();
  const [selectedRole, setSelectedRole] = useState<"brand" | "influencer">("influencer");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "influencer" }
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data);
  };

  const handleRoleSelect = (role: "brand" | "influencer") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary mb-6 shadow-lg shadow-brand-primary/20">
            <Sparkles className="text-white" size={24} />
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white">Join the Elite</h1>
          <p className="mt-2 text-white/40">Start your journey as a world-class creator or elite brand.</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleSelect("influencer")}
                className={clsx(
                  "relative flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all duration-300",
                  selectedRole === "influencer"
                    ? "border-brand-primary bg-brand-primary/10 shadow-[0_0_20px_rgba(95,46,234,0.1)]"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                {selectedRole === "influencer" && (
                  <div className="absolute top-3 right-3 rounded-full bg-brand-primary p-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <User size={32} className={selectedRole === "influencer" ? "text-brand-primary" : "text-white/40"} />
                <div className="text-center">
                  <p className="font-bold text-white">Influencer</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Creator</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("brand")}
                className={clsx(
                  "relative flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all duration-300",
                  selectedRole === "brand"
                    ? "border-brand-secondary bg-brand-secondary/10 shadow-[0_0_20px_rgba(33,212,253,0.1)]"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                {selectedRole === "brand" && (
                  <div className="absolute top-3 right-3 rounded-full bg-brand-secondary p-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <Briefcase size={32} className={selectedRole === "brand" ? "text-brand-secondary" : "text-white/40"} />
                <div className="text-center">
                  <p className="font-bold text-white">Brand</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Company</p>
                </div>
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Full Name" error={errors.name?.message}>
                <Input {...register("name")} placeholder="John Doe" />
              </Field>

              <Field label="Email Address" error={errors.email?.message}>
                <Input {...register("email")} placeholder="name@example.com" type="email" />
              </Field>
            </div>

            <Field label="Choose a Password" error={errors.password?.message}>
              <Input {...register("password")} placeholder="••••••••" type="password" />
            </Field>

            <Button type="submit" className="w-full h-12" disabled={isPending}>
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-white/40">Already have an account? </span>
            <Link href="/login" className="font-bold text-white hover:text-brand-primary transition-colors">
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
