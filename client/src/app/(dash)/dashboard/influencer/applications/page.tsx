"use client";

import { useMyApplications } from "@/hooks/api-hooks";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { Badge } from "@/components/kits/badge";
import { Megaphone, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MyApplicationsPage() {
  const { data: applications, isLoading } = useMyApplications();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-bold text-white">My Applications</h1>
        <p className="text-white/40 mt-1">Track the status of your campaign submissions.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />)}
        </div>
      ) : !applications || applications.length === 0 ? (
        <div className="py-32 text-center opacity-50 grayscale">
          <Clock size={48} className="mx-auto mb-4" />
          <p>No applications found.</p>
          <Link href="/dashboard/influencer/campaigns">
            <Button variant="outline" className="mt-6">Browse Campaigns</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app: any, i: number) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/influencer/applications/${app._id}`}>
                <Card className="flex items-center justify-between hover:bg-white/10 transition-colors border-white/5">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/20">
                      <Megaphone className="text-brand-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{app.campaign?.title || "Campaign"}</h4>
                      <p className="text-sm text-white/40">Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] uppercase tracking-widest text-white/20">Proposed</p>
                      <p className="font-black text-brand-secondary">${app.proposedPrice}</p>
                    </div>
                    <Badge variant={
                      app.status === "applied" ? "info" :
                        app.status === "active" ? "success" :
                          app.status === "rejected" ? "error" : "warning"
                    }>
                      {app.status}
                    </Badge>
                    <ArrowRight size={20} className="text-white/10" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
