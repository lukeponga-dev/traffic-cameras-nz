
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, ToggleRight } from "lucide-react";

export default function AlertsPage() {
  return (
     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose which alerts you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                    <p className="font-medium">Speed Cameras</p>
                    <p className="text-sm text-muted-foreground">Alerts for fixed and mobile speed cameras.</p>
                </div>
                <ToggleRight className="w-12 h-8 text-primary" />
            </div>
             <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                    <p className="font-medium">Traffic Congestion</p>
                    <p className="text-sm text-muted-foreground">Notifications about heavy traffic on your route.</p>
                </div>
                <ToggleRight className="w-12 h-8 text-primary" />
            </div>
             <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                    <p className="font-medium">Road Hazards</p>
                    <p className="text-sm text-muted-foreground">Alerts for accidents, roadworks, and other hazards.</p>
                </div>
                <ToggleRight className="w-12 h-8 text-primary" />
            </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            A list of your most recent notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <Bell className="w-16 h-16 text-muted-foreground/50" />
            <p className="mt-4 font-medium">No alerts yet</p>
            <p className="text-sm text-muted-foreground">Your recent notifications will appear here.</p>
        </CardContent>
      </Card>

    </div>
  );
}
