
"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { Camera } from "@/lib/traffic-api";

interface CameraMarkerProps {
  camera: Camera;
  onClick: () => void;
}

export function CameraMarker({ camera, onClick }: CameraMarkerProps) {
  const isOnline = camera.status === "Active";

  return (
    <AdvancedMarker
      position={{ lat: camera.lat, lng: camera.lon }}
      onClick={onClick}
      title={camera.name}
    >
      <Pin
        background={isOnline ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
        borderColor={"hsl(var(--primary-foreground))"}
        glyphColor={"hsl(var(--primary-foreground))"}
      />
    </AdvancedMarker>
  );
}
