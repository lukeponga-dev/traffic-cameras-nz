
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  Marker,
} from "@vis.gl/react-google-maps";
import { Camera, Menu, User } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, List } from 'lucide-react';
import { Badge } from './ui/badge';

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { ReportDialog } from "./report-dialog";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";


interface SpeedwatchAppProps {
  cameras: CameraType[];
}

const SidebarContent = ({ 
    selectedCamera,
    userLocation,
    cameras,
    onCameraSelect
  } : {
    selectedCamera: CameraType | null;
    userLocation: { latitude: number | null; longitude: number | null; };
    cameras: CameraType[];
    onCameraSelect: (camera: CameraType) => void;
  }) => (
    <>
      <Logo />
      <Separator />
      <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
      <TabsList className="m-4">
        <TabsTrigger value="info" className="w-full"><Info className="w-4 h-4 mr-2"/> Info</TabsTrigger>
        <TabsTrigger value="cameras" className="w-full"><List className="w-4 h-4 mr-2"/> Cameras</TabsTrigger>
      </TabsList>
      <TabsContent value="info" className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Your Location</p>
            <Badge variant="secondary">{userLocation.latitude && userLocation.longitude ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'Loading...'}</Badge>
        </div>
      </TabsContent>
      <TabsContent value="cameras" className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
            {cameras.map(camera => (
                <Button key={camera.id} variant={selectedCamera?.id === camera.id ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onCameraSelect(camera)}>
                    {camera.name}
                </Button>
            ))}
            </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
      <Separator />
      <div className="p-4 flex items-center justify-between">
        <ReportDialog
          selectedCamera={selectedCamera}
          userLocation={userLocation}
        />
        <ThemeToggle />
      </div>
    </>
  );

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
            <SheetHeader className="p-4">
                <SheetTitle className="sr-only">App Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent 
              selectedCamera={selectedCamera}
              userLocation={location}
              cameras={cameras}
              onCameraSelect={handleCameraSelect}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-[300px] border-r h-full shadow-md z-10 flex flex-col p-4">
          <SidebarContent 
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
          defaultCenter={center}
          defaultZoom={6}
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
          {location.latitude && location.longitude && (
            <Marker position={{ lat: location.latitude, lng: location.longitude }}>
              <div className="relative">
                <User className="h-6 w-6 text-white bg-blue-500 rounded-full p-1" />
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-25 animate-ping"></div>
              </div>
            </Marker>
          )}

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
