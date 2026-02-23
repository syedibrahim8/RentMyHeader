"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Shield,
  BarChart3,
  Globe,
  Star,
  Twitter,
  Linkedin,
  Facebook,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Lock,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { TopNav } from "@/src/components/layout/top-nav";

// Animated counter hook
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCounter(value, 1800, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-white md:text-5xl">
        {count.toLocaleString()}
        <span className="text-violet-400">{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{label}</p>
    </div>
  );
}

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    icon: Shield,
    title: "Escrow-Protected Payments",
    description: "Funds held securely in escrow until proof is approved. Zero risk for brands, guaranteed payment for influencers.",
    color: "from-violet-600 to-indigo-600",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics & Insights",
    description: "Track campaign performance, engagement rates, and ROI all from a single clean dashboard.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Globe,
    title: "Multi-Platform Support",
    description: "LinkedIn, Twitter/X, Facebook — rent header images, bio links, and posts across all major platforms.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Sparkles,
    title: "Smart Matching",
    description: "Campaign requirements and influencer niches are matched intelligently to surface the best fit.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Lock,
    title: "Verified Delivery",
    description: "Influencers submit proof with screenshots or links. Brands review and approve before funds release.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: TrendingUp,
    title: "Lifecycle Automation",
    description: "From open campaign to completed payout — every step is tracked, automated, and transparent.",
    color: "from-fuchsia-500 to-violet-600",
  },
];

const testimonials = [
  {
    avatar: "A",
    name: "Alex Rivera",
    role: "Brand Manager @ FinStack",
    quote: "RentMyHeader gave us access to 50k+ relevant followers in under 48 hours. The escrow model gave us complete confidence.",
    rating: 5,
  },
  {
    avatar: "S",
    name: "Sarah Chen",
    role: "Tech Influencer, 200K followers",
    quote: "Finally a platform that protects creators. I set my price, brands come to me, and payment is guaranteed via Stripe.",
    rating: 5,
  },
  {
    avatar: "M",
    name: "Marcus Johnson",
    role: "Founder @ NeuralStack",
    quote: "We ran 3 campaigns in a month and got an average 8x ROAS. The proof verification workflow is chef's kiss.",
    rating: 5,
  },
];

const steps = [
  { step: "01", title: "Create a Campaign", description: "Brands define asset type, timing, requirements, and budget range.", icon: Megaphone },
  { step: "02", title: "Influencers Apply", description: "Creators with matching audiences submit proposals and pricing.", icon: Users },
  { step: "03", title: "Fund via Escrow", description: "Select the best fit and fund securely through Stripe escrow.", icon: DollarSign },
  { step: "04", title: "Review & Release", description: "Approve the delivery proof to release payment. Simple and safe.", icon: CheckCircle2 },
];

import { Megaphone } from "lucide-react";

export function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#06060a] text-white overflow-x-hidden">
      <TopNav />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Aurora background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-violet-600/15 blur-[120px]" />
          <div className="absolute top-1/3 -left-40 h-[400px] w-[600px] rounded-full bg-indigo-600/10 blur-[100px]" />
          <div className="absolute top-1/4 -right-40 h-[400px] w-[600px] rounded-full bg-fuchsia-600/10 blur-[100px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-5xl px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            The premium influencer header marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Rent influencer
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              digital assets
            </span>
            <br />
            <span className="text-zinc-300">at scale.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed"
          >
            Brands fund escrow-protected campaigns. Influencers set their price and deliver.
            Headers, bios, posts — on LinkedIn, Twitter, and Facebook.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link href="/register">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto px-8">
                Start for free
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                Browse campaigns
              </Button>
            </Link>
          </motion.div>

          {/* Hero social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-4 text-sm text-zinc-500"
          >
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((l, i) => (
                <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full border border-black/30 bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white">
                  {l}
                </div>
              ))}
            </div>
            <span><strong className="text-white">800+</strong> influencers already earning</span>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative border-y border-white/8 bg-white/2 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            <AnimatedStat value={1200} suffix="+" label="Active campaigns" />
            <AnimatedStat value={800} suffix="+" label="Creator profiles" />
            <AnimatedStat value={98} suffix="%" label="On-time delivery rate" />
            <AnimatedStat value={2400000} suffix="+" label="Audience reached" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 mb-4">
              <Zap className="h-3.5 w-3.5 text-violet-400" />
              Platform capabilities
            </div>
            <h2 className="text-4xl font-bold md:text-5xl">Everything you need to run<br /><span className="text-zinc-400">premium influencer campaigns</span></h2>
          </FadeUp>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <FadeUp key={feature.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/4 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/7 hover:-translate-y-1">
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 bg-white/2 border-y border-white/8">
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 mb-4">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Simple process
            </div>
            <h2 className="text-4xl font-bold md:text-5xl">Launch a campaign in<br /><span className="text-zinc-400">4 simple steps</span></h2>
          </FadeUp>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent hidden md:block md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <FadeUp key={step.step} delay={i * 0.1}>
                  <div className={`flex flex-col gap-5 md:flex-row md:items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    <div className={`flex-1 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                      <div className={`inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400 mb-3`}>
                        Step {step.step}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-zinc-400 leading-relaxed">{step.description}</p>
                    </div>
                    <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-lg">
                      <step.icon className="h-6 w-6 text-violet-400" />
                    </div>
                    <div className="flex-1" />
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeUp className="text-center mb-16">
            <h2 className="text-4xl font-bold md:text-5xl">Loved by brands<br /><span className="text-zinc-400">and creators alike</span></h2>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.name}</p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeUp>
            <div className="relative inline-block w-full">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-indigo-600/30 blur-3xl" />
              <div className="relative rounded-3xl border border-white/15 bg-white/5 p-14 backdrop-blur-sm">
                <h2 className="text-4xl font-bold text-white md:text-5xl">
                  Ready to go?
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Start earning or grow.
                  </span>
                </h2>
                <p className="mx-auto mt-4 max-w-md text-zinc-400">
                  Join thousands of brands and creators building lucrative partnerships on RentMyHeader.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link href="/register?role=influencer">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                      Join as Influencer
                    </Button>
                  </Link>
                  <Link href="/register?role=brand">
                    <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto px-8">
                      Launch a Campaign
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">RentMyHeader</span>
            </div>
            <p className="text-xs text-zinc-500">© 2026 RentMyHeader. All rights reserved.</p>
            <div className="flex gap-3">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}