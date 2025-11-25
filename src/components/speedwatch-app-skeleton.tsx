import { Skeleton } from "@/components/ui/skeleton";

export default function SpeedwatchAppSkeleton() {
  return (
    <div className="flex h-screen">
      <div className="w-80 border-r">
        <div className="p-4">
          <Skeleton className="h-8 w-1/2" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
