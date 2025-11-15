"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { SpeedCamera } from "@/lib/types";

interface CameraMarkerProps {
  camera: SpeedCamera;
  onClick: () => void;
}

export function CameraMarker({ camera, onClick }: CameraMarkerProps) {
  let pinColor = "hsl(var(--muted-foreground))"; // gray for inactive
  let borderColor = "hsl(var(--muted))";
  let glyphColor = "hsl(var(--muted))";

  if (camera.status === "Active") {
    if (camera.cameraType === "Fixed") {
      pinColor = "hsl(var(--destructive))"; // red
      borderColor = "hsl(var(--destructive-foreground))";
      glyphColor = "hsl(var(--destructive-foreground))";
    } else if (camera.cameraType === "Mobile") {
      pinColor = "hsl(var(--primary))"; // blue
      borderColor = "hsl(var(--primary-foreground))";
      glyphColor = "hsl(var(--primary-foreground))";
    } else if (camera.cameraType === "Red light") {
        pinColor = "hsl(var(--accent))";
        borderColor = "hsl(var(--accent-foreground))";
        glyphColor = "hsl(var(--accent-foreground))";
    }
  }

  return (
    <AdvancedMarker
      position={{ lat: camera.latitude, lng: camera.longitude }}
      onClick={onClick}
      title={`${camera.name} ${camera.speedLimit ? `(${camera.speedLimit} km/h)` : ''}`}
    >
      <Pin
        background={pinColor}
        borderColor={borderColor}
        glyphColor={glyphColor}
      />
    </AdvancedMarker>
  );
}
