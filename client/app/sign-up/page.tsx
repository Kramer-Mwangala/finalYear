'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, Zap, Lock, Shield } from 'lucide-react';
import api, { ApiError } from '@/lib/api';

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character', met: /[!@#$%^&*]/.test(password) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setLoading(true);
    try {
      await api.auth.signup({
        email: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        role: 'patient',
      });
      const q = new URLSearchParams({ phone: phoneNumber.trim(), email: email.trim() });
      router.push(`/verify-otp?${q.toString()}`);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-accent p-12 flex-col justify-between animate-fade-in overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Nairobi Skin Centre</h1>
          </div>
          <p className="text-white/80 text-sm">Join thousands of healthy, happy patients</p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex gap-4 animate-slide-left" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Fast Setup</h3>
              <p className="text-white/70 text-sm">Join in under 5 minutes</p>
            </div>
          </div>

          <div className="flex gap-4 animate-slide-left" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Secure & Private</h3>
              <p className="text-white/70 text-sm">Your data is encrypted and protected</p>
            </div>
          </div>

          <div className="flex gap-4 animate-slide-left" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Instant Access</h3>
              <p className="text-white/70 text-sm">Start booking consultations right away</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-white/20">
          <p className="text-white text-sm leading-relaxed">
            &quot;NSC transformed how I manage my skin health. Professional care that actually listens.&quot;
          </p>
          <p className="text-white/80 text-sm font-medium mt-4">— Sarah K., Patient</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Join Nairobi Skin Centre today</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First name</label>
                <Input
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-input border-border rounded-lg"
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last name</label>
                <Input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-input border-border rounded-lg"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="+254712345678 or 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-input border-border rounded-lg"
                required
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative mb-3">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  className="w-full bg-input border-border rounded-lg pr-10"
                  required
                  autoComplete="new-password"
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    let strength = 0;
                    if (value.length >= 8) strength++;
                    if (/[A-Z]/.test(value)) strength++;
                    if (/[0-9]/.test(value)) strength++;
                    if (/[!@#$%^&*]/.test(value)) strength++;
                    setPasswordStrength(strength);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              <div className="flex gap-1 mb-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < passwordStrength ? 'bg-primary' : 'bg-border'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Password Requirements */}
              <div className="space-y-1.5">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <CheckCircle
                      size={14}
                      className={req.met ? 'text-success' : 'text-muted-foreground'}
                    />
                    <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
              <Input
                type="date"
                className="w-full bg-input border-border rounded-lg"
              />
            </div>

            {/* Terms */}
            <div className="bg-secondary/30 border border-border rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary mt-0.5"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link href="#" className="text-primary hover:underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Marketing */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border accent-primary mt-0.5"
              />
              <span className="text-sm text-muted-foreground">
                I&apos;d like tips and updates from Nairobi Skin Centre
              </span>
            </label>

            {formError && (
              <p className="text-sm text-destructive rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                {formError}
              </p>
            )}

            {/* Create Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 mt-6"
              disabled={!agreeToTerms || loading}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-primary font-semibold hover:text-primary/90">
              Sign in
            </Link>
          </p>

          {/* Info */}
          <p className="text-center text-xs text-muted-foreground mt-6 pt-6 border-t border-border">
            Takes just a few minutes. Add more details after setup.
          </p>
        </div>
      </div>
    </div>
  );
}
