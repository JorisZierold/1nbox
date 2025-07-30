"use client";

import { Button } from "@/components/ui/button";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { WalletCards, TrendingUp, Shield, Zap, Coins } from "lucide-react";
import { Logo } from "../logo";
import { DynamicSubtitle } from "../ui/dynamic-subtitle";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { SplashScreenCorner } from "./SplashScreenCorner";

const defiSentences = [
  "All wallets. All chains. One action feed.",
  "Managing 47 chains like it's 47 Chrome tabs.",
  "Because checking 12 wallets shouldn't feel like a full-time job",
  "Your portfolio: where 'diamond hands' meets 'where did my money go?'",
  "Security first, because 'trust me bro' isn't a valid audit",
  "One inbox to rule all your DeFi chaos",
  "Where 'I'll do it later' meets 'I'll do it never'",
  "Your inbox: the only thing more organized than your portfolio",
  "Your DeFi actions, finally in one place (like your life should be)",
  "Gmail for your DeFi—minus the spam.",
  "Powered by 1inch. Built for everyday DeFi.",
];

interface SplashScreenProps {
  setSplashed: (splashed: boolean) => void;
}

export function SplashScreen({ setSplashed }: SplashScreenProps) {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [isFading, setIsFading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setSplashed(true);
        }, 1000); // 1 second fade-out duration
      }, 2000);
    } else {
      setSplashed(false);
      setIsFading(false);
      // Show content after 2.5 seconds only if not connected
      setTimeout(() => {
        setShowContent(true);
      }, 2500);
    }
  }, [isConnected, setSplashed]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  const subtitleVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easeOut,
        delay: 0.3, // Slight delay after logo appears
      },
    },
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6 transition-opacity duration-1000 ease-in-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Logo and Title */}
        <div className="space-y-6 flex flex-col items-center justify-center -mt-8">
          <Logo size={180} />
          <motion.p
            className="text-lg text-muted-foreground"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
          >
            Your DeFi Action Inbox
          </motion.p>
        </div>

        {/* Content that shows after 2.5 seconds */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12"
            >
              {/* Animated Sentence of the Day */}
              <motion.div variants={itemVariants}>
                <DynamicSubtitle phrases={defiSentences} />
              </motion.div>

              {/* CTA Button */}
              <motion.div variants={itemVariants} className="space-y-12">
                <Button
                  onClick={() => open({ view: "Connect" })}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 transform hover:scale-105"
                >
                  <WalletCards className="h-5 w-5 mr-2" />
                  Connect Your Wallet
                </Button>
              </motion.div>

              {/* What you get section */}
              <motion.div variants={itemVariants} className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-sm font-medium text-muted-foreground">
                    What you get
                  </span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                {/* Feature Pills */}
                <motion.div
                  className="grid grid-cols-3 gap-3 max-w-md mx-auto"
                  variants={containerVariants}
                >
                  {[
                    { text: "Action Inbox", icon: TrendingUp },
                    { text: "Multi-Chain", icon: Coins },
                    { text: "Multi-Wallet", icon: WalletCards },
                    { text: "Security First", icon: Shield },
                    { text: "Portfolio View", icon: WalletCards },
                    { text: "Smart Actions", icon: Zap },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      variants={featureVariants}
                      className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-full text-xs text-muted-foreground justify-center"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <feature.icon className="h-3 w-3" />
                      {feature.text}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SplashScreen Corner Component */}
      <SplashScreenCorner />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
