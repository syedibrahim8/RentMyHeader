"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glass?: boolean;
    glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover, glass, glow, children, ...props }, ref) => {
        const Comp = hover ? motion.div : "div";
        const motionProps = hover
            ? {
                whileHover: { y: -2, transition: { duration: 0.2 } },
            }
            : {};

        return (
            <Comp
                ref={ref}
                {...motionProps}
                className={cn(
                    "rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-200",
                    glass && "bg-black/40 backdrop-blur-2xl",
                    hover && "cursor-pointer hover:border-white/20 hover:bg-white/8",
                    glow && "shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20",
                    className
                )}
                {...(props as HTMLAttributes<HTMLDivElement>)}
            >
                {children}
            </Comp>
        );
    }
);

Card.displayName = "Card";

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("mb-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn("text-lg font-semibold text-white", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn("text-sm text-zinc-400", className)} {...props}>
            {children}
        </p>
    );
}
