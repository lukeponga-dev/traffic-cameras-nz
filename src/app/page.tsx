import { getCameras } from '@/lib/traffic-api';
import type { Camera } from '@/lib/traffic-api';
import { SpeedwatchAppSkeleton } from '@/components/speedwatch-app-skeleton';
import dynamic from 'next/dynamic';

const SpeedwatchApp = dynamic(() => import('@/components/speedwatch-app').then(mod => mod.SpeedwatchApp), { 
    ssr: false,
    loading: () => <SpeedwatchAppSkeleton />
});

export default async function Home() {
  const cameraData: Camera[] = await getCameras();

  return <SpeedwatchApp cameras={cameraData} />;
}
