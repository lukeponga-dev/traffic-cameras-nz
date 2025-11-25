
"use client";

import { BottomNavigation } from '@/components/bottom-navigation';
import { TrafficCamera } from './traffic-camera';
import type { SpeedCamera } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function FeedPage() {
  const [cameras, setCameras] = useState<SpeedCamera[]>([]);

  useEffect(() => {
    async function fetchCameras() {
      try {
        const res = await fetch('/api/cameras');
        if (!res.ok) throw new Error('Failed to fetch cameras');
        const data = await res.json();
        setCameras(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCameras();
  }, []);

  return (
    <div className="bg-background min-h-screen">
        <header className="p-4 border-b sticky top-0 bg-background z-10">
            <h1 className="text-xl font-bold text-center">Live Feed</h1>
        </header>
        <main className="p-4">
            {cameras.map(camera => (
                <TrafficCamera key={camera.id} camera={camera} />
            ))}
        </main>
        <BottomNavigation />
    </div>
  );
}
