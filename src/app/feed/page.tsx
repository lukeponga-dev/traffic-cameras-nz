
'use client';

import { useEffect, useState } from 'react';
import { BottomNavigation } from '@/components/bottom-navigation';
import { TrafficCameraFeed } from './traffic-camera-feed';
import type { Camera } from '@/lib/traffic-api';

export default function FeedPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCameras() {
      try {
        const response = await fetch('/api/cameras');
        const data = await response.json();
        setCameras(data.cameras);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
      setLoading(false);
    }

    fetchCameras();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <header className="p-4 border-b sticky top-0 bg-background z-10">
        <h1 className="text-xl font-bold text-center">Live Feed</h1>
      </header>
      <main className="p-4 pb-20">
        {loading ? (
          <p className="text-center">Loading cameras...</p>
        ) : (
          <div>
            {cameras.map((camera) => (
              <TrafficCameraFeed key={camera.id} camera={camera} />
            ))}
          </div>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
}
