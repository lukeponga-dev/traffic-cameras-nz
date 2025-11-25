"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Camera } from '@/lib/traffic-api';
import { SplashScreen } from '@/components/splash-screen';
import { requestUserPermission } from '@/lib/permissions';
import { SpeedwatchApp } from '@/components/speedwatch-app';
import { SpeedwatchAppSkeleton } from '@/components/speedwatch-app-skeleton';
import { MapProvider } from '@/app/map-provider';

export default function Home() {
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

  if (!cameraData) {
    return <SpeedwatchAppSkeleton />;
  }

  return (
    <MapProvider>
      <SpeedwatchApp cameras={cameraData} />
    </MapProvider>
  );
}
