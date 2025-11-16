
'use client';

import { useState, useEffect } from 'react';
import { SpeedwatchAppLoader } from '@/components/speedwatch-app-loader';
import { SplashScreen } from '@/components/splash-screen';
import { requestUserPermission } from '@/lib/permissions';
import { getCameras, type Camera } from '@/lib/traffic-api';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  
  // This is no longer used to pass data, but we can keep it for future use if needed.
  const [cameraData, setCameraData] = useState<Camera[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!permissionsGranted) return;
      try {
        const data = await getCameras();
        setCameraData(data);
      } catch (error) {
        console.error("Failed to fetch camera data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (permissionsGranted) {
        fetchData();
    }
  }, [permissionsGranted]);

  const handlePermissionsGranted = () => {
    requestUserPermission();
    setPermissionsGranted(true);
  };

  if (!permissionsGranted) {
    return <SplashScreen onComplete={handlePermissionsGranted} />;
  }

  // The SpeedwatchAppLoader will now show its own skeleton and load the app,
  // which will then fetch its own data.
  return <SpeedwatchAppLoader cameras={[]} />;
}
