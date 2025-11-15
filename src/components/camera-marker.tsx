
"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { Camera } from "@/lib/traffic-api";

interface CameraMarkerProps {
  camera: Camera;
  onClick: () => void;
}

export function CameraMarker({ camera, onClick }: CameraMarkerProps) {

  return (
    <AdvancedMarker
      position={{ lat: camera.latitude, lng: camera.longitude }}
      onClick={onClick}
      title={camera.name}
    >
      <Pin
        background={"hsl(var(--primary))"}
        borderColor={"hsl(var(--primary-foreground))"}
        glyphColor={"hsl(var(--primary-foreground))"}
      />
    </AdvancedMarker>
  );
}
