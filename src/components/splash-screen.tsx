
"use client";

import { useEffect, useState } from 'react';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Check, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPermissions(true);
    }, 1500); // Show permission prompt after 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500">
      <div className={`flex-col items-center justify-center text-center transition-opacity duration-1000 ${showPermissions ? 'opacity-0' : 'opacity-100'}`}>
        <Logo className="flex-col" textClassName="text-4xl" />
        <p className="text-muted-foreground mt-4">Stay aware. Drive safe.</p>
      </div>

      {showPermissions && (
        <Card className="w-full max-w-sm mx-4 animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
          <CardHeader className="items-center text-center">
             <div className="bg-primary p-3 rounded-full mb-2">
                <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle>Welcome to SpeedWatch</CardTitle>
            <CardDescription>To get the most out of SpeedWatch, please enable these permissions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0"/>
                  <div>
                      <h4 className="font-semibold">Location Access</h4>
                      <p className="text-sm text-muted-foreground">For real-time speed tracking and location-based alerts.</p>
                  </div>
              </div>
              <div className="flex items-start gap-4">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0"/>
                  <div>
                      <h4 className="font-semibold">Notifications</h4>
                      <p className="text-sm text-muted-foreground">To receive timely alerts for speed cameras and hazards.</p>
                  </div>
              </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={onComplete}>
              Grant Permissions
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
