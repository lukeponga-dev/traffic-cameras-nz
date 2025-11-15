
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { Menu, LocateFixed } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
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
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const isMobile = useIsMobile();
  
  const location = useGeolocation({ enableHighAccuracy: true });

  const handleMarkerClick = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
  };
  
  const handleCameraSelect = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
    if (isMobile) {
        setMobileSheetOpen(false);
    }
  }

  useEffect(() => {
    if (isFollowingUser && mapRef.current && location.latitude && location.longitude) {
      mapRef.current.panTo({ lat: location.latitude, lng: location.longitude });
    }
  }, [isFollowingUser, location.latitude, location.longitude]);

  useEffect(() => {
    if (selectedCamera && mapRef.current) {
        mapRef.current.panTo({ lat: selectedCamera.latitude, lng: selectedCamera.longitude });
        mapRef.current.setZoom(14);
    }
  }, [selectedCamera]);


  const onMapInteraction = useCallback(() => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
    }
  }, [isFollowingUser]);

  const handleRecenter = () => {
    if (location.latitude && location.longitude && mapRef.current) {
        mapRef.current.panTo({lat: location.latitude, lng: location.longitude});
        mapRef.current.setZoom(14);
        setIsFollowingUser(true);
    }
  }

  if (isMobile === undefined) {
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
          defaultCenter={{ lat: -41.2865, lng: 174.7762 }}
          defaultZoom={6}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"a3d7f7635c0cf699"}
          className="w-full h-full"
          onDrag={onMapInteraction}
          onZoomChanged={onMapInteraction}
          ref={mapRef}
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
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
            <Button variant="outline" size="icon" className="m-4" onClick={handleRecenter} disabled={!location.latitude}>
                <LocateFixed className="h-4 w-4"/>
            </Button>
        </MapControl>
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
