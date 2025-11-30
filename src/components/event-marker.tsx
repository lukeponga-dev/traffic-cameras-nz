
"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { RoadEvent } from "@/lib/traffic-api";
import { AlertTriangle } from "lucide-react";

interface EventMarkerProps {
  event: RoadEvent;
  onClick: () => void;
}

export function EventMarker({ event, onClick }: EventMarkerProps) {
  if (!event.lat || !event.lon) {
    return null;
  }

  const isSevere = event.severity === "high" || event.severity === "major";

  return (
    <AdvancedMarker
      position={{ lat: event.lat, lng: event.lon }}
      onClick={onClick}
      title={event.title}
    >
        <Pin
            background={isSevere ? "hsl(var(--destructive))" : "hsl(var(--accent))"}
            borderColor={"hsl(var(--primary-foreground))"}
            glyphColor={"hsl(var(--primary-foreground))"}
        >
            <AlertTriangle className="w-5 h-5" />
        </Pin>
    </AdvancedMarker>
  );
}
