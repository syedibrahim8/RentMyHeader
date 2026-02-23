"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X, LogOut, User as UserIcon, LayoutDashboard, Search } from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const publicLinks = [
  { href: "/campaigns", label: "Discover" },
];

export function TopNav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully");
    router.push("/");
  }

  const dashboardHref = user?.role === "brand" ? "/dashboard/brand" : "/dashboard/influencer";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-black/70 backdrop-blur-2xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">RentMyHeader</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-white/12 text-white"
                    : "text-zinc-400 hover:bg-white/8 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {!loading && user ? (
              <>
                <Link href={dashboardHref}>
                  <Button variant="ghost" size="sm" leftIcon={<LayoutDashboard className="h-3.5 w-3.5" />}>
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" leftIcon={<LogOut className="h-3.5 w-3.5" />} onClick={handleLogout}>
                  Sign out
                </Button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Toggle */}
          <button
            className="rounded-xl p-2 text-zinc-300 hover:bg-white/8 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-40 h-full w-72 border-l border-white/10 bg-[#0d0d14] p-6 md:hidden"
            >
              <div className="flex justify-end">
                <button onClick={() => setMobileOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-6 space-y-1">
                {publicLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/8 hover:text-white">
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <Link href={dashboardHref} className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/8 hover:text-white">
                    Dashboard
                  </Link>
                )}
              </nav>
              <div className="mt-6 space-y-2">
                {!loading && !user ? (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="outline" className="w-full">Sign in</Button>
                    </Link>
                    <Link href="/register" className="block">
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </>
                ) : user ? (
                  <Button variant="ghost" className="w-full" leftIcon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
                    Sign out
                  </Button>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}