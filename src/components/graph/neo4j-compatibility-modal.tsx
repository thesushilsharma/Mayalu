"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Neo4jCompatibilityGraph } from "./neo4j-compatibility-graph";
import { GitFork, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Neo4jCompatibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName?: string;
  candidateId?: string;
}

export function Neo4jCompatibilityModal({
  open,
  onOpenChange,
  candidateName = "Your Match",
  candidateId = "demo_user_match",
}: Neo4jCompatibilityModalProps) {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="relative w-full max-w-3xl bg-card/95 backdrop-blur-2xl border border-border/80 rounded-[2rem] shadow-2xl p-5 sm:p-7 z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border/40 transition-all cursor-pointer active:scale-95 z-20"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="mb-4 space-y-1.5 pr-8">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 text-[11px] font-semibold border-violet-500/30 text-violet-500 bg-violet-500/10 flex items-center gap-1 rounded-full"
                >
                  <GitFork className="size-3" />
                  Neo4j Graph Database Intelligence
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                High-Dimensional Compatibility Network
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Visualizing topological intersections of shared values, lifestyle practices, and passions between You and {candidateName}.
              </p>
            </div>

            {/* The Graph Canvas Component */}
            <div className="w-full">
              <Neo4jCompatibilityGraph
                userId1="demo_user_you"
                userId2={candidateId}
                showHeader={false}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
