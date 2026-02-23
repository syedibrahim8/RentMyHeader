"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { authApi } from "@/src/lib/api";
import { useAuth } from "@/src/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#06060a] px-4 py-20 overflow-hidden">
      {/* Aurora */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">RentMyHeader</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/12 bg-black/50 p-8 backdrop-blur-2xl shadow-2xl">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-zinc-400">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard/influencer"); // auth context knows the role, TopNav will redirect
    } catch {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your account to continue.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-zinc-400 hover:text-white transition-colors">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-zinc-400 hover:text-violet-400 transition-colors">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading} rightIcon={<ArrowRight className="h-4 w-4" />}>
          Sign in
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

const roleOptions = [
  { value: "brand" as const, label: "Brand / Company", description: "Launch campaigns and hire influencers" },
  { value: "influencer" as const, label: "Influencer / Creator", description: "Monetize your social audience" },
];

export function RegisterPage() {
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"brand" | "influencer">(
    (params.get("role") as "brand" | "influencer") ?? "influencer"
  );
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register({ name, email, password, role });
      setDone(true);
      toast.success("Account created! Check your email to verify.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell title="Check your email!" subtitle="We've sent you a verification link.">
        <div className="text-center py-4 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <p className="text-sm text-zinc-400">Verify your email then sign in to get started.</p>
          <Button className="w-full" onClick={() => router.push("/login")}>Go to sign in</Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your account" subtitle="Join RentMyHeader as a brand or creator.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selector */}
        <div className="grid grid-cols-2 gap-2">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={cn(
                "rounded-xl border p-3 text-left transition-all duration-200",
                role === opt.value
                  ? "border-violet-500/60 bg-violet-500/10 text-white"
                  : "border-white/12 bg-white/4 text-zinc-400 hover:border-white/20 hover:text-white"
              )}
            >
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs opacity-70 mt-0.5 leading-snug">{opt.description}</p>
            </button>
          ))}
        </div>

        <Input
          label="Full name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          leftIcon={<UserIcon className="h-4 w-4" />}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />
        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-zinc-400 hover:text-white transition-colors">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
          minLength={8}
        />
        <Button type="submit" className="w-full" size="lg" loading={loading} rightIcon={<ArrowRight className="h-4 w-4" />}>
          Create account
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send a reset link.">
      {sent ? (
        <div className="text-center py-4 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/15 border border-violet-500/30">
            <Mail className="h-6 w-6 text-violet-400" />
          </div>
          <p className="text-sm text-zinc-400">Check <strong className="text-white">{email}</strong> for the reset link.</p>
          <Link href="/login">
            <Button variant="ghost" className="w-full">Back to sign in</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" leftIcon={<Mail className="h-4 w-4" />} required />
          <Button type="submit" className="w-full" size="lg" loading={loading}>Send reset link</Button>
          <Link href="/login" className="block text-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Back to sign in
          </Link>
        </form>
      )}
    </AuthShell>
  );
}

export function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { toast.error("Invalid reset token."); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast.error("Reset link expired or invalid.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Set new password" subtitle="Enter a strong new password for your account.">
      {done ? (
        <div className="text-center py-4 space-y-3">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
          <p className="text-sm text-zinc-400">Redirecting you to sign in…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" leftIcon={<Lock className="h-4 w-4" />} required minLength={8} />
          <Button type="submit" className="w-full" size="lg" loading={loading}>Reset password</Button>
        </form>
      )}
    </AuthShell>
  );
}

export function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function verify() {
    if (!token) { setStatus("error"); return; }
    setStatus("loading");
    try {
      await authApi.verifyEmail(token);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AuthShell title="Email verification" subtitle="Confirm your email to access your account.">
      <div className="text-center space-y-5 py-2">
        {status === "idle" && token && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/15 border border-violet-500/30">
              <Mail className="h-6 w-6 text-violet-400" />
            </div>
            <p className="text-sm text-zinc-400">Click below to verify your email address.</p>
            <Button className="w-full" size="lg" onClick={verify}>Verify email</Button>
          </>
        )}
        {status === "loading" && <p className="text-sm text-zinc-400 animate-pulse">Verifying…</p>}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
            <p className="text-sm text-zinc-300">Email verified! You can now sign in.</p>
            <Link href="/login"><Button className="w-full">Go to sign in</Button></Link>
          </>
        )}
        {(status === "error" || !token) && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 border border-rose-500/30">
              <Mail className="h-6 w-6 text-rose-400" />
            </div>
            <p className="text-sm text-zinc-400">{!token ? "No verification token found in URL." : "Verification failed. Link may have expired."}</p>
            <Link href="/login"><Button variant="secondary" className="w-full">Back to sign in</Button></Link>
          </>
        )}
      </div>
    </AuthShell>
  );
}