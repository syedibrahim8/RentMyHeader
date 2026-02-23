"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full rounded-xl border bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-500 transition-all duration-200",
                            "border-white/15 outline-none",
                            "focus:border-violet-500/60 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/20",
                            "hover:border-white/25",
                            error && "border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/20",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-rose-400">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full rounded-xl border bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-500 transition-all duration-200 resize-none",
                        "border-white/15 outline-none",
                        "focus:border-violet-500/60 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/20",
                        "hover:border-white/25",
                        error && "border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/20",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-rose-400">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, id, children, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full rounded-xl border bg-[#0f0f14] px-3 py-2.5 text-sm text-white transition-all duration-200 appearance-none",
                        "border-white/15 outline-none",
                        "focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20",
                        "hover:border-white/25",
                        error && "border-rose-500/60",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error && <p className="text-xs text-rose-400">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
