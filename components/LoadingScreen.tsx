"use client";

import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-primary" />
          </div>
          
          {/* Animated circles around the icon */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Smaller decorative particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/40 rounded-full"
              initial={{
                x: 0,
                y: 0,
                opacity: 0
              }}
              animate={{
                x: Math.sin(i * Math.PI / 3) * 40,
                y: Math.cos(i * Math.PI / 3) * 40,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        <motion.h1
          className="mt-6 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          GEN IMAGE
        </motion.h1>
        
        <div className="mt-6 relative w-40 h-2 bg-secondary/30 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary/50 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <motion.p
          className="mt-4 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Preparing your creative canvas...
        </motion.p>
      </motion.div>
    </div>
  );
}