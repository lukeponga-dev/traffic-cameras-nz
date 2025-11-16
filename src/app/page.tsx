"use client";

import { useState, useEffect } from 'react';
import type { Camera } from '@/lib/traffic-api';
import { SpeedwatchAppLoader } from '@/components/speedwatch-app-loader';
import { SplashScreen } from '@/components/splash-screen';
import { requestUserPermission } from '@/lib/permissions';

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [cameraData, setCameraData] = useState<Camera[]>([]);

  useEffect(() => {
    if (showApp) {
      async function fetchData() {
        try {
          const res = await fetch('/api/cameras');
          if (!res.ok) throw new Error('Failed to fetch cameras');
          const data = await res.json();
          setCameraData(data);
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
      requestUserPermission();
    }
  }, [showApp]);

  if (!showApp) {
    return <SplashScreen onComplete={() => setShowApp(true)} />;
  }

  return <SpeedwatchAppLoader cameras={cameraData} />;
}
