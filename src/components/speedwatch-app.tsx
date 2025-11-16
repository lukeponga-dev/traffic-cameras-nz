
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { LocateFixed, X, Menu, Flag, Bell, Settings, List } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from 'next/link';

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { SidebarContent as AppSidebarContent } from "@/components/sidebar-content";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";
import { SpeedwatchAppSkeleton } from "./speedwatch-app-skeleton";
import { UserLocationMarker } from "./user-location-marker";
import { Directions } from "./directions";
import { Logo } from "@/components/logo";
import { ReportDialog } from "./report-dialog";
import { usePathname } from "next/navigation";


interface SpeedwatchAppProps {
  cameras: CameraType[];
}

function SpeedwatchAppInternal({ cameras }: SpeedwatchAppProps) {
  const { open: isSidebarOpen } = useSidebar();
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(
    null
  );
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [destination, setDestination] = useState<google.maps.LatLng | null>(null);
  const [cameraData, setCameraData] = useState<CameraType[]>(cameras);

  const map = useMap();
  const isMobile = useIsMobile();
  const location = useGeolocation({ enableHighAccuracy: true });

  // Fetch latest camera data on mount
  useEffect(() => {
    async function fetchCameras() {
        try {
            const res = await fetch('/api/cameras');
            if (!res.ok) throw new Error('Failed to fetch cameras');
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
  };
  
  const handleCameraSelect = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
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
  }, [map]);

  const handleGetDirections = (camera: CameraType) => {
     if (window.google && window.google.maps && window.google.maps.LatLng) {
        setDestination(new window.google.maps.LatLng(camera.latitude, camera.longitude));
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
    if (!location.latitude || !location.longitude || !window.google || !window.google.maps || !window.google.maps.LatLng)
      return null;
    return new window.google.maps.LatLng(
      location.latitude,
      location.longitude
    );
  }, [location.latitude, location.longitude]);


  if (isMobile === undefined) {
    return <SpeedwatchAppSkeleton />;
  }

  return (
    <div className="h-dvh w-screen relative overflow-hidden">
        <Sidebar>
            <VisuallyHidden.Root>
                <DialogTitle>Navigation Sidebar</DialogTitle>
                <DialogDescription>Main navigation and camera list.</DialogDescription>
            </VisuallyHidden.Root>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <AppSidebarContent 
                cameras={cameraData}
                selectedCamera={selectedCamera}
                userLocation={{ latitude: location.latitude, longitude: location.longitude }}
                onCameraSelect={handleCameraSelect}
                onPlaceSelect={handlePlaceSelect}
                isMobile={isMobile}
            />
        </Sidebar>
        <SidebarInset>
            <div className="h-dvh w-full relative">
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
                    <Directions
                        origin={origin}
                        destination={destination}
                    />
                    )}
                </Map>
                <MapControl position={ControlPosition.TOP_LEFT}>
                    <div className="m-2 md:m-4">
                        <div className="md:hidden">
                            <Logo />
                        </div>
                        <div className="hidden md:block">
                            <SidebarTrigger />
                        </div>
                    </div>
                </MapControl>
                <MapControl position={ControlPosition.RIGHT_BOTTOM}>
                    <div className="flex flex-col items-end m-2 md:m-4">
                        {destination && (
                            <Button variant="secondary" size="icon" className="mb-2 shadow-lg rounded-full" onClick={clearDirections} aria-label="Clear directions">
                                <X className="h-5 w-5"/>
                            </Button>
                        )}
                        <Button variant="secondary" size="icon" className="shadow-lg rounded-full" onClick={handleRecenter} disabled={!location.latitude} aria-label="Recenter map">
                            <LocateFixed className="h-5 w-5"/>
                        </Button>
                    </div>
                </MapControl>
                 {isMobile && (
                    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-sm border-t z-20 md:hidden">
                        <div className="flex justify-around items-center h-full">
                            <SidebarTrigger className="flex-1 flex-col h-full space-y-1 rounded-none">
                                <List className="w-5 h-5" />
                                <span className="text-xs font-medium">Cameras</span>
                            </SidebarTrigger>
                            <Button asChild variant="ghost" className="flex-1 flex-col h-full space-y-1 rounded-none">
                                <Link href="/alerts">
                                    <Bell className="w-5 h-5" />
                                    <span className="text-xs font-medium">Alerts</span>
                                </Link>
                            </Button>

                            <ReportDialog 
                                selectedCamera={selectedCamera} 
                                userLocation={{ latitude: location.latitude, longitude: location.longitude}}
                            >
                                <Button variant="ghost" className="flex-1 flex-col h-full space-y-1 rounded-none">
                                    <Flag className="w-5 h-5" />
                                    <span className="text-xs font-medium">Report</span>
                                </Button>
                            </ReportDialog>
                            
                            <Button asChild variant="ghost" className={cn(
                                "flex-1 flex-col h-full space-y-1 rounded-none",
                                usePathname() === '/settings' && "text-primary"
                                )}>
                                <Link href="/settings">
                                    <Settings className="w-5 h-5" />
                                    <span className="text-xs font-medium">Settings</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                 )}
            </div>
        </SidebarInset>
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

export function SpeedwatchApp(props: SpeedwatchAppProps) {
    return (
        <SidebarProvider>
            <SpeedwatchAppInternal {...props} />
        </SidebarProvider>
    )
}
