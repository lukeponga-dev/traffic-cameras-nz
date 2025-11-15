import { getCameras } from '@/lib/traffic-api';
import type { Camera } from '@/lib/traffic-api';
import { SpeedwatchAppLoader } from '@/components/speedwatch-app-loader';

export default async function Home() {
  const cameraData: Camera[] = await getCameras();

  return <SpeedwatchAppLoader cameras={cameraData} />;
}
