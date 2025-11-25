
"use client";

<<<<<<< HEAD
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BarChart, ChevronRight, User, Palette, Bell, Shield } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils";

const data = [
    { name: "Mon", total: Math.floor(Math.random() * 20) + 5 },
    { name: "Tue", total: Math.floor(Math.random() * 20) + 5 },
    { name: "Wed", total: Math.floor(Math.random() * 20) + 5 },
    { name: "Thu", total: Math.floor(Math.random() * 20) + 5 },
    { name: "Fri", total: Math.floor(Math.random() * 20) + 5 },
    { name: "Sat", total: Math.floor(Math.random() * 20) + 5 },
    { name: "Sun", total: Math.floor(Math.random() * 20) + 5 },
]

export default function SettingsPage() {
  const buttonClasses = "w-full justify-between h-auto p-3 text-left flex items-center gap-3 rounded-lg hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Alerts</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
           <ResponsiveContainer width="100%" height={150}>
                <RechartsBarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
          <CardContent className="p-2">
              <div className={cn(buttonClasses)}>
                  <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span>Account</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className={cn(buttonClasses)}>
                  <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-muted-foreground" />
                      <span>Theme</span>
                  </div>
                  <ThemeToggle />
              </div>
               <div className={cn(buttonClasses)}>
                  <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <span>Notifications</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
               <div className={cn(buttonClasses)}>
                  <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <span>Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
          </CardContent>
      </Card>
=======
import { ChevronRight, User, Palette, Bell, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { BottomNavigation } from '@/components/bottom-navigation';

export default function SettingsPage() {
    const router = useRouter();

  return (
    <div className="bg-background min-h-screen">
        <header className="p-4 border-b sticky top-0 bg-background z-10">
            <h1 className="text-xl font-bold text-center">Settings</h1>
        </header>
        <main className="p-4">
            <div className="rounded-lg border bg-card text-card-foreground">
                <SettingsItem icon={User} label="Account" onClick={() => router.push('/settings/account')} />
                <Separator />
                <SettingsItem icon={Palette} label="Theme" onClick={() => router.push('/settings/theme')}/>
                <Separator />
                <SettingsItem icon={Bell} label="Notifications" onClick={() => router.push('/settings/notifications')}/>
                <Separator />
                <SettingsItem icon={ShieldCheck} label="Privacy Policy" onClick={() => router.push('/settings/privacy')}/>
            </div>
        </main>
        <BottomNavigation />
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
    </div>
  );
}

function SettingsItem({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) {
  return (
    <button className="w-full flex items-center p-4 text-left" onClick={onClick}>
      <Icon className="h-5 w-5 mr-4 text-muted-foreground" />
      <span className="font-semibold flex-grow">{label}</span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}
