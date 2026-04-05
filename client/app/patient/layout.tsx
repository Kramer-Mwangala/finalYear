'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Home,
  LogOut,
  Menu,
  X,
  User,
  Calendar,
  Pill,
  Zap,
  Beaker,
} from 'lucide-react';
import api, { getAuthToken, setAuthToken, ApiError } from '@/lib/api';
import { initials } from '@/lib/dashboard-utils';
import { cn } from '@/lib/utils';

type ProfileUser = {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
};

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<ProfileUser | null>(null);

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/sign-in');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = (await api.users.profile()) as { user?: ProfileUser };
        if (!cancelled && res.user) setUser(res.user);
      } catch (e) {
        if (!cancelled && e instanceof ApiError && e.status === 401) {
          setAuthToken(null);
          router.replace('/sign-in');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleSignOut() {
    setAuthToken(null);
    router.push('/sign-in');
  }

  const menuItems = [
    { label: 'Dashboard', href: '/patient', icon: Home },
    { label: 'Profile', href: '/patient/profile', icon: User },
    { label: 'AI Analysis', href: '/patient/analysis', icon: Zap },
    { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { label: 'Pharmacy', href: '/patient/pharmacy', icon: Pill },
    { label: 'Labs', href: '/patient/labs', icon: Beaker },
  ];

  const displayName =
    user?.first_name || user?.last_name
      ? [user.first_name, user.last_name].filter(Boolean).join(' ')
      : user?.email ?? 'Patient';
  const monogram = initials(user?.first_name, user?.last_name);

  return (
    <div className="flex h-screen bg-white">
      <aside
        className={cn(
          sidebarOpen ? 'w-64' : 'w-0',
          'relative bg-slate-900 text-white transition-all duration-300 border-r border-border overflow-hidden flex flex-col min-h-0'
        )}
      >
        <div className="p-6 flex-shrink-0">
          <h2 className="text-xl font-bold">NSC Patient</h2>
        </div>
        <nav className="flex flex-col flex-1 overflow-y-auto pb-24">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === '/patient'
                ? pathname === '/patient'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-6 py-4 flex items-center gap-3 transition-colors border-l-4',
                  active
                    ? 'bg-slate-800 border-primary text-white'
                    : 'border-transparent hover:bg-slate-800 hover:border-slate-600'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start gap-3 text-white hover:bg-slate-800"
          >
            <LogOut size={20} />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-border p-4 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {monogram}
            </div>
            <div className="min-w-0 text-right sm:text-left">
              <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">Patient</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-muted/20">{children}</main>
      </div>
    </div>
  );
}
