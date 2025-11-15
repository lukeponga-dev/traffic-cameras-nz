
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { Menu, LocateFixed, X } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SidebarContent } from "@/components/sidebar-content";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";
import { SpeedwatchAppSkeleton } from "./speedwatch-app-skeleton";
import { UserLocationMarker } from "./user-location-marker";
import { Directions } from "./directions";
import { Logo } from "@/components/logo";


interface SpeedwatchAppProps {
  cameras: CameraType[];
}

export function SpeedwatchApp({ cameras }: SpeedwatchAppProps) {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(
    null
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [destination, setDestination] = useState<google.maps.LatLng | null>(null);
  
  const map = useMap();
  
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
    setDestination(null); // Clear route when a new camera is selected from the list
  }

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location && map) {
      map.panTo(place.geometry.location);
      map.setZoom(14);
      setIsFollowingUser(false);
      if (window.google) {
        setDestination(place.geometry.location);
      }
    } else {
        setDestination(null);
    }
    if (isMobile) {
      setMobileSheetOpen(false);
    }
  }, [isMobile, map]);

  const handleGetDirections = (camera: CameraType) => {
     if (window.google) {
        setDestination(new google.maps.LatLng(camera.latitude, camera.longitude));
     }
    setSelectedCamera(null); // Close the details sheet
  }

  useEffect(() => {
    if (isFollowingUser && map && location.latitude && location.longitude) {
      map.panTo({ lat: location.latitude, lng: location.longitude });
    }
  }, [isFollowingUser, location.latitude, location.longitude, map]);

  useEffect(() => {
    if (selectedCamera && map) {
        map.panTo({ lat: selectedCamera.latitude, lng: selectedCamera.longitude });
        map.setZoom(14);
    }
  }, [selectedCamera, map]);


  const onMapInteraction = useCallback(() => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
    }
  }, [isFollowingUser]);

  const handleRecenter = () => {
    if (location.latitude && location.longitude && map) {
        map.panTo({lat: location.latitude, lng: location.longitude});
        map.setZoom(14);
        setIsFollowingUser(true);
    }
  }

  const clearDirections = () => {
    setDestination(null);
  }

  const origin = useMemo(() => {
    if (!location.latitude || !location.longitude || !window.google) return null;
    return new google.maps.LatLng(location.latitude, location.longitude);
  }, [location.latitude, location.longitude]);


  if (isMobile === undefined) {
    return <SpeedwatchAppSkeleton />;
  }

  const sidebar = (
    <SidebarContent 
        cameras={cameras}
        selectedCamera={selectedCamera}
        userLocation={{ latitude: location.latitude, longitude: location.longitude }}
        onCameraSelect={handleCameraSelect}
        onPlaceSelect={handlePlaceSelect}
        isMobile={isMobile}
    />
  );

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-12">
      <div className="md:col-span-8 lg:col-span-9 w-full h-full relative">
        <Map
          defaultCenter={{ lat: -41.2865, lng: 174.7762 }}
          defaultZoom={6}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"a3d7f7635c0cf699"}
          className="w-full h-full"
          onDrag={onMapInteraction}
          onZoomChanged={onMapInteraction}
        >
          {cameras.map((camera) => (
            <CameraMarker
              key={camera.id}
              camera={camera}
              onClick={() => handleMarkerClick(camera)}
            />
          ))}
          <UserLocationMarker />
          {origin && destination && (
            <Directions
                origin={origin}
                destination={destination}
            />
          )}
           <MapControl position={ControlPosition.TOP_LEFT}>
            <div className="m-2 md:hidden">
                 <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[300px] flex flex-col" onOpenAutoFocus={(e) => e.preventDefault()}>
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle>
                                <Logo />
                            </SheetTitle>
                        </SheetHeader>
                        {sidebar}
                    </SheetContent>
                </Sheet>
            </div>
          </MapControl>
        </Map>
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
            {destination && (
                 <Button variant="outline" size="icon" className="m-4 mb-2" onClick={clearDirections}>
                    <X className="h-4 w-4"/>
                </Button>
            )}
            <Button variant="outline" size="icon" className="m-4 mt-0" onClick={handleRecenter} disabled={!location.latitude}>
                <LocateFixed className="h-4 w-4"/>
            </Button>
        </MapControl>
      </div>

      <div className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col border-l bg-background">
        <div className="p-4 border-b">
            <Logo />
        </div>
        {sidebar}
      </div>

      <CameraDetailsSheet
        camera={selectedCamera}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCamera(null);
        }}
        onGetDirections={handleGetDirections}
      />
    </div>
  );
}
