"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, User, Palette, Bell, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const data = [
  { name: 'Mon', alerts: 4 },
  { name: 'Tue', alerts: 3 },
  { name: 'Wed', alerts: 5 },
  { name: 'Thu', alerts: 2 },
  { name: 'Fri', alerts: 6 },
  { name: 'Sat', alerts: 4 },
  { name: 'Sun', alerts: 7 },
];

export default function SettingsPage() {
    const router = useRouter();

  return (
    <div className="bg-background h-screen">
        <div className="p-4">
            <Card>
                <CardHeader>
                <CardTitle className="text-center">Weekly Alerts Summary</CardTitle>
                </CardHeader>
                <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="alerts" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardContent className="p-0">
                    <Button variant="ghost" className="w-full justify-between p-4">
                        <span className="font-semibold">Week Alerts</span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardContent className="p-0">
                    <div className="space-y-2">
                        <SettingsItem icon={User} label="Account" onClick={() => router.push('/settings/account')} />
                        <Separator />
                        <SettingsItem icon={Palette} label="Theme" onClick={() => router.push('/settings/theme')}/>
                        <Separator />
                        <SettingsItem icon={Bell} label="Notifications" onClick={() => router.push('/settings/notifications')}/>
                        <Separator />
                        <SettingsItem icon={ShieldCheck} label="Privacy Policy" onClick={() => router.push('/settings/privacy')}/>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

function SettingsItem({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) {
  return (
    <Button variant="ghost" className="w-full justify-start p-4" onClick={onClick}>
      <Icon className="h-5 w-5 mr-4 text-muted-foreground" />
      <span className="font-semibold">{label}</span>
    </Button>
  );
}
