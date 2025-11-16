"use client";

import { Logo } from './logo';
import { Button } from './ui/button';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-primary text-primary-foreground">
      <div className="flex flex-col items-center justify-center text-center mb-20">
        <Logo className="flex-col" textClassName="text-4xl" />
        <p className="text-primary-foreground/80 mt-4">Stay aware. Drive safe.</p>
      </div>
      <div className="absolute bottom-10 w-full px-10">
        <Button className="w-full" onClick={onComplete} variant="secondary">
          Get Started
        </Button>
      </div>
    </div>
  );
}
