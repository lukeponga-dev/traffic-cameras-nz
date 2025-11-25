
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, Flag, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { ReportDialog } from "./report-dialog";
import { useGeolocation } from "@/hooks/use-geolocation";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/feed", icon: MessageSquare, label: "Live Feed" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const location = useGeolocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-sm border-t md:relative md:h-auto md:border-t-0 md:bg-transparent md:backdrop-blur-none">
        <div className="flex justify-around items-center h-full md:flex-col md:justify-start md:items-start md:h-auto md:space-y-4">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={label} href={href} className={cn("flex flex-col items-center justify-center text-xs font-medium md:flex-row md:items-center md:gap-2 md:text-sm", pathname === href ? "text-primary" : "text-muted-foreground")}>
            <Icon className="h-5 w-5" />
            <span className="hidden md:inline-block">{label}</span>
          </Link>
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
