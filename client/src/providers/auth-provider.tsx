"use client";

import { bindAuthRefresh, refreshSession } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { User } from "@/types";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type AuthValue = {
  user: User | null;
  loading: boolean;
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshMe = async () => {
    const data = await api.get(endpoints.auth.me);
    setUser(data.data.user ?? null);
  };

  const logout = async () => {
    await api.post(endpoints.auth.logout);
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    bindAuthRefresh({
      refresh: refreshSession,
      onUnauthorized: () => setUser(null),
    });
    const run = async () => {
      await refreshMe().catch(() => undefined);
      setLoading(false);
    };
    void run();
  }, []);

  return <AuthContext.Provider value={{ user, loading, refreshMe, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
