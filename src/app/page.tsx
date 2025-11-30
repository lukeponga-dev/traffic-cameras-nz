<<<<<<< HEAD

'use client';

import { useState, useEffect } from 'react';
import { SpeedwatchAppLoader } from '@/components/speedwatch-app-loader';
import { SplashScreen } from '@/components/splash-screen';
import { requestUserPermission } from '@/lib/permissions';
import { getCameras, type Camera } from '@/lib/traffic-api';
=======
'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Camera, getCameras } from '@/lib/traffic-api';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import { SidebarContent } from '@/components/sidebar-content';
import SpeedWatchApp from '@/components/speedwatch-app';
import SpeedwatchAppSkeleton from '@/components/speedwatch-app-skeleton';

const CameraMap = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => <div className="flex-1" />, // placeholder for map
});
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f

export default function Home() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
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
=======

  useEffect(() => {
    const initCameras = async () => {
      try {
        const cameras = await getCameras();
        setCameras(cameras);
      } catch (error) {
        console.error('Failed to fetch cameras:', error);
      } finally {
        setLoading(false);
      }
    };
    initCameras();
  }, []);
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f

  const handleCameraSelect = (camera: Camera) => {
    setSelectedCamera(camera);
  };

<<<<<<< HEAD
  if (!permissionsGranted) {
    return <SplashScreen onComplete={handlePermissionsGranted} />;
  }

  // The SpeedwatchAppLoader will now show its own skeleton and load the app,
  // which will then fetch its own data.
  return <SpeedwatchAppLoader cameras={[]} />;
=======
  if (loading) {
    return <SpeedwatchAppSkeleton />;
  }

  return (
    <SpeedWatchApp>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent cameras={cameras} onCameraSelect={handleCameraSelect} />
        </Sidebar>
      </SidebarProvider>
      <div className="flex-1">
        <CameraMap cameras={cameras} selectedCamera={selectedCamera} />
      </div>
    </SpeedWatchApp>
  );
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
}
