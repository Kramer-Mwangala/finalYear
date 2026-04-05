'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api, { setAuthToken, ApiError } from '@/lib/api';
import { Shield } from 'lucide-react';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get('phone') ?? '';

  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const data = (await api.auth.verifyOtp({ phoneNumber, otp })) as {
        token?: string;
        user?: { role?: string };
      };
      if (data.token) setAuthToken(data.token);
      const role = data.user?.role ?? 'patient';
      if (role === 'dermatologist' || role === 'doctor') router.push('/doctor');
      else if (role === 'admin') router.push('/patient');
      else router.push('/patient');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      await api.auth.resendOtp({ phoneNumber });
      setInfo('A new code was sent if this number is registered and not yet verified.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend code');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md border border-border rounded-xl p-8 bg-card shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Verify your phone</h1>
            <p className="text-sm text-muted-foreground">Enter the code we sent by SMS</p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone number</label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+254712345678 or 0712345678"
              className="w-full bg-input border-border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">6-digit code</label>
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full bg-input border-border rounded-lg tracking-widest text-lg font-mono"
              maxLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-muted-foreground">{info}</p>}

          <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
            {loading ? 'Verifying…' : 'Verify & continue'}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !phoneNumber.trim()}
            className="text-primary font-medium hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend code'}
          </button>
          <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
          Loading…
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
