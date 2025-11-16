
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { LocateFixed, X } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from 'next/link';

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
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


/**
 * Main application component for SpeedWatch.
 * This component orchestrates the map, camera markers, sidebar, and user location tracking.
 * It's wrapped in a SidebarProvider to manage the state of the sidebar.
 * @param {SpeedwatchAppProps} props - The props for the component.
 * @param {CameraType[]} props.cameras - An array of camera data to display on the map.
 */
function SpeedwatchAppInternal({ cameras }: SpeedwatchAppProps) {
  const { open: isSidebarOpen, setOpen: setSidebarOpen, openMobile, setOpenMobile } = useSidebar();
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(
    null
  );
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [destination, setDestination] = useState<google.maps.LatLng | null>(null);
  const [cameraData, setCameraData] = useState<CameraType[]>(cameras);

  const map = useMap();
  const isMobile = useIsMobile();
  const location = useGeolocation({ enableHighAccuracy: true });

  // Fetch latest camera data on mount from a local API route to avoid potential CORS issues.
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

  /**
   * Handles clicking on a camera marker on the map.
   * Sets the selected camera and stops following the user's location.
   * @param {CameraType} camera - The camera that was clicked.
   */
  const handleMarkerClick = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
  };
  
  /**
   * Handles selecting a camera from the sidebar list.
   * Sets the selected camera, stops following the user, and clears any active route.
   * @param {CameraType} camera - The camera that was selected.
   */
  const handleCameraSelect = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
    setDestination(null); // Clear route when a new camera is selected from the list
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  /**
   * Handles selecting a place from the autocomplete search results.
   * Pans the map to the selected place and sets it as the destination for directions.
   * @param {google.maps.places.PlaceResult | null} place - The selected place.
   */
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

  /**
   * Sets the destination for directions to a specific camera's location.
   * @param {CameraType} camera - The camera to get directions to.
   */
  const handleGetDirections = (camera: CameraType) => {
     if (window.google && window.google.maps && window.google.maps.LatLng) {
        setDestination(new window.google.maps.LatLng(camera.latitude, camera.longitude));
     }
    setSelectedCamera(null); // Close the details sheet
  }

  // Effect to pan the map to the user's location when following is enabled.
  useEffect(() => {
    if (isFollowingUser && map && location.latitude && location.longitude) {
      map.panTo({ lat: location.latitude, lng: location.longitude });
    }
  }, [isFollowingUser, location.latitude, location.longitude, map]);

  // Effect to pan the map to the selected camera.
  useEffect(() => {
    if (selectedCamera && map) {
        map.panTo({ lat: selectedCamera.latitude, lng: selectedCamera.longitude });
        map.setZoom(14);
    }
  }, [selectedCamera, map]);

  /**
   * Callback to disable user following when the user interacts with the map.
   */
  const onMapInteraction = useCallback(() => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
    }
  }, [isFollowingUser]);

  /**
   * Recenter the map on the user's current location and re-enables following.
   */
  const handleRecenter = () => {
    if (location.latitude && location.longitude && map) {
        map.panTo({lat: location.latitude, lng: location.longitude});
        map.setZoom(14);
        setIsFollowingUser(true);
    }
  }

  /**
   * Clears the current directions route from the map.
   */
  const clearDirections = () => {
    setDestination(null);
  }

  /**
   * Memoized origin point for directions, based on the user's location.
   */
  const origin = useMemo(() => {
    if (!location.latitude || !location.longitude || !window.google || !window.google.maps || !window.google.maps.LatLng)
      return null;
    return new window.google.maps.LatLng(
      location.latitude,
      location.longitude
    );
  }, [location.latitude, location.longitude]);


  // Show a skeleton loader until we can determine if the user is on a mobile device.
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
            <SidebarContent 
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
                    <div className="m-2 md:m-4 flex flex-col items-center gap-2">
                        {destination && (
                            <Button variant="secondary" size="icon" className="shadow-lg" onClick={clearDirections} aria-label="Clear directions">
                                <X className="h-5 w-5"/>
                            </Button>
                        )}
                        <Button variant="secondary" size="icon" className="shadow-lg" onClick={handleRecenter} disabled={!location.latitude} aria-label="Recenter map">
                            <LocateFixed className="h-5 w-5"/>
                        </Button>
                    </div>
                </MapControl>
                 {isMobile && (
                   <BottomNavigation 
                        selectedCamera={selectedCamera} 
                        userLocation={{ latitude: location.latitude, longitude: location.longitude }}
                   />
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

interface SpeedwatchAppProps {
    cameras: CameraType[];
}

/**
 * A wrapper component that provides the Sidebar context to the main application.
 * @param {SpeedwatchAppProps} props - The props for the component.
 */
export function SpeedwatchApp(props: SpeedwatchAppProps) {
    return (
        <SidebarProvider>
            <SpeedwatchAppInternal {...props} />
        </SidebarProvider>
    )
}
