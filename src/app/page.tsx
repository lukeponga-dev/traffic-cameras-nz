import { SpeedwatchApp } from '@/components/speedwatch-app';
import { cameras } from '@/lib/data';
import type { SpeedCamera } from '@/lib/types';

export default function Home() {
  const cameraData: SpeedCamera[] = cameras;
  
  return <SpeedwatchApp cameras={cameraData} />;
}
