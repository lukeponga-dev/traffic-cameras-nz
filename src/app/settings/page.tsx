
"use client";

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
