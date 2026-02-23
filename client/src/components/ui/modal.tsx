"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "./button";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, className, size = "md" }: ModalProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            "relative z-10 w-full rounded-3xl border border-white/15 bg-[#0d0d14] p-6 shadow-2xl shadow-black/60 backdrop-blur-2xl",
                            sizes[size],
                            className
                        )}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="absolute right-4 top-4 text-zinc-400 hover:text-white"
                            aria-label="Close modal"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        {(title || description) && (
                            <div className="mb-5 pr-8">
                                {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
                                {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
                            </div>
                        )}
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
