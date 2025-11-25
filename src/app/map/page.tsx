"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import type { Camera } from '@/lib/traffic-api';
import { SplashScreen } from '@/components/splash-screen';
import { requestUserPermission } from '@/lib/permissions';
import dynamic from 'next/dynamic';
import { SpeedwatchAppSkeleton } from '@/components/speedwatch-app-skeleton';

const CameraMap = dynamic(() => import('@/components/map'), {
    ssr: false,
    loading: () => <SpeedwatchAppSkeleton />
});

export default function MapPage() {
  const [showApp, setShowApp] = useState(false);
  const [cameraData, setCameraData] = useState<Camera[] | undefined>(undefined);

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

  if (!showApp) {
    return <SplashScreen onComplete={() => setShowApp(true)} />;
  }

  return (
    <div className="relative h-screen">
        <Suspense fallback={<SpeedwatchAppSkeleton />}>
            {cameraData && <CameraMap cameras={cameraData} />}
        </Suspense>
    </div>
  );
}
