
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { LocateFixed, X, Menu } from "lucide-react";
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
import { BottomNavigation } from "./bottom-navigation";

interface SpeedwatchAppProps {
  cameras: CameraType[];
}

export function SpeedwatchApp({ cameras }: SpeedwatchAppProps) {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(
    null
  );
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [destination, setDestination] = useState<google.maps.LatLng | null>(null);
  const [isCameraDrawerOpen, setIsCameraDrawerOpen] = useState(false);
  
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
        setIsCameraDrawerOpen(false);
    }
    setDestination(null); // Clear route when a new camera is selected from the list
  }

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location && map && window.google) {
      map.panTo(place.geometry.location);
      map.setZoom(14);
      setIsFollowingUser(false);
      
      const newDestination = new window.google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      setDestination(newDestination);

    } else {
        setDestination(null);
    }
    if (isMobile) {
        setIsCameraDrawerOpen(false);
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
    return new window.google.maps.LatLng(location.latitude, location.longitude);
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
    <div className="h-dvh w-screen grid grid-cols-1 md:grid-cols-12 relative overflow-hidden">
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
            <div className="m-4 md:hidden">
                 <Logo />
            </div>
          </MapControl>
        </Map>
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
            <div className="flex flex-col items-end m-4">
                {destination && (
                    <Button variant="outline" size="icon" className="mb-2 shadow-lg rounded-full" onClick={clearDirections} aria-label="Clear directions">
                        <X className="h-5 w-5"/>
                    </Button>
                )}
                <Button variant="outline" size="icon" className="shadow-lg rounded-full" onClick={handleRecenter} disabled={!location.latitude} aria-label="Recenter map">
                    <LocateFixed className="h-5 w-5"/>
                </Button>
            </div>
        </MapControl>
      </div>

      {isMobile ? (
        <BottomNavigation 
            selectedCamera={selectedCamera}
            userLocation={{ latitude: location.latitude, longitude: location.longitude }}
            onCameraListToggle={() => setIsCameraDrawerOpen(!isCameraDrawerOpen)}
            isCameraDrawerOpen={isCameraDrawerOpen}
        >
            {sidebar}
        </BottomNavigation>
      ) : (
        <aside className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col border-l bg-card shadow-lg">
          <div className="p-4 border-b">
              <Logo />
          </div>
          {sidebar}
        </aside>
      )}

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
