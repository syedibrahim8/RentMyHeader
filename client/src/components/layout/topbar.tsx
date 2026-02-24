"use client";

import { Button } from "@/components/kits/button";
import { useAuth } from "@/providers/auth-provider";

export const Topbar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="glass flex items-center justify-between rounded-2xl p-4">
      <div>
        <p className="text-sm text-white/70">Welcome back</p>
        <h2 className="font-semibold">{user?.name}</h2>
      </div>
      <Button className="bg-white/10" onClick={() => logout()}>
        Logout
      </Button>
    </header>
  );
};
