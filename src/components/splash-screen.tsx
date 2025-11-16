
"use client";

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Gauge } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-primary text-primary-foreground p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Gauge className="w-24 h-24 mb-6" />
        <h1 className="text-4xl font-bold">SpeedWatch</h1>
        <p className="text-primary-foreground/80 mt-2">Stay aware. Drive safe.</p>
      </div>

      <div className={`w-full transition-opacity duration-500 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
        <Button 
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={onComplete}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
