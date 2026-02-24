import Link from "next/link";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="mb-3 text-cyan-300">Luxury Campaign Marketplace</p>
          <h1 className="text-5xl font-black leading-tight">Where elite brands meet world-class influencers.</h1>
          <p className="mt-4 text-white/75">Glassmorphism workflows, verified creators, and revenue-safe payouts.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/register"><Button>Get started</Button></Link>
            <Link href="/dashboard/influencer/campaigns"><Button className="bg-white/10">Browse campaigns</Button></Link>
          </div>
        </div>
        <Card className="min-h-64">
          <p className="text-white/80">Explore premium opportunities and manage collaborations with confidence.</p>
        </Card>
      </section>
    </main>
  );
}
