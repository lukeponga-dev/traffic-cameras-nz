
"use client";

import { useState, useEffect } from 'react';
import { getCameras, type Camera } from '@/lib/traffic-api';
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
        const data = await getCameras();
        setCameraData(data);
      } catch (error) {
        console.error("Failed to fetch camera data:", error);
      }
    }
    fetchData();
  }, []);

  const handlePermissionsGranted = () => {
    requestUserPermission();
    setPermissionsGranted(true);
    setLoading(false);
  };

  if (loading) {
    return <SplashScreen onComplete={handlePermissionsGranted} />;
  }

  return <SpeedwatchAppLoader cameras={cameraData} />;
}
