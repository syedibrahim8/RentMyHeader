"use client";

import { FormEvent, useState } from "react";

export function AuthCard({
  title,
  subtitle,
  fields,
  cta,
  onSubmit,
}: {
  title: string;
  subtitle: string;
  fields: Array<{ name: string; label: string; type?: string }>;
  cta: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;
    setLoading(true);
    setMessage("");
    try {
      await onSubmit(values);
      setMessage("Success. Please continue.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-black/40 p-6 text-white backdrop-blur-2xl">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-zinc-300">{subtitle}</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {fields.map((field) => (
          <label key={field.name} className="block text-sm">
            <span className="mb-1 block text-zinc-300">{field.label}</span>
            <input
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 outline-none ring-violet-400 focus:ring"
              name={field.name}
              type={field.type ?? "text"}
              required
            />
          </label>
        ))}
        <button disabled={loading} className="w-full rounded-xl bg-white px-4 py-2 font-medium text-black disabled:opacity-60">
          {loading ? "Please wait..." : cta}
        </button>
        {message && <p className="text-sm text-zinc-200">{message}</p>}
      </form>
    </div>
  );
}