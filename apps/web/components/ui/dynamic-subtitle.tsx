"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DynamicSubtitleProps {
  phrases: string[];
}

export function DynamicSubtitle({ phrases }: DynamicSubtitleProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000); // Change phrase every 4 seconds

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className={'relative h-8 "mt-4 text-firefly-200 text-lg'}>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 text-center"
        >
          {phrases[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
