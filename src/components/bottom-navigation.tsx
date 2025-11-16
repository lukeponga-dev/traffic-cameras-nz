
"use client";

import * as React from "react";
import { Map, BarChart2, Bell, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/", label: "Map", icon: Map },
    { href: "/stats", label: "Stats", icon: BarChart2 },
    { href: "/alerts", label: "Alerts", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-20 md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "flex-1 flex-col h-full space-y-1",
              pathname === item.href && "text-primary"
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
