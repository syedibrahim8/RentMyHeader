"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/kits/button";
import { Card } from "@/components/kits/card";
import { Sparkles, ArrowRight, Zap, Target, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-brand-primary/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-brand-accent/5 blur-[120px]" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-md"
          >
            <Sparkles size={14} className="text-brand-secondary" />
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent font-medium">
              The Future of Influence is Here
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl"
          >
            Where elite <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">brands</span> meet world-class <span className="bg-gradient-to-r from-brand-accent to-brand-secondary bg-clip-text text-transparent">creators.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 max-w-2xl text-lg text-white/50 md:text-xl"
          >
            RentMyHeader is the world's most premium marketplace for campaign collaborations. Glassmorphism workflows, verified creators, and revenue-safe payouts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link href="/register">
              <Button className="h-14 px-10 text-lg">
                Get started <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard/influencer/campaigns">
              <Button variant="outline" className="h-14 px-10 text-lg">
                Browse campaigns
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: <Target className="text-brand-primary" />, title: "Precision Matching", desc: "Our AI helps brands find the perfect influencer match based on niche and audience metrics." },
            { icon: <ShieldCheck className="text-brand-secondary" />, title: "Escrow Payouts", desc: "Funds are held in secure escrow and released only when work is approved by the brand." },
            { icon: <Zap className="text-brand-accent" />, title: "Instant Verification", desc: "Real-time verification of social profiles ensures transparency and trust in every deal." }
          ].map((feature, i) => (
            <Card key={i} className="group">
              <div className="mb-4 inline-flex rounded-xl bg-white/5 p-3 group-hover:bg-brand-primary/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="container mx-auto px-6 py-32">
        <div className="glass-card flex flex-col items-center gap-8 rounded-3xl p-12 text-center md:p-20">
          <h2 className="text-4xl font-bold md:text-5xl">Ready to launch your next campaign?</h2>
          <p className="text-white/60">Join thousands of brands and influencers building the future today.</p>
          <Link href="/register">
            <Button className="h-14 px-12 text-lg">Join the Elite</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
