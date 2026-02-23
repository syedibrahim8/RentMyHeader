"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/lib/query-client";
import { AuthProvider } from "@/src/hooks/use-auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <AuthProvider>
                    <LenisProvider>
                        {children}
                        <Toaster
                            position="bottom-right"
                            theme="dark"
                            richColors
                            toastOptions={{
                                style: {
                                    background: "rgba(10, 10, 15, 0.95)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(20px)",
                                },
                            }}
                        />
                    </LenisProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
