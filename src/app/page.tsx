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

export default function Home() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleCameraSelect = (camera: Camera) => {
    setSelectedCamera(camera);
  };

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
}
