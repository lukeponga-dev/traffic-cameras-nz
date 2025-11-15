"use client";

import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { MapProvider } from './map-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MapProvider>{children}</MapProvider>
    </ThemeProvider>
  );
}
