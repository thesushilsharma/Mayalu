"use client";

import { motion } from "framer-motion";
import { Check, Cpu, GitFork, Layers, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

interface NodeData {
  id: string;
  label: string;
  category: "user" | "interest" | "value" | "lifestyle";
  x: number;
  y: number;
  color: string;
}

const NODES: NodeData[] = [
  { id: "u1", label: "You", category: "user", x: 18, y: 50, color: "#F43F5E" },
  {
    id: "u2",
    label: "Your Match",
    category: "user",
    x: 82,
    y: 50,
    color: "#8B5CF6",
  },
  {
    id: "i1",
    label: "Himalayan Treks",
    category: "interest",
    x: 42,
    y: 22,
    color: "#10B981",
  },
  {
    id: "i2",
    label: "Specialty Coffee",
    category: "interest",
    x: 50,
    y: 50,
    color: "#F59E0B",
  },
  {
    id: "i3",
    label: "Indie Acoustic Music",
    category: "interest",
    x: 42,
    y: 78,
    color: "#3B82F6",
  },
  {
    id: "v1",
    label: "Deep Empathy",
    category: "value",
    x: 62,
    y: 28,
    color: "#EC4899",
  },
  {
    id: "v2",
    label: "Curiosity & Growth",
    category: "value",
    x: 62,
    y: 72,
    color: "#6366F1",
  },
];

const EDGES = [
  { from: "u1", to: "i1", weight: 95 },
  { from: "u1", to: "i2", weight: 90 },
  { from: "u1", to: "i3", weight: 88 },
  { from: "u2", to: "i1", weight: 98 },
  { from: "u2", to: "i2", weight: 92 },
  { from: "u2", to: "i3", weight: 85 },
  { from: "u1", to: "v1", weight: 94 },
  { from: "u2", to: "v1", weight: 94 },
  { from: "u1", to: "v2", weight: 96 },
  { from: "u2", to: "v2", weight: 96 },
];

export function GraphShowcase() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section
      id="graph-match"
      className="py-20 border-t border-border/40 bg-card/30 relative"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-semibold rounded-full border-border/80 bg-background/80 uppercase tracking-widest text-violet-500"
          >
            <GitFork className="w-3.5 h-3.5 mr-1" />
            Neo4j Graph Database Matching
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Compatibility isn’t a flat score.{" "}
            <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              It’s a living network.
            </span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Traditional dating apps use simple distance filters and binary
            swipes. Mayalu leverages graph theory with Neo4j to uncover
            high-dimensional compatibility across shared values, passions, and
            life goals.
          </p>
        </div>

        {/* Visual Graph Interface Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Visualizer Canvas */}
          <div className="lg:col-span-8 relative h-[360px] sm:h-[420px] rounded-3xl border border-border/70 bg-gradient-to-b from-background/90 to-card/90 shadow-2xl overflow-hidden p-4 flex items-center justify-center">
            {/* SVG Interactive Canvas */}
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              role="img"
              aria-label="Interactive Neo4j graph network"
            >
              <title>Neo4j Compatibility Network</title>
              <defs>
                <linearGradient
                  id="edge-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Connecting Edges */}
              {EDGES.map((edge, index) => {
                const source = NODES.find((n) => n.id === edge.from);
                const target = NODES.find((n) => n.id === edge.to);
                if (!source || !target) return null;

                const isHighlighted =
                  hoveredNode === edge.from || hoveredNode === edge.to;

                return (
                  <motion.line
                    key={`${edge.from}-${edge.to}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isHighlighted ? "#F43F5E" : "url(#edge-gradient)"}
                    strokeWidth={isHighlighted ? 0.8 : 0.4}
                    strokeDasharray={isHighlighted ? "none" : "1 1"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: index * 0.05 }}
                  />
                );
              })}

              {/* Central Compatibility Hub */}
              <circle
                cx="50"
                cy="50"
                r="14"
                fill="rgba(244, 63, 94, 0.04)"
                stroke="rgba(244, 63, 94, 0.15)"
                strokeWidth="0.5"
                strokeDasharray="1 1"
              />
            </svg>

            {/* Render Nodes as Interactive HTML Elements */}
            {NODES.map((node) => {
              const isUser = node.category === "user";
              const isHovered = hoveredNode === node.id;

              return (
                <button
                  type="button"
                  key={node.id}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onFocus={() => setHoveredNode(node.id)}
                  onBlur={() => setHoveredNode(null)}
                  className={`absolute cursor-pointer transition-all duration-300 z-10 flex flex-col items-center select-none bg-transparent border-0 p-0 ${
                    isHovered ? "scale-115 z-20" : ""
                  }`}
                >
                  <div
                    className={`rounded-full flex items-center justify-center font-bold shadow-lg transition-transform ${
                      isUser
                        ? "w-12 h-12 text-white text-xs border-2 border-white/80"
                        : "px-3 py-1.5 text-[11px] font-semibold text-foreground border border-border/80 bg-background/90 backdrop-blur-md"
                    }`}
                    style={{
                      backgroundColor: isUser ? node.color : undefined,
                      boxShadow: isHovered
                        ? `0 0 20px ${node.color}80`
                        : undefined,
                    }}
                  >
                    {isUser ? (
                      <span>{node.label}</span>
                    ) : (
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: node.color }}
                        />
                        {node.label}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Bottom Floating Stats Pill */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between px-4 py-2 rounded-2xl bg-card/90 border border-border/80 backdrop-blur-md text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                Neo4j Graph Relationship Weight:
              </span>
              <span className="font-extrabold text-foreground bg-rose-500/10 px-2 py-0.5 rounded-full text-rose-500">
                96.4% Harmony Index
              </span>
            </div>
          </div>

          {/* Right Graph Insights Details */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl border border-border/60 bg-card shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                Interlocking Interest Clusters
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rather than matching on age or distance alone, Neo4j graphs find
                dense topological clusters connecting your lifestyle nodes with
                potential partners.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-border/60 bg-card shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-violet-500 font-bold text-sm">
                <Layers className="w-4 h-4" />
                Zero Accidental Mismatches
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By modeling deep values as relational nodes, Mayalu filters out
                dealbreakers before a swipe ever happens.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-border/60 bg-card shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <Check className="w-4 h-4" />
                Continuous Graph Learning
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                As you like, pass, and chat, the relationship graph adapts
                dynamically, bringing you increasingly compatible connections
                over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
