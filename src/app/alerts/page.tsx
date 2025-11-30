"use client";

<<<<<<< HEAD
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
=======
import { ArrowLeft, Star, Bell, Wind, Waves } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f

export default function AlertsPage() {
  const router = useRouter();

  return (
    <div className="bg-background h-screen">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-semibold ml-4">Alerts</h1>
      </div>
<<<<<<< HEAD

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

=======
      <div className="p-4">
        <Card>
            <Image
              src="https://images.unsplash.com/photo-1549492423-400259a565a5?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="SH1 Hamilton"
              width={400}
              height={200}
              className="rounded-t-lg object-cover w-full h-32"
            />
          <CardHeader>
            <CardTitle>SH1 Hamilton</CardTitle>
            <p className="text-sm text-muted-foreground">Status Active 2-min ago</p>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Star className="mr-2 h-4 w-4" />
              Add to Favorites
            </Button>
            <Separator className="my-4" />
            <h3 className="font-semibold mb-4">Alerts update</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 rounded-full mr-4">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <p>Speed Camera near SH1 Huntly</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-2 rounded-full mr-4">
                    <Wind className="h-5 w-5 text-white" />
                  </div>
                  <p>Congestion reported on Tirau Road</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-red-500 p-2 rounded-full mr-4">
                    <Waves className="h-5 w-5 text-white" />
                  </div>
                  <p>Hazard (Flooding) Waitawheta</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
    </div>
  );
}
