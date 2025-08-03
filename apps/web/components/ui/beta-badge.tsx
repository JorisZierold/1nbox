"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BetaBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BetaBadge({ className = "", size = "md" }: BetaBadgeProps) {
  const sizeClasses = {
    sm: "text-[8px] px-1.5 py-0.5",
    md: "text-[10px] px-2 py-1",
    lg: "text-xs px-2.5 py-1",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`${className}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: 1.5,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <div
              className={`relative bg-gradient-to-r from-primary via-primary/90 to-primary/70 text-primary-foreground font-bold uppercase tracking-wider rounded-full shadow-lg border border-primary/20 ${sizeClasses[size]} cursor-help overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full animate-pulse" />
              <span className="relative z-10">Beta</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="text-center space-y-1">
            <p className="font-medium text-sm">🚀 Beta Version</p>
            <p className="text-xs text-muted-foreground">
              Built during Unite DeFi Hackathon. Expect awesome features and
              occasional quirks!
            </p>
            <p className="text-xs text-muted-foreground pt-4">
              Found a quirk or have feedback?{" "}
              <a
                href="mailto:contact@1nbox.xyz"
                className="text-primary hover:underline"
              >
                We'd love to hear from you!
              </a>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
