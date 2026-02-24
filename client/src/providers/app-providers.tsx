"use client";

import { PropsWithChildren } from "react";
import { AuthProvider } from "./auth-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { ToastProvider } from "./toast-provider";

export const AppProviders = ({ children }: PropsWithChildren) => (
  <ReactQueryProvider>
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  </ReactQueryProvider>
);
