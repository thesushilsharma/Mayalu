"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Check,
  Cpu,
  Database,
  GitFork,
  Layers,
  RefreshCw,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useRef, useState } from "react";
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
  { id: "u1", label: "You", category: "user", x: 16, y: 50, color: "#F43F5E" },
  {
    id: "u2",
    label: "Your Match",
    category: "user",
    x: 84,
    y: 50,
    color: "#8B5CF6",
  },
  {
    id: "i1",
    label: "Himalayan Treks",
    category: "interest",
    x: 38,
    y: 20,
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
    label: "Indie Cinema",
    category: "interest",
    x: 38,
    y: 80,
    color: "#3B82F6",
  },
  {
    id: "v1",
    label: "Mutual Empathy",
    category: "value",
    x: 62,
    y: 25,
    color: "#EC4899",
  },
  {
    id: "v2",
    label: "Shared Growth",
    category: "value",
    x: 62,
    y: 75,
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
  const [isSimulating, setIsSimulating] = useState(false);
  const [harmonyScore, setHarmonyScore] = useState(96.4);
  const [activeTab, setActiveTab] = useState<"visualizer" | "cypher">(
    "visualizer",
  );

  const containerRef = useRef<HTMLElement | null>(null);
  const graphCanvasRef = useRef<HTMLDivElement | null>(null);

  // GSAP Floating Node Orbits
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Subtle ambient floating pulse on interest and value nodes
      gsap.to(".floating-node", {
        y: "+=5",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.25,
      });
    },
    { scope: containerRef },
  );

  // Simulation Trigger Function
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    // Pulse the canvas with GSAP
    if (graphCanvasRef.current) {
      gsap.fromTo(
        graphCanvasRef.current,
        { boxShadow: "0 0 0px rgba(139, 92, 246, 0)" },
        {
          boxShadow: "0 0 50px rgba(139, 92, 246, 0.45)",
          duration: 0.4,
          yoyo: true,
          repeat: 1,
        },
      );
    }

    setTimeout(() => {
      const newScore = +(95 + Math.random() * 4).toFixed(1);
      setHarmonyScore(newScore);
      setIsSimulating(false);
    }, 900);
  };

  return (
    <section
      ref={containerRef}
      id="graph-match"
      className="py-24 border-t border-border/40 bg-card/30 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion In-View */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-semibold rounded-full border-border/80 bg-background/80 uppercase tracking-widest text-violet-500 shadow-xs"
          >
            <GitFork className="w-3.5 h-3.5 mr-1" />
            Neo4j Graph Database Intelligence
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

          {/* Toggle between Graph Canvas and Live Cypher Query */}
          <div className="inline-flex p-1 rounded-xl bg-card border border-border/70 mt-2">
            <button
              type="button"
              onClick={() => setActiveTab("visualizer")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "visualizer"
                  ? "bg-violet-500/15 text-violet-500 border border-violet-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              Graph Visualizer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cypher")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "cypher"
                  ? "bg-violet-500/15 text-violet-500 border border-violet-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Live Cypher Query
            </button>
          </div>
        </motion.div>

        {/* Visual Graph Interface Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Visualizer Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            ref={graphCanvasRef}
            className="lg:col-span-8 relative h-[380px] sm:h-[440px] rounded-3xl border border-border/80 bg-gradient-to-b from-background/95 via-card/90 to-background/95 shadow-2xl overflow-hidden p-4 flex items-center justify-center transition-all duration-300"
          >
            {activeTab === "visualizer" ? (
              <>
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
                      <stop
                        offset="100%"
                        stopColor="#8B5CF6"
                        stopOpacity="0.4"
                      />
                    </linearGradient>

                    {/* Radial glow for central connector */}
                    <radialGradient id="center-glow">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Central Hub Glow */}
                  <circle
                    cx="50"
                    cy="50"
                    r="18"
                    fill="url(#center-glow)"
                    className="animate-pulse"
                  />

                  {/* Connecting Edges */}
                  {EDGES.map((edge) => {
                    const source = NODES.find((n) => n.id === edge.from);
                    const target = NODES.find((n) => n.id === edge.to);
                    if (!source || !target) return null;

                    const isHighlighted =
                      hoveredNode === edge.from || hoveredNode === edge.to;

                    return (
                      <g key={`${edge.from}-${edge.to}`}>
                        <line
                          x1={source.x}
                          y1={source.y}
                          x2={target.x}
                          y2={target.y}
                          stroke={
                            isHighlighted ? "#F43F5E" : "url(#edge-gradient)"
                          }
                          strokeWidth={isHighlighted ? 0.9 : 0.4}
                          strokeDasharray={isHighlighted ? "none" : "1.2 1.2"}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
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
                        !isUser ? "floating-node" : ""
                      } ${isHovered ? "scale-115 z-20" : ""}`}
                    >
                      <div
                        className={`rounded-full flex items-center justify-center font-bold shadow-lg transition-transform ${
                          isUser
                            ? "w-14 h-14 text-white text-xs border-2 border-white/90"
                            : "px-3.5 py-1.5 text-[11px] font-semibold text-foreground border border-border/80 bg-background/90 backdrop-blur-md"
                        }`}
                        style={{
                          backgroundColor: isUser ? node.color : undefined,
                          boxShadow: isHovered
                            ? `0 0 24px ${node.color}90`
                            : undefined,
                        }}
                      >
                        {isUser ? (
                          <span className="tracking-tight">{node.label}</span>
                        ) : (
                          <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <span
                              className="w-2 h-2 rounded-full shadow-xs"
                              style={{ backgroundColor: node.color }}
                            />
                            {node.label}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            ) : (
              /* Interactive Cypher Query Preview */
              <div className="w-full h-full p-6 flex flex-col justify-between font-mono text-xs overflow-x-auto text-left">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground text-[11px] border-b border-border/60 pb-2">
                    <span className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-violet-400" />
                      neo4j$ query_deep_alignment.cql
                    </span>
                    <span className="text-emerald-400 font-bold">
                      ● Active Connection
                    </span>
                  </div>

                  <div className="space-y-1 pt-2 leading-relaxed">
                    <p>
                      <span className="text-violet-400 font-bold">MATCH</span>{" "}
                      (me:
                      <span className="text-pink-400">User</span> &#123;id:{" "}
                      <span className="text-amber-400">"you"</span>&#125;)
                    </p>
                    <p>
                      <span className="text-violet-400 font-bold">MATCH</span>{" "}
                      (them:
                      <span className="text-pink-400">User</span> &#123;id:{" "}
                      <span className="text-amber-400">"match_candidate"</span>
                      &#125;)
                    </p>
                    <p>
                      <span className="text-violet-400 font-bold">MATCH</span>{" "}
                      (me)-[r1:
                      <span className="text-sky-400">LOVES|VALUES</span>
                      ]-&gt;(node)&lt;-[r2:
                      <span className="text-sky-400">LOVES|VALUES</span>]-(them)
                    </p>
                    <p>
                      <span className="text-violet-400 font-bold">WHERE</span>{" "}
                      r1.weight &gt;{" "}
                      <span className="text-amber-400">0.85</span>{" "}
                      <span className="text-violet-400 font-bold">AND</span>{" "}
                      r2.weight &gt;{" "}
                      <span className="text-amber-400">0.85</span>
                    </p>
                    <p>
                      <span className="text-violet-400 font-bold">RETURN</span>{" "}
                      them.name, sum(r1.weight * r2.weight){" "}
                      <span className="text-violet-400 font-bold">AS</span>{" "}
                      harmonyScore
                    </p>
                    <p>
                      <span className="text-violet-400 font-bold">
                        ORDER BY
                      </span>{" "}
                      harmonyScore{" "}
                      <span className="text-violet-400 font-bold">DESC</span>{" "}
                      <span className="text-violet-400 font-bold">LIMIT</span>{" "}
                      <span className="text-amber-400">1;</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">
                    Query Execution Time: <strong>1.8ms</strong> (Indexed via
                    Neo4j APOC)
                  </span>
                  <span className="text-violet-400 font-bold">
                    Result: 96.4% Harmony
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Floating Stats Pill & Simulation Button */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-card/95 border border-border/80 backdrop-blur-md text-xs shadow-md">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                Neo4j Dynamic Weight:
              </span>

              <div className="flex items-center gap-2">
                <span className="font-extrabold bg-rose-500/10 px-2.5 py-0.5 rounded-full text-rose-500">
                  {harmonyScore}% Harmony Index
                </span>

                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${isSimulating ? "animate-spin" : ""}`}
                  />
                  <span>Recalculate</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Graph Insights Details */}
          <div className="lg:col-span-4 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-5 rounded-3xl border border-border/70 bg-card shadow-sm space-y-2 hover:border-rose-500/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                Interlocking Interest Clusters
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rather than matching on age or distance alone, Neo4j graphs find
                dense topological clusters connecting your lifestyle nodes with
                potential partners.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-5 rounded-3xl border border-border/70 bg-card shadow-sm space-y-2 hover:border-violet-500/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-violet-500 font-bold text-sm">
                <Layers className="w-4 h-4" />
                Zero Accidental Mismatches
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By modeling deep values as relational nodes, Mayalu filters out
                dealbreakers before a swipe ever happens.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-5 rounded-3xl border border-border/70 bg-card shadow-sm space-y-2 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <Check className="w-4 h-4" />
                Continuous Graph Learning
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                As you like, pass, and chat, the relationship graph adapts
                dynamically, bringing you increasingly compatible connections
                over time.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
