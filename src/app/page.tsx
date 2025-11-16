
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
    fetchData();
  }, [permissionsGranted]);

  const handlePermissionsGranted = () => {
    requestUserPermission();
    setPermissionsGranted(true);
    // Don't set loading to false here, wait for data to be fetched.
  };

  if (!permissionsGranted) {
    return <SplashScreen onComplete={handlePermissionsGranted} />;
  }

  // Show loader while waiting for permissions and initial data
  if (loading) {
      return <SpeedwatchAppLoader cameras={[]} />;
  }

  return <SpeedwatchAppLoader cameras={cameraData} />;
}
