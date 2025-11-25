
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, Flag, Settings } from "lucide-react";

<<<<<<< HEAD
import * as React from "react";
import { Map, BarChart2, Bell, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
=======
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
import { cn } from "@/lib/utils";
import { ReportDialog } from "./report-dialog";
import { useGeolocation } from "@/hooks/use-geolocation";

<<<<<<< HEAD
interface BottomNavigationProps {}

export function BottomNavigation({}: BottomNavigationProps) {
=======
const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/feed", icon: MessageSquare, label: "Live Feed" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNavigation() {
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
  const pathname = usePathname();
  const location = useGeolocation();

  return (
<<<<<<< HEAD
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-20 md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "flex-1 flex-col h-full space-y-1 rounded-none",
              pathname === item.href && "text-primary bg-primary/10"
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
=======
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-sm border-t md:relative md:h-auto md:border-t-0 md:bg-transparent md:backdrop-blur-none">
        <div className="flex justify-around items-center h-full md:flex-col md:justify-start md:items-start md:h-auto md:space-y-4">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={label} href={href} className={cn("flex flex-col items-center justify-center text-xs font-medium md:flex-row md:items-center md:gap-2 md:text-sm", pathname === href ? "text-primary" : "text-muted-foreground")}>
            <Icon className="h-5 w-5" />
            <span className="hidden md:inline-block">{label}</span>
          </Link>
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
        ))}
        <ReportDialog selectedCamera={null} userLocation={location}>
          <button className={cn("flex flex-col items-center justify-center text-xs font-medium md:flex-row md:items-center md:gap-2 md:text-sm text-muted-foreground", "report-button")}>
            <Flag className="h-5 w-5" />
            <span className="hidden md:inline-block">Report</span>
          </button>
        </ReportDialog>
      </div>
    </div>
  );
}
