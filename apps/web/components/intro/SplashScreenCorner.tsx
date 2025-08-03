"use client";

import { easeOut, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ExternalLink } from "lucide-react";

export function SplashScreenCorner() {
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const { theme } = useTheme();

  const cornerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easeOut,
        delay: 2.5,
      },
    },
  };

  const isLight = theme === "light" || theme === "rose";

  return (
    <>
      {/* Subtle Floating Badge */}
      <motion.div
        className="fixed top-6 right-6 cursor-pointer z-50"
        variants={cornerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{
          scale: 1.05,
          y: -2,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPartnerModalOpen(true)}
      >
        {/* Subtle glow background */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>

        {/* Main badge */}
        <div className="relative bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-2">
            <img
              src="/unite-defi.svg"
              alt="Unite DeFi"
              className={`h-4 mr-2 ${isLight ? "hidden" : ""}`}
            />
            <span className="text-xs font-medium text-muted-foreground">
              Built with ❤️ during Unite DeFi Hackathon
            </span>
          </div>
        </div>
      </motion.div>

      {/* Partner Modal */}
      <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader
            className={`rounded-t-lg -mt-6 -mx-6 px-6 py-4 ${
              isLight ? "bg-black/5" : "bg-white/5"
            }`}
          >
            <DialogTitle className="flex items-center gap-3">
              <img
                src="/ETHGlobal.svg"
                alt="ETHGlobal"
                className={`h-8 ${isLight ? "" : "filter brightness-0 invert"}`}
              />

              <a
                href="https://ethglobal.com/events/unite"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Unite DeFi Hackathon
              </a>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Thank you to the amazing teams that made this hackathon possible:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">ETHGlobal</h4>
                    <a
                      href="https://ethglobal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For facilitating this incredible hackathon and bringing
                    together the largest Ethereum developer community.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <img
                  src="/1inch-logo.svg"
                  alt="1inch"
                  className="w-8 h-8 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">1inch</h4>
                    <a
                      href="https://1inch.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For sponsoring the event and providing cutting-edge DeFi
                    infrastructure that powers 1nbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
