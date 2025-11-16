
"use client";

import { useState, useEffect } from 'react';
import type { Camera } from '@/lib/traffic-api';
import { SpeedwatchAppLoader } from '@/components/speedwatch-app-loader';
import { SplashScreen } from '@/components/splash-screen';
import { requestUserPermission } from '@/lib/permissions';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [cameraData, setCameraData] = useState<Camera[]>([]);

  useEffect(() => {
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
  }, []);

  const handlePermissionsGranted = () => {
    requestUserPermission();
    setPermissionsGranted(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate splash screen time
    return () => clearTimeout(timer);
  }, []);

  if (loading || !permissionsGranted) {
    return <SplashScreen onComplete={handlePermissionsGranted} />;
  }

  return <SpeedwatchAppLoader cameras={cameraData} />;
}
