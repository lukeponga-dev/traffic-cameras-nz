
'use client';

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
    if (permissionsGranted) {
      fetchData();
    }
  }, [permissionsGranted]);

  const handlePermissionsGranted = () => {
    requestUserPermission();
    setPermissionsGranted(true);
    setLoading(false);
  };

  if (!permissionsGranted) {
    return <SplashScreen onComplete={handlePermissionsGranted} />;
  }

  if (loading && permissionsGranted) {
      // Still show a loading state while fetching initial data after permissions
      return <SpeedwatchAppLoader cameras={[]} />;
  }

  return <SpeedwatchAppLoader cameras={cameraData} />;
}
