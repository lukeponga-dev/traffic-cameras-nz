
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Star, TrafficCone, AlertTriangle, Camera } from "lucide-react";
import Image from "next/image";

export default function AlertsPage() {
  return (
     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
      </div>

      <Card>
        <CardHeader className="p-4">
            <div className="relative h-40 w-full rounded-lg overflow-hidden">
                <Image src="https://picsum.photos/seed/hamilton/800/400" alt="SH1 Hamilton" layout="fill" objectFit="cover" data-ai-hint="road bridge" />
            </div>
             <div className="pt-4">
                <CardTitle>SH1 Hamilton</CardTitle>
                <CardDescription>Status: Active | 2-min ago</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
           <Button className="w-full">
                <Star className="mr-2 h-4 w-4" /> Add to Favorites
           </Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Alerts update</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-muted-foreground"/>
                    <span className="font-medium">Speed Camera</span>
                </div>
                <Switch defaultChecked={true} />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                    <TrafficCone className="w-5 h-5 text-muted-foreground"/>
                    <span className="font-medium">Congestion reported</span>
                </div>
                <Switch defaultChecked={true} />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-muted-foreground"/>
                    <span className="font-medium">Hazard (Flooding)</span>
                </div>
                <Switch defaultChecked={true} />
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
