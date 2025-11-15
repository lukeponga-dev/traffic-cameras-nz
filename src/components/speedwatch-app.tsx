
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { Menu, LocateFixed, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { SidebarContent } from "@/components/sidebar-content";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";
import { SpeedwatchAppSkeleton } from "./speedwatch-app-skeleton";
import { UserLocationMarker } from "./user-location-marker";
import { Directions } from "./directions";
import { PlaceAutocomplete } from "./place-autocomplete";


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
    setDestination(null); // Clear route when a new camera is selected from the list
  }

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location && mapRef.current) {
      mapRef.current.panTo(place.geometry.location);
      mapRef.current.setZoom(14);
      setIsFollowingUser(false);
      setDestination(place.geometry.location);
    } else {
        setDestination(null);
    }
    if (isMobile) {
      setMobileSheetOpen(false);
    }
  }, [isMobile]);

  const handleGetDirections = (camera: CameraType) => {
    setDestination(new google.maps.LatLng(camera.latitude, camera.longitude));
    setSelectedCamera(null); // Close the details sheet
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

  const clearDirections = () => {
    setDestination(null);
  }

  if (isMobile === undefined) {
    return <SpeedwatchAppSkeleton />;
  }
  
  const origin = location.latitude && location.longitude 
    ? new google.maps.LatLng(location.latitude, location.longitude) 
    : null;

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
              onPlaceSelect={handlePlaceSelect}
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
            onPlaceSelect={handlePlaceSelect}
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
          {origin && destination && (
            <Directions
                origin={origin}
                destination={destination}
            />
          )}
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
      </main>

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
