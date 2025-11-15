
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { Menu } from "lucide-react";
import { useMemo, useState } from "react";

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

import { SidebarContent } from "@/components/sidebar-content";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";
import { SpeedwatchAppSkeleton } from "./speedwatch-app-skeleton";
import { UserLocationMarker } from "./user-location-marker";

interface SpeedwatchAppProps {
  cameras: CameraType[];
}

export function SpeedwatchApp({ cameras }: SpeedwatchAppProps) {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(
    null
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  
  const isMobile = useIsMobile();
  
  const locationOptions = useMemo(() => ({
    enableHighAccuracy: true,
  }), []);

  const location = useGeolocation(locationOptions);

  const handleMarkerClick = (camera: CameraType) => {
    setSelectedCamera(camera);
  };
  
  const handleCameraSelect = (camera: CameraType) => {
    setSelectedCamera(camera);
    if (isMobile) {
        setMobileSheetOpen(false);
    }
  }

  const center = useMemo(() => {
    if (location.latitude && location.longitude) {
      return { lat: location.latitude, lng: location.longitude };
    }
    return { lat: -41.2865, lng: 174.7762 }; // Default to Wellington, NZ
  }, [location.latitude, location.longitude]);

  if (typeof isMobile === 'undefined') {
    return <SpeedwatchAppSkeleton />;
  }
  
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-background">
      {isMobile ? (
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <MapControl position={ControlPosition.TOP_LEFT}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="m-4">
                  <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>
          </MapControl>
          <SheetContent side="left" className="p-0 w-[300px] flex flex-col" onOpenAutoFocus={(e) => e.preventDefault()}>
            <SheetHeader className="p-4 border-b">
              <SheetTitle>SpeedWatch NZ</SheetTitle>
            </SheetHeader>
            <SidebarContent 
              isMobile={isMobile}
              selectedCamera={selectedCamera}
              userLocation={location}
              cameras={cameras}
              onCameraSelect={handleCameraSelect}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-[300px] border-r h-full shadow-md z-10 flex flex-col">
          <SidebarContent 
            isMobile={isMobile}
            selectedCamera={selectedCamera}
            userLocation={location}
            cameras={cameras}
            onCameraSelect={handleCameraSelect}
          />
        </div>
      )}

      <main className="flex-1 h-full relative">
        <Map
          key={JSON.stringify(center)} // Force re-render on center change
          center={center}
          zoom={13}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"a3d7f7635c0cf699"}
          className="w-full h-full"
        >
          {cameras.map((camera) => (
            <CameraMarker
              key={camera.id}
              camera={camera}
              onClick={() => handleMarkerClick(camera)}
            />
          ))}
          <UserLocationMarker />
        </Map>
      </main>

      <CameraDetailsSheet
        camera={selectedCamera}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCamera(null);
        }}
      />
    </div>
  );
}
