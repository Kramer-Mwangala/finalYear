'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import api, { ApiError } from '@/lib/api';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  bookingStatusLabel,
} from '@/lib/dashboard-utils';

type ProfileUser = {
  first_name?: string;
  last_name?: string;
};

type PopulatedUser = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

type ScheduleBooking = {
  _id: string;
  appointment_date?: string;
  status?: string;
  severity_score?: number;
  is_urgent_slot?: boolean;
  notes?: string;
  user_id?: PopulatedUser | string;
};

type TodaySchedule = {
  today?: string;
  urgent?: ScheduleBooking[];
  routine?: ScheduleBooking[];
  summary?: {
    urgent_count?: number;
    routine_count?: number;
    total?: number;
  };
};

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [schedule, setSchedule] = useState<TodaySchedule | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setForbidden(false);
      setLoadError(null);
      const results = await Promise.allSettled([
        api.users.profile() as Promise<{ user?: ProfileUser & { role?: string } }>,
        api.dermatologist.scheduleToday() as Promise<TodaySchedule>,
      ]);
      if (cancelled) return;
      if (results[0].status === 'fulfilled') {
        setProfile(results[0].value.user ?? null);
      }
      if (results[1].status === 'fulfilled') {
        setSchedule(results[1].value);
      } else {
        const reason = results[1].reason;
        if (reason instanceof ApiError && reason.status === 403) {
          setForbidden(true);
        } else if (reason instanceof ApiError) {
          setLoadError(reason.message);
        }
      }
      if (results[0].status === 'rejected' && results[0].reason instanceof ApiError) {
        const r = results[0].reason;
        if (r.status !== 401) {
          setLoadError((prev) => prev ?? r.message);
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const queue = useMemo(() => {
    if (!schedule) return [];
    const u = schedule.urgent ?? [];
    const r = schedule.routine ?? [];
    return [...u, ...r].sort((a, b) => {
      const ta = a.appointment_date ? new Date(a.appointment_date).getTime() : 0;
      const tb = b.appointment_date ? new Date(b.appointment_date).getTime() : 0;
      return ta - tb;
    });
  }, [schedule]);

  const patientName = (b: ScheduleBooking) => {
    const u = b.user_id;
    if (u && typeof u === 'object') {
      const n = [u.first_name, u.last_name].filter(Boolean).join(' ');
      return n || u.email || 'Patient';
    }
    return 'Patient';
  };

  const summary = schedule?.summary;
  const pendingCount = queue.filter((b) => (b.status ?? '').toLowerCase() === 'pending').length;
  const confirmedCount = queue.filter(
    (b) => (b.status ?? '').toLowerCase() === 'confirmed'
  ).length;

  const welcomeDoctor = useMemo(() => {
    const n = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
    return n ? `Dr. ${n}` : 'Doctor';
  }, [profile]);

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      {forbidden && (
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40 px-4 py-4 text-sm"
          role="status"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-950 dark:text-amber-100">
                Dermatologist tools need a dermatologist account
              </p>
              <p className="text-amber-900/90 dark:text-amber-200/90 mt-1">
                You&apos;re signed in, but this workspace loads live schedules only for users with
                the dermatologist role. Patient dashboard is still available.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="border-amber-300 flex-shrink-0">
            <Link href="/patient">Open patient dashboard</Link>
          </Button>
        </div>
      )}

      {loadError && !forbidden && (
        <div
          className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{loadError}</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-border/50 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-accent" />
        </div>
        <div className="relative z-10">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-5 w-full max-w-lg" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Welcome back, {welcomeDoctor}
              </h1>
              <p className="text-lg text-muted-foreground">
                {forbidden
                  ? 'Switch role or account to see today’s clinic schedule here.'
                  : `Your schedule and queue for ${schedule?.today ?? 'today'}`}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Patients today</p>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <h3 className="text-2xl font-bold text-primary">
                  {forbidden ? '—' : (summary?.total ?? queue.length)}
                </h3>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
              <Users className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Scheduled for today</p>
        </div>

        <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg hover:border-green-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Confirmed</p>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <h3 className="text-2xl font-bold text-green-600">
                  {forbidden ? '—' : confirmedCount}
                </h3>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Ready to see</p>
        </div>

        <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg hover:border-accent/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <h3 className="text-2xl font-bold text-accent">
                  {forbidden ? '—' : pendingCount}
                </h3>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center">
              <Clock className="text-accent" size={24} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Awaiting confirmation</p>
        </div>

        <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Urgent slots</p>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <h3 className="text-2xl font-bold text-primary">
                  {forbidden ? '—' : (summary?.urgent_count ?? 0)}
                </h3>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
              <TrendingUp className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Flagged high priority</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/doctor/queue">
          <div className="border border-border/50 rounded-xl p-8 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Patient queue</h3>
                <p className="text-muted-foreground">
                  Review today&apos;s visits and severity scores from AI intake
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center flex-shrink-0">
                <ArrowRight className="text-primary" size={20} />
              </div>
            </div>
            <div className="text-sm text-primary font-semibold group-hover:translate-x-1 transition-transform">
              View queue →
            </div>
          </div>
        </Link>

        <Link href="/doctor/records">
          <div className="border border-border/50 rounded-xl p-8 bg-gradient-to-br from-accent/5 to-transparent hover:shadow-lg hover:border-accent/30 transition-all duration-300 cursor-pointer group h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Patient records</h3>
                <p className="text-muted-foreground">Clinical notes, prescriptions, and history</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center flex-shrink-0">
                <ArrowRight className="text-accent" size={20} />
              </div>
            </div>
            <div className="text-sm text-accent font-semibold group-hover:translate-x-1 transition-transform">
              View records →
            </div>
          </div>
        </Link>
      </div>

      <div className="border border-border/50 rounded-xl p-8 bg-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Today&apos;s schedule</h2>
          <Link href="/doctor/appointments">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              Full calendar
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        ) : forbidden ? (
          <p className="text-muted-foreground text-sm py-10 text-center border border-dashed rounded-lg">
            Schedule will appear here for dermatologist accounts.
          </p>
        ) : queue.length === 0 ? (
          <p className="text-muted-foreground text-sm py-10 text-center border border-dashed rounded-lg">
            No appointments on your schedule today.
          </p>
        ) : (
          <div className="space-y-3">
            {queue.map((patient) => {
              const st = (patient.status ?? '').toLowerCase();
              const inProgress = st === 'confirmed';
              return (
                <div
                  key={patient._id}
                  className="border border-border/50 rounded-lg p-6 hover:bg-secondary/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="text-primary" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{patientName(patient)}</h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              inProgress
                                ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {bookingStatusLabel(patient.status ?? '')}
                          </span>
                          {patient.is_urgent_slot && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100/80 text-red-800 dark:bg-red-900/40 dark:text-red-200 flex items-center gap-1">
                              <AlertCircle size={12} /> Urgent
                            </span>
                          )}
                        </div>
                        {patient.notes ? (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {patient.notes}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">AI / severity</p>
                            <p className="font-semibold text-primary">
                              {patient.severity_score != null
                                ? `${patient.severity_score}/10`
                                : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="font-semibold text-foreground">
                              {formatAppointmentTime(patient.appointment_date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-semibold text-foreground">
                              {formatAppointmentDate(patient.appointment_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link href="/doctor/queue">
                      <Button variant="ghost" size="sm" className="group-hover:bg-primary/10 flex-shrink-0">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border border-border/50 rounded-xl p-8 bg-card overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recent activity</h2>
          <Link href="/doctor/records">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              Records
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground text-sm py-8 text-center border border-dashed border-border rounded-lg">
          Diagnosis history will list here when linked to your EMR workflows. Use{' '}
          <Link href="/doctor/records" className="text-primary font-medium hover:underline">
            patient records
          </Link>{' '}
          for now.
        </p>
      </div>
    </div>
  );
}
