import { AppDownload } from "@/components/landing/app-download";
import { CloudAtmosphere } from "@/components/landing/cloud-atmosphere";
import Footer from "@/components/landing/footer";
import { GraphShowcase } from "@/components/landing/graph-showcase";
import Header from "@/components/landing/header";
import { HeroSpotlight } from "@/components/landing/hero-spotlight";
import { InteractiveModeToggle } from "@/components/landing/interactive-mode-toggle";
import { Pillars } from "@/components/landing/pillars";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { XpShowcase } from "@/components/landing/xp-showcase";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Ethereal 9th Cloud & Fluttering Butterfly Atmosphere */}
      <CloudAtmosphere />

      {/* Sticky Glass Navbar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Trakt-Style Hero with 3D Spotlight Card Deck */}
        <HeroSpotlight />

        {/* 2. The 3 Core Pillars (Discover · Match · Progress) */}
        <Pillars />

        {/* 3. Live Interactive Dual Mode Switcher (Dating vs Matrimonial) */}
        <InteractiveModeToggle />

        {/* 4. Neo4j Graph Relationship Intelligence Visualizer */}
        <GraphShowcase />

        {/* 5. Gamified XP System, Quests & Unlockable Themes */}
        <XpShowcase />

        {/* 6. Product Roadmap & Tech Stack Architecture from README.md */}
        <RoadmapSection />

        {/* 7. Trakt-Style Native Apps & PWA Ecosystem */}
        <AppDownload />
      </main>

      {/* Rich Footer */}
      <Footer />
    </div>
  );
}
