"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@/hooks/api-hooks";
import { Button } from "@/components/kits/button";
import { Input } from "@/components/kits/input";
import { useParams } from "next/navigation";
import { User, DollarSign, Clock, CheckCircle2, AlertCircle, Megaphone } from "lucide-react";
import { Field } from "@/components/kits/field";
import { Card } from "@/components/kits/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary mb-6 shadow-lg shadow-brand-primary/20">
            <Sparkles className="text-white" size={24} />
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="mt-2 text-white/40">Enter your credentials to access your dashboard.</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Field label="Email Address" error={errors.email?.message}>
              <Input
                {...register("email")}
                placeholder="name@example.com"
                type="email"
                autoComplete="email"
              />
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <Input
                {...register("password")}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </Field>

            <div className="flex items-center justify-between px-1">
              <Link href="/forgot-password" className="text-xs font-medium text-brand-secondary hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
              {!isPending && <ArrowRight size={18} className="ml-2" />}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-white/40">Don't have an account? </span>
            <Link href="/register" className="font-bold text-white hover:text-brand-primary transition-colors">
              Create one for free
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
