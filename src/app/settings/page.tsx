
"use client";

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
              <Button variant="ghost" className="w-full justify-between h-auto p-3">
                  <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span>Account</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
               <Button variant="ghost" className="w-full justify-between h-auto p-3">
                  <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-muted-foreground" />
                      <span>Theme</span>
                  </div>
                  <ThemeToggle />
              </Button>
               <Button variant="ghost" className="w-full justify-between h-auto p-3">
                  <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <span>Notifications</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
               <Button variant="ghost" className="w-full justify-between h-auto p-3">
                  <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <span>Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
          </CardContent>
      </Card>
    </div>
  );
}
