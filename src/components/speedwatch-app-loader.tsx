
'use client';

import dynamic from 'next/dynamic';
import type { Camera } from '@/lib/traffic-api';
import { SpeedwatchAppSkeleton } from '@/components/speedwatch-app-skeleton';

const SpeedwatchApp = dynamic(() => import('@/components/speedwatch-app').then(mod => mod.SpeedwatchApp), {
    ssr: false,
    loading: () => <SpeedwatchAppSkeleton />
});

interface SpeedwatchAppLoaderProps {
    cameras: Camera[];
}

export function SpeedwatchAppLoader({ cameras }: SpeedwatchAppLoaderProps) {
    if (typeof window === 'undefined') {
        return <SpeedwatchAppSkeleton />;
    }
    return <SpeedwatchApp cameras={cameras} />;
}
