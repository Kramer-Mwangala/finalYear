'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  FileText,
  Pill,
  TrendingUp,
  ArrowRight,
  Clock,
  AlertCircle,
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

type BookingRow = {
  _id: string;
  appointment_date?: string;
  status?: string;
  notes?: string;
  severity_score?: number;
};

type ImageRow = {
  _id: string;
  created_at?: string;
  severity_score?: number;
  analysis_result?: {
    condition?: string;
    severityScore?: number;
    recommendations?: string[];
  };
};

type RxRow = {
  _id: string;
  medication_name?: string;
  dosage?: string;
  duration?: string;
  created_at?: string;
};

export default function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [prescriptions, setPrescriptions] = useState<RxRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      const results = await Promise.allSettled([
        api.users.profile() as Promise<{ user?: ProfileUser }>,
        api.bookings.list() as Promise<{ bookings?: BookingRow[] }>,
        api.ai.listAnalyses() as Promise<{ images?: ImageRow[] }>,
        api.pharmacy.myPrescriptions() as Promise<{ prescriptions?: RxRow[] }>,
      ]);
      if (cancelled) return;
      const errs: string[] = [];
      if (results[0].status === 'fulfilled') {
        setProfile(results[0].value.user ?? null);
      } else if (results[0].reason instanceof ApiError) {
        errs.push(results[0].reason.message);
      }
      if (results[1].status === 'fulfilled') {
        setBookings(results[1].value.bookings ?? []);
      } else if (results[1].reason instanceof ApiError) {
        errs.push(results[1].reason.message);
      }
      if (results[2].status === 'fulfilled') {
        setImages(results[2].value.images ?? []);
      } else if (results[2].reason instanceof ApiError) {
        errs.push(results[2].reason.message);
      }
      if (results[3].status === 'fulfilled') {
        setPrescriptions(results[3].value.prescriptions ?? []);
      } else if (results[3].reason instanceof ApiError) {
        errs.push(results[3].reason.message);
      }
      if (errs.length) setLoadError(errs[0]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const welcomeName = useMemo(() => {
    if (profile?.first_name) return profile.first_name;
    return 'there';
  }, [profile]);

  const latest = images[0];
  const analysis = latest?.analysis_result;
  const scoreDisplay = analysis?.severityScore ?? latest?.severity_score;
  const scoreLabel =
    scoreDisplay != null ? `${scoreDisplay}/10 severity` : '—';
  const conditionLabel = analysis?.condition ?? 'No analysis yet';
  const recCount = analysis?.recommendations?.length ?? 0;

  const upcomingAppointments = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return bookings
      .filter((b) => {
        if (!b.appointment_date) return false;
        const d = new Date(b.appointment_date);
        const st = (b.status ?? '').toLowerCase();
        if (st === 'cancelled' || st === 'completed') return false;
        return d >= startOfToday;
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_date!).getTime() -
          new Date(b.appointment_date!).getTime()
      );
  }, [bookings]);

  const nextAppt = upcomingAppointments[0];

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      {loadError && (
        <div
          className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Some data could not be loaded</p>
            <p className="text-destructive/90 mt-1">{loadError}</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-border/50 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-accent" />
        </div>
        <div className="relative z-10">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-full max-w-md" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Welcome back, {welcomeName}
              </h1>
              <p className="text-lg text-muted-foreground">
                Here&apos;s your skin health summary and next steps
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Latest analysis</p>
              {loading ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <h3 className="text-2xl font-bold text-primary">{scoreLabel}</h3>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
              <TrendingUp className="text-primary" size={24} />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Status:{' '}
              <span className="text-primary font-semibold">{conditionLabel}</span>
            </p>
            <p className="text-muted-foreground">
              {latest?.created_at
                ? formatAppointmentDate(latest.created_at)
                : 'Run an AI analysis to see results'}
            </p>
          </div>
        </div>

        <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg hover:border-accent/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Recommendations</p>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <h3 className="text-2xl font-bold text-accent">{recCount}</h3>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center">
              <FileText className="text-accent" size={24} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">From your latest AI report</p>
        </div>

        <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Upcoming</p>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <h3 className="text-2xl font-bold text-primary">
                  {upcomingAppointments.length}
                </h3>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
              <Calendar className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {nextAppt
              ? `Next: ${formatAppointmentDate(nextAppt.appointment_date)}`
              : 'No upcoming visits'}
          </p>
        </div>

        <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg hover:border-accent/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Prescriptions</p>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <h3 className="text-2xl font-bold text-accent">{prescriptions.length}</h3>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center">
              <Pill className="text-accent" size={24} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Active from your care team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/patient/analysis">
          <div className="border border-border/50 rounded-xl p-8 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Start new AI analysis</h3>
                <p className="text-muted-foreground">
                  Upload a skin photo for AI-assisted screening and severity scoring
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center flex-shrink-0">
                <ArrowRight className="text-primary" size={20} />
              </div>
            </div>
            <div className="text-sm text-primary font-semibold group-hover:translate-x-1 transition-transform">
              Continue →
            </div>
          </div>
        </Link>

        <Link href="/patient/appointments">
          <div className="border border-border/50 rounded-xl p-8 bg-gradient-to-br from-accent/5 to-transparent hover:shadow-lg hover:border-accent/30 transition-all duration-300 cursor-pointer group h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Book appointment</h3>
                <p className="text-muted-foreground">
                  Schedule a consultation with a dermatologist
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center flex-shrink-0">
                <ArrowRight className="text-accent" size={20} />
              </div>
            </div>
            <div className="text-sm text-accent font-semibold group-hover:translate-x-1 transition-transform">
              Continue →
            </div>
          </div>
        </Link>
      </div>

      <div className="border border-border/50 rounded-xl p-8 bg-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Upcoming appointments</h2>
          <Link href="/patient/appointments">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              View all
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center border border-dashed border-border rounded-lg">
            No upcoming appointments.{' '}
            <Link href="/patient/appointments" className="text-primary font-medium hover:underline">
              Book one
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 5).map((appt) => {
              const st = (appt.status ?? '').toLowerCase();
              const badgeOk = st === 'confirmed';
              return (
                <div
                  key={appt._id}
                  className="border border-border/50 rounded-lg p-6 hover:bg-secondary/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="text-primary" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">Consultation</h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              badgeOk
                                ? 'bg-green-100/80 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                : 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                            }`}
                          >
                            {bookingStatusLabel(appt.status ?? '')}
                          </span>
                        </div>
                        {appt.notes ? (
                          <p className="text-sm text-muted-foreground line-clamp-2">{appt.notes}</p>
                        ) : null}
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatAppointmentDate(appt.appointment_date)} ·{' '}
                          {formatAppointmentTime(appt.appointment_date)}
                        </p>
                      </div>
                    </div>
                    <Link href="/patient/appointments">
                      <Button variant="ghost" size="sm" className="group-hover:bg-primary/10 flex-shrink-0">
                        Manage
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
          <h2 className="text-2xl font-bold text-foreground">Current medications</h2>
          <Link href="/patient/pharmacy">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              Pharmacy
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center border border-dashed border-border rounded-lg">
            No prescriptions on file yet.
          </p>
        ) : (
          <div className="space-y-3">
            {prescriptions.slice(0, 6).map((med) => (
              <div
                key={med._id}
                className="flex items-start justify-between p-4 border border-border/50 rounded-lg hover:bg-secondary/30 transition-colors group gap-4"
              >
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Pill className="text-accent" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">
                      {med.medication_name ?? 'Medication'}
                    </h3>
                    <p className="text-xs text-muted-foreground">{med.dosage}</p>
                    {med.duration ? (
                      <p className="text-xs text-muted-foreground mt-1">Duration: {med.duration}</p>
                    ) : null}
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100/80 text-green-800 dark:bg-green-900/40 dark:text-green-200 flex-shrink-0">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
