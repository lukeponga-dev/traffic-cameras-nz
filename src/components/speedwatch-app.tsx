
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { LocateFixed, X, PanelLeft, ListFilter } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarHeader, useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { SidebarContent } from "@/components/sidebar-content";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";
import { SpeedwatchAppSkeleton } from "./speedwatch-app-skeleton";
import { UserLocationMarker } from "./user-location-marker";
import { Directions } from "./directions";
import { Logo } from "@/components/logo";
import { BottomNavigation } from "./bottom-navigation";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { PlaceAutocomplete } from "./place-autocomplete";

function SpeedwatchAppInternal({ cameras }: SpeedwatchAppProps) {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [destination, setDestination] = useState<google.maps.LatLng | null>(null);
  const [cameraData, setCameraData] = useState<CameraType[]>(cameras);
  const [isCameraDrawerOpen, setIsCameraDrawerOpen] = useState(false);

  const map = useMap();
  const isMobile = useIsMobile();
  const location = useGeolocation({ enableHighAccuracy: true });
  const { isSidebarOpen, setSidebarOpen } = useSidebar();


  useEffect(() => {
    async function fetchCameras() {
      try {
        const res = await fetch("/api/cameras");
        if (!res.ok) throw new Error("Failed to fetch cameras");
        const data = await res.json();
        setCameraData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCameras();
  }, []);

  const handleMarkerClick = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
    if(isMobile) {
      setIsCameraDrawerOpen(false);
    }
  };

  const handleCameraSelect = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
    setDestination(null);
    if (isMobile) {
      setSidebarOpen(false);
      setIsCameraDrawerOpen(false);
    }
  };
  
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
  }, [map]);


  const handleGetDirections = (camera: CameraType) => {
    if (window.google && window.google.maps && window.google.maps.LatLng) {
      setDestination(new window.google.maps.LatLng(camera.latitude, camera.longitude));
    }
    setSelectedCamera(null);
  };

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
      map.panTo({ lat: location.latitude, lng: location.longitude });
      map.setZoom(14);
      setIsFollowingUser(true);
    }
  };

  const clearDirections = () => {
    setDestination(null);
  };

  const origin = useMemo(() => {
    if (!location.latitude || !location.longitude || !window.google || !window.google.maps || !window.google.maps.LatLng)
      return null;
    return new window.google.maps.LatLng(location.latitude, location.longitude);
  }, [location.latitude, location.longitude]);

  if (isMobile === undefined) {
    return <SpeedwatchAppSkeleton />;
  }

  return (
    <div className="h-dvh w-screen relative overflow-hidden bg-background">
      <div className="h-dvh w-full relative flex">
         <Sidebar>
            <VisuallyHidden.Root>
                <DialogTitle>Navigation Sidebar</DialogTitle>
                <DialogDescription>Main navigation and camera list.</DialogDescription>
            </VisuallyHidden.Root>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent 
                cameras={cameraData}
                selectedCamera={selectedCamera}
                onCameraSelect={handleCameraSelect}
                isMobile={isMobile}
                userLocation={{ latitude: location.latitude, longitude: location.longitude }}
            />
        </Sidebar>
        <main className="flex-1 h-dvh w-full relative">
            <Map
            defaultCenter={{ lat: -41.2865, lng: 174.7762 }}
            defaultZoom={6}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            mapId={"a3d7f7635c0cf699"}
            className="w-full h-full"
            onDrag={onMapInteraction}
            onZoomChanged={onMapInteraction}
            onBoundsChanged={onMapInteraction}
            >
            {cameraData.map((camera) => (
                <CameraMarker
                key={camera.id}
                camera={camera}
                onClick={() => handleMarkerClick(camera)}
                />
            ))}
            <UserLocationMarker />
            {origin && destination && (
                <Directions origin={origin} destination={destination} />
            )}
            </Map>
            
            <MapControl position={ControlPosition.TOP_LEFT}>
            <div className="m-2 md:m-4 flex items-center gap-2">
                <div className="md:hidden bg-card/80 backdrop-blur-sm rounded-lg shadow-md border">
                    <SidebarTrigger/>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 shadow-md border">
                
                <div className="hidden md:flex items-center gap-2">
                    <Logo />
                    <Separator orientation="vertical" className="h-6" />
                </div>
                <div className="flex gap-2">
                    <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
                    <Button variant="outline" size="icon">
                    <ListFilter className="h-4 w-4"/>
                    </Button>
                </div>
                </div>
                
            </div>
            </MapControl>

            <MapControl position={ControlPosition.RIGHT_BOTTOM}>
            <div className="m-2 md:m-4 flex flex-col items-center gap-2">
                {destination && (
                <Button variant="secondary" size="icon" className="shadow-lg" onClick={clearDirections} aria-label="Clear directions">
                    <X className="h-5 w-5" />
                </Button>
                )}
                <Button variant="secondary" size="icon" className="shadow-lg" onClick={handleRecenter} disabled={!location.latitude} aria-label="Recenter map">
                <LocateFixed className="h-5 w-5" />
                </Button>
            </div>
            </MapControl>

            {isMobile && <BottomNavigation onCameraListToggle={() => setIsCameraDrawerOpen(true)} />}
        </main>
      </div>

       <Sheet open={isCameraDrawerOpen} onOpenChange={setIsCameraDrawerOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-sm flex flex-col p-0">
            <VisuallyHidden.Root>
                <DialogTitle>Cameras</DialogTitle>
                <DialogDescription>A list of speed cameras by region.</DialogDescription>
            </VisuallyHidden.Root>
            <SheetHeader className="p-4 border-b">
                <SheetTitle>Cameras</SheetTitle>
            </SheetHeader>
            <SidebarContent 
                cameras={cameraData}
                selectedCamera={selectedCamera}
                onCameraSelect={handleCameraSelect}
                isMobile={true}
                userLocation={{ latitude: location.latitude, longitude: location.longitude }}
            />
        </SheetContent>
      </Sheet>

      <CameraDetailsSheet
        camera={selectedCamera}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCamera(null);
        }}
        onGetDirections={handleGetDirections}
        userLocation={{ latitude: location.latitude, longitude: location.longitude }}
      />
    </div>
  );
}

interface SpeedwatchAppProps {
  cameras: CameraType[];
}

export function SpeedwatchApp(props: SpeedwatchAppProps) {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <SpeedwatchAppInternal {...props} />
    </SidebarProvider>
  );
}
