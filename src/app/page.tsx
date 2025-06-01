import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartIcon, UsersIcon, SparklesIcon, TrophyIcon } from 'lucide-react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header/>
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Perfect Match with{' '}
              <span className="text-rose-500">Mayalu</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience a new way to connect. Swipe, match, and level up your
              relationship journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth?mode=signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative h-[500px] w-full max-w-[350px] mx-auto">
              <div className="absolute top-8 right-0 rounded-xl bg-card shadow-lg p-6 w-72 transform rotate-3 z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <HeartIcon className="h-6 w-6 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Dating Mode</h3>
                    <p className="text-sm text-muted-foreground">Find your perfect match</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-40 left-0 rounded-xl bg-card shadow-lg p-6 w-72 transform -rotate-3 z-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Matrimonial Mode</h3>
                    <p className="text-sm text-muted-foreground">Find your life partner</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-4 rounded-xl bg-card shadow-lg p-6 w-72 transform rotate-2 z-30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrophyIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Level Up</h3>
                    <p className="text-sm text-muted-foreground">Earn XP and unlock features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl shadow-md p-6 transition-transform hover:scale-105">
            <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <SparklesIcon className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dual Mode</h3>
            <p className="text-muted-foreground">
              Toggle between Dating and Matrimonial modes based on your relationship goals.
            </p>
          </div>
          <div className="bg-card rounded-xl shadow-md p-6 transition-transform hover:scale-105">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <TrophyIcon className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn & Level Up</h3>
            <p className="text-muted-foreground">
              Complete profile sections, get matches, and stay active to earn XP and unlock special features.
            </p>
          </div>
          <div className="bg-card rounded-xl shadow-md p-6 transition-transform hover:scale-105">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <HeartIcon className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Perfect Matches</h3>
            <p className="text-muted-foreground">
              Our algorithm finds the most compatible matches based on your interests and preferences.
            </p>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}