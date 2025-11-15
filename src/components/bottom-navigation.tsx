
"use client";

import * as React from "react";
import { List, Flag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ReportDialog } from "./report-dialog";
import type { Camera } from "@/lib/traffic-api";
import { Separator } from "./ui/separator";

interface BottomNavigationProps {
  children: React.ReactNode;
  selectedCamera: Camera | null;
  userLocation: { latitude: number | null; longitude: number | null };
  onCameraListToggle: () => void;
  isCameraDrawerOpen: boolean;
}

export function BottomNavigation({ 
    children, 
    selectedCamera, 
    userLocation,
    onCameraListToggle,
    isCameraDrawerOpen
}: BottomNavigationProps) {
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-10 md:hidden">
        <div className="flex justify-around items-center h-full">
          <Button variant="ghost" className="flex-1 flex-col h-full" onClick={onCameraListToggle}>
            <List className="w-5 h-5" />
            <span className="text-xs">Cameras</span>
          </Button>

          <ReportDialog 
            selectedCamera={selectedCamera} 
            userLocation={userLocation}
          >
             <Button variant="ghost" className="flex-1 flex-col h-full">
                <Flag className="w-5 h-5" />
                <span className="text-xs">Report</span>
            </Button>
          </ReportDialog>
        </div>
      </div>
      
      <Sheet open={isCameraDrawerOpen} onOpenChange={onCameraListToggle}>
        <SheetContent side="bottom" className="h-[80dvh] flex flex-col p-0">
            <SheetHeader className="p-4">
                <SheetTitle>Cameras</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="flex-1 min-h-0">
                {children}
            </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
