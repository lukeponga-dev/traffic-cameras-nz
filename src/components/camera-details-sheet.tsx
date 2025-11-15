
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import type { Camera } from "@/lib/traffic-api";
import { Separator } from "@/components/ui/separator";
import { MapPin, Compass, Route } from "lucide-react";
import Image from 'next/image';
import { Button } from "./ui/button";

interface CameraDetailsSheetProps {
  camera: Camera | null;
  onOpenChange: (open: boolean) => void;
  onGetDirections: (camera: Camera) => void;
}

export function CameraDetailsSheet({
  camera,
  onOpenChange,
  onGetDirections,
}: CameraDetailsSheetProps) {
  return (
    <Sheet open={!!camera} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col" side={camera ? "bottom" : "right"}>
        {camera && (
          <>
            <div className="relative h-48 w-full">
                {camera.viewUrl ? (
                    <Image
                        src={camera.viewUrl}
                        alt={`Street view of ${camera.name}`}
                        data-ai-hint="road street"
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-muted-foreground"/>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            <SheetHeader className="p-6 text-left -mt-16 z-10">
              <SheetTitle className="text-2xl font-bold">{camera.name}</SheetTitle>
              {camera.description && (
                <SheetDescription>{camera.description}</SheetDescription>
              )}
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary"/>
                    <span>Coordinates</span>
                </div>
                <div className="font-mono text-xs text-right">
                    {camera.latitude.toFixed(4)}, <br/> {camera.longitude.toFixed(4)}
                </div>

                <div className="col-span-2"><Separator/></div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Compass className="w-5 h-5 text-primary"/>
                    <span>Direction</span>
                </div>
                <div className="font-semibold text-right">{camera.direction}</div>
                
              </div>
            </div>
             <SheetFooter className="p-4 border-t mt-auto">
                <Button onClick={() => onGetDirections(camera)} className="w-full">
                    <Route className="mr-2 h-4 w-4" />
                    Get Directions
                </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
