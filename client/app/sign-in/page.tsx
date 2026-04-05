'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Clock, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api, { setAuthToken, ApiError } from '@/lib/api';

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [verifyPhone, setVerifyPhone] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setVerifyPhone(null);
    setLoading(true);
    try {
      const data = (await api.auth.login({
        email: email.trim().toLowerCase(),
        password,
      })) as { token?: string; user?: { role?: string } };
      if (data.token) setAuthToken(data.token);
      const r = data.user?.role ?? 'patient';
      if (r === 'dermatologist') router.push('/doctor');
      else if (r === 'admin') router.push('/patient');
      else router.push('/patient');
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        const body = err.body as { phoneNumber?: string } | undefined;
        if (err.status === 403 && body?.phoneNumber) setVerifyPhone(String(body.phoneNumber));
      } else {
        setFormError('Sign in failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar with Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-accent p-12 flex-col justify-between animate-fade-in overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Nairobi Skin Centre</h1>
          </div>
          <p className="text-white/80 text-sm">Premium Dermatology Care at Your Fingertips</p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-6">
          <div className="flex gap-4 animate-slide-left" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Expert Care</h3>
              <p className="text-white/70 text-sm">Trusted by thousands of patients</p>
            </div>
          </div>
          
          <div className="flex gap-4 animate-slide-left" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Quick Consultations</h3>
              <p className="text-white/70 text-sm">Get seen by our doctors immediately</p>
            </div>
          </div>

          <div className="flex gap-4 animate-slide-left" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Your Health First</h3>
              <p className="text-white/70 text-sm">Privacy and care guaranteed</p>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
            <p className="text-white text-2xl font-bold">5000+</p>
            <p className="text-white/70 text-sm">Happy Patients</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
            <p className="text-white text-2xl font-bold">50+</p>
            <p className="text-white/70 text-sm">Expert Doctors</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to access your healthcare dashboard</p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-3 mb-8 bg-secondary/30 p-1.5 rounded-lg border border-border">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                role === 'patient'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-secondary/50'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                role === 'doctor'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-secondary/50'
              }`}
            >
              Doctor
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border-border rounded-lg"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input border-border rounded-lg pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link href="#" className="text-primary hover:text-primary/90 font-medium">
                Forgot password?
              </Link>
            </div>

            {formError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive space-y-2">
                <p>{formError}</p>
                {(formError.toLowerCase().includes('verify') || verifyPhone) && (
                  <Link
                    href={
                      verifyPhone
                        ? `/verify-otp?phone=${encodeURIComponent(verifyPhone)}`
                        : '/verify-otp'
                    }
                    className="font-medium text-primary inline-block"
                  >
                    Enter verification code
                  </Link>
                )}
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-border hover:bg-secondary/50 text-foreground rounded-lg transition-colors"
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="border-border hover:bg-secondary/50 text-foreground rounded-lg transition-colors"
            >
              Apple
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-primary font-semibold hover:text-primary/90">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
