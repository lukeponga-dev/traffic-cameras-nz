
import { LoaderCircle } from "lucide-react";

export function SpeedwatchAppSkeleton() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
            <div className="flex items-center gap-2">
                <LoaderCircle className="w-6 h-6 animate-spin"/>
                <p>Loading SpeedWatch...</p>
            </div>
        </div>
    );
}
