import { ArrowRight, HeartHandshake, Share2, Trophy, Zap } from "lucide-react";

export function Pillars() {
  const pillars = [
    {
      eyebrow: "Find Depth",
      label: "Discover",
      tagline: "Graph-Powered Relationship Modeling",
      description:
        "Leverage Neo4j graph algorithms that analyze deep intersections of passions, values, and relationship philosophy rather than shallow distance sweeps.",
      icon: Share2,
      accentColor: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      highlight: "98.6% Shared Passions Index",
      features: [
        "Interlocking interest nodes",
        "Value-based compatibility",
        "Zero superficial clutter",
      ],
    },
    {
      eyebrow: "Choose Intent",
      label: "Match",
      tagline: "Instant Dating & Matrimonial Modes",
      description:
        "Seamlessly switch your profile intent. Enjoy spontaneous chemistry in Dating Mode or intentional life partnership in Matrimonial Mode whenever you choose.",
      icon: HeartHandshake,
      accentColor: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      highlight: "1 Tap Mode Switch",
      features: [
        "Curated matrimonial criteria",
        "Spontaneous dating vibe",
        "Privacy-preserving controls",
      ],
    },
    {
      eyebrow: "Level Up",
      label: "Progress",
      tagline: "Gamified XP & Unlockable Themes",
      description:
        "Turn self-expression into an engaging journey. Complete profile milestones, unlock stunning custom themes, and access gamified video & audio icebreaker prompts.",
      icon: Trophy,
      accentColor: "from-violet-600 to-purple-600",
      iconBg: "bg-violet-500/10 text-violet-500 border-violet-500/20",
      highlight: "XP Level Milestones",
      features: [
        "Gamified audio/video chat",
        "Unlockable profile skins",
        "Verified badges & perks",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 border-y border-border/40 bg-muted/20 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            The Mayalu Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Built for how modern people{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              actually connect.
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Trakt revolutionized how people track media. Mayalu transforms how
            people discover authentic love and life partners.
          </p>
        </div>

        {/* 3 Signature Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.label}
                className="group relative rounded-3xl border border-border/60 bg-gradient-to-b from-card to-card/70 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Glow highlight on hover */}
                <div
                  className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${pillar.accentColor} opacity-0 group-hover:opacity-10 transition-opacity blur-md -z-10`}
                />

                <div className="space-y-6">
                  {/* Top Bar with Icon & Eyebrow */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pillar.iconBg} shadow-sm group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 px-3 py-1 rounded-full bg-muted/50 border border-border/40">
                      {pillar.eyebrow}
                    </span>
                  </div>

                  {/* Pillar Label & Tagline */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {pillar.label}
                    </h3>
                    <p className="text-sm font-semibold text-rose-500 mt-1">
                      {pillar.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Bullet features */}
                  <ul className="space-y-2 pt-2 border-t border-border/50 text-xs text-foreground/80">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Highlight pill */}
                <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    {pillar.highlight}
                  </span>
                  <span className="flex items-center gap-1 text-foreground group-hover:text-rose-500 transition-colors">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
