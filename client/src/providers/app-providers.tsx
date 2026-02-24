"use client";

import { PropsWithChildren, useEffect } from "react";
import { AuthProvider } from "./auth-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { ToastProvider } from "./toast-provider";
import Lenis from "lenis";

export const AppProviders = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ReactQueryProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </ReactQueryProvider>
  );
};
