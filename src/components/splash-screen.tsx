"use client";

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Gauge } from 'lucide-react';
=======
import { Logo } from './logo';
import { Button } from './ui/button';
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
    </div>
  );
}
