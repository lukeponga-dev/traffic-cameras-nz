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

  if (camera.status === "active") {
    if (camera.type === "fixed") {
      pinColor = "hsl(var(--destructive))"; // red
      borderColor = "hsl(var(--destructive-foreground))";
      glyphColor = "hsl(var(--destructive-foreground))";
    } else if (camera.type === "average") {
      pinColor = "hsl(var(--primary))"; // blue
      borderColor = "hsl(var(--primary-foreground))";
      glyphColor = "hsl(var(--primary-foreground))";
    }
  }

  return (
    <AdvancedMarker
      position={camera.location}
      onClick={onClick}
      title={`${camera.road} (${camera.speed_limit} mph)`}
    >
      <Pin
        background={pinColor}
        borderColor={borderColor}
        glyphColor={glyphColor}
      />
    </AdvancedMarker>
  );
}
