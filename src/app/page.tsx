
"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6">
      <header className="flex justify-start">
        <Logo />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Welcome to SpeedWatch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay aware. Drive safe.
          </p>
        </div>

        <Button 
          size="lg" 
          className="group transition-transform duration-300 ease-in-out hover:scale-105" 
          onClick={() => router.push('/map')}
        >
          View Live Camera Map
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>
      </main>

      <footer className="text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SpeedWatch. All rights reserved.</p>
      </footer>
    </div>
  );
}
