
"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import type { Camera } from '@/lib/traffic-api';
import { SplashScreen } from '@/components/splash-screen';
import { requestUserPermission } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import FeedPage from './feed/page';
import { SpeedwatchAppSkeleton } from '@/components/speedwatch-app-skeleton';

const CameraMap = dynamic(() => import('@/components/map'), {
    ssr: false,
    loading: () => <SpeedwatchAppSkeleton />
});

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [cameraData, setCameraData] = useState<Camera[] | undefined>(undefined);
  const [view, setView] = useState<'feed' | 'map'>('feed');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/cameras');
      if (!res.ok) throw new Error('Failed to fetch cameras');
      const data = await res.json();
      setCameraData(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (showApp) {
      fetchData();
      requestUserPermission();
    }
  }, [showApp, fetchData]);

  const toggleView = () => {
    setView(current => current === 'feed' ? 'map' : 'feed');
  };

  if (!showApp) {
    return <SplashScreen onComplete={() => setShowApp(true)} />;
  }

  return (
    <div className="relative h-screen">
        <div className="absolute top-4 right-4 z-20">
            <Button onClick={toggleView} variant="outline" size="icon">
                {view === 'feed' ? <MapIcon className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                <span className="sr-only">Toggle View</span>
            </Button>
        </div>

        {view === 'feed' ? 
            <FeedPage cameras={cameraData} onRefresh={fetchData} /> : 
            <Suspense fallback={<SpeedwatchAppSkeleton />}>
                {cameraData && <CameraMap cameras={cameraData} />}
            </Suspense>
        }
    </div>
  );
}
