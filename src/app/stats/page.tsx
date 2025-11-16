
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Stats</h2>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            An overview of alerts and contributions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <BarChart2 className="w-16 h-16 text-muted-foreground/50" />
            <p className="mt-4 font-medium">No activity data yet</p>
            <p className="text-sm text-muted-foreground">Your stats and history will appear here once you start using the app.</p>
        </CardContent>
      </Card>
    </div>
  );
}
