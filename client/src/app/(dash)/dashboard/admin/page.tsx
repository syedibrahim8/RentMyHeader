"use client";

import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { useRunAutomation } from "@/hooks/api-hooks";
import { ShieldAlert, Zap, Server } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { mutate: run, isPending } = useRunAutomation();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="text-brand-accent" /> Admin Console
        </h1>
        <p className="text-white/40 mt-2">Manage system-level automations and audits.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card title="System Automations">
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-6 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-brand-accent/20 flex items-center justify-center border border-brand-accent/30">
                  <Zap className="text-brand-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Application Auto-Runner</h3>
                  <p className="text-xs text-white/40">Triggers pending state transitions</p>
                </div>
              </div>
              <Button
                onClick={() => run()}
                disabled={isPending}
                className="bg-brand-accent hover:bg-brand-accent/80 shadow-brand-accent/20"
              >
                {isPending ? "Running..." : "Run Now"}
              </Button>
            </div>

            <p className="text-xs text-white/30 px-2 italic">
              Note: This action is irreversible and affects live production data. Use with caution.
            </p>
          </div>
        </Card>

        <Card title="System Health">
          <div className="space-y-4">
            {[
              { label: "API Server", status: "Healthy", color: "text-emerald-400" },
              { label: "Database", status: "Connected", color: "text-emerald-400" },
              { label: "Storage", status: "Healthy", color: "text-emerald-400" },
              { label: "Auth Provider", status: "Online", color: "text-emerald-400" },
            ].map((svc, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-white/20" />
                  <span className="text-sm text-white/60">{svc.label}</span>
                </div>
                <span className={`text-sm font-bold ${svc.color}`}>{svc.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
