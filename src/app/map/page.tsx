
import { SpeedwatchApp } from "@/components/speedwatch-app";
import { fetchAndProcessCameras } from "@/lib/traffic-api";

export default async function MapPage() {
  const cameras = await fetchAndProcessCameras();
  return <SpeedwatchApp cameras={cameras} />;
}
