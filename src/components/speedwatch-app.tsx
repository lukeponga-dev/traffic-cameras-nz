import { ReactNode } from 'react';

interface SpeedWatchAppProps {
  children: ReactNode;
}

export default function SpeedWatchApp({ children }: SpeedWatchAppProps) {
  return (
    <div className="flex h-screen">
      {children}
    </div>
  );
}
