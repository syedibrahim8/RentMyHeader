"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/src/lib/api";
import type { User } from "@/src/lib/types";

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchMe() {
        try {
            const u = await authApi.me();
            setUser(u);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMe();
    }, []);

    async function login(email: string, password: string) {
        const data = await authApi.login(email, password);
        setUser(data.user);
    }

    async function logout() {
        await authApi.logout().catch(() => { });
        setUser(null);
    }

    async function refetch() {
        setLoading(true);
        await fetchMe();
    }

    return (
        <AuthContext.Provider value= {{ user, loading, login, logout, refetch }
}>
    { children }
    </AuthContext.Provider>
  );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
