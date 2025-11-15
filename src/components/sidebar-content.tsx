
"use client";

import * as React from 'react';
import { Camera, Search, X } from 'lucide-react';

import type { Camera as CameraType } from '@/lib/traffic-api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { ReportDialog } from '@/components/report-dialog';
import { cn } from '@/lib/utils';
import { PlaceAutocomplete } from './place-autocomplete';


interface SidebarContentProps {
    cameras: CameraType[];
    selectedCamera: CameraType | null;
    userLocation: { latitude: number | null, longitude: number | null };
    onCameraSelect: (camera: CameraType) => void;
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
    isMobile: boolean;
}


export function SidebarContent({ cameras, selectedCamera, userLocation, onCameraSelect, onPlaceSelect, isMobile }: SidebarContentProps) {
    const [searchTerm, setSearchTerm] = React.useState('');
  
    const groupedCameras = React.useMemo(() => {
      return cameras.reduce((acc, camera) => {
        const region = camera.region || 'Unknown';
        if (!acc[region]) {
          acc[region] = [];
        }
        acc[region].push(camera);
        return acc;
      }, {} as Record<string, CameraType[]>);
    }, [cameras]);
  
    const filteredCameras = React.useMemo(() => {
      if (!searchTerm) return groupedCameras;
  
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered: Record<string, CameraType[]> = {};
  
      for (const region in groupedCameras) {
        const regionCameras = groupedCameras[region].filter(
          (camera) =>
            camera.name.toLowerCase().includes(lowercasedFilter) ||
            camera.description.toLowerCase().includes(lowercasedFilter)
        );
        if (regionCameras.length > 0) {
          filtered[region] = regionCameras;
        }
      }
      return filtered;
    }, [searchTerm, groupedCameras]);
  
    const regions = Object.keys(filteredCameras).sort();
  
    const defaultOpen = React.useMemo(() => {
        if(selectedCamera) {
            const region = cameras.find(c => c.id === selectedCamera.id)?.region;
            if(region) return [region];
        }
        return [];
    }, [selectedCamera, cameras]);

    const content = (
        <>
            <div className="p-4 border-b">
                <div className='space-y-2'>
                    <PlaceAutocomplete onPlaceSelect={onPlaceSelect} />
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            placeholder="Search cameras..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                        {searchTerm && (
                            <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setSearchTerm('')}
                            aria-label="Clear search"
                            >
                            <X className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <ScrollArea className="flex-1">
                <Accordion type="multiple" className="px-4" defaultValue={defaultOpen}>
                {regions.map((region) => (
                    <AccordionItem value={region} key={region}>
                    <AccordionTrigger>{region} ({filteredCameras[region].length})</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-1 -ml-4 -mr-4">
                        {filteredCameras[region].map((camera) => (
                            <Button
                            key={camera.id}
                            variant="ghost"
                            onClick={() => onCameraSelect(camera)}
                            className={cn(
                                "flex justify-start items-center gap-2 w-full h-auto py-2 px-4 rounded-none",
                                selectedCamera?.id === camera.id && "bg-accent text-accent-foreground"
                            )}
                            >
                                <Camera className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                                <span className="flex-1 text-left text-sm whitespace-normal">{camera.name}</span>
                            </Button>
                        ))}
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
                {regions.length === 0 && (
                    <div className="text-center text-muted-foreground p-8">
                        <p>No cameras found.</p>
                    </div>
                )}
            </ScrollArea>
           {!isMobile && (
             <>
                <Separator />
                <div className="p-4 flex items-center justify-between">
                    <ReportDialog 
                        selectedCamera={selectedCamera}
                        userLocation={userLocation}
                    />
                    <ThemeToggle />
                </div>
             </>
           )}
        </>
    );

    return content;
  }
