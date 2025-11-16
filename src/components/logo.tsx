import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary p-2 rounded-lg shadow">
        <ShieldCheck className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className={cn("text-xl font-bold text-foreground font-headline tracking-tight", textClassName)}>
        SpeedWatch
      </h1>
    </div>
  );
}
