'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

/** Stock photos (Unsplash) — replace with your own clinic photography anytime. */
const IMG = {
  heroClinic:
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80',
  consultation:
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80',
  medicalTeam:
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
  dermatologyExam:
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1600&q=80',
  skinCare:
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80',
  laserAesthetic:
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80',
  reception:
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1600&q=80',
  wellness:
    'https://images.unsplash.com/photo-1570172619647-dfcb95609052?auto=format&fit=crop&w=1200&q=80',
} as const;

const SERVICES = [
  {
    title: 'Acne Treatment',
    desc: 'Advanced treatments for acne and acne scars including laser therapy and chemical peels.',
    image: IMG.skinCare,
  },
  {
    title: 'Anti-Aging',
    desc: 'Combat signs of aging with dermal fillers, botox, and advanced skincare protocols.',
    image: IMG.wellness,
  },
  {
    title: 'Pigmentation',
    desc: 'Treat hyperpigmentation, melasma, and uneven skin tone with specialized therapies.',
    image: IMG.laserAesthetic,
  },
  {
    title: 'Hair Loss Treatment',
    desc: 'Comprehensive solutions for hair loss including PRP therapy and medication.',
    image: IMG.dermatologyExam,
  },
  {
    title: 'Laser Treatments',
    desc: 'State-of-the-art laser technology for skin rejuvenation and hair removal.',
    image: IMG.laserAesthetic,
  },
  {
    title: 'Eczema & Dermatitis',
    desc: 'Specialized care for sensitive skin conditions and dermatological diseases.',
    image: IMG.consultation,
  },
] as const;

const sectionShell = 'px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20';
const contentMax = 'max-w-screen-2xl mx-auto w-full';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-border z-50">
        <div
          className={`${contentMax} ${sectionShell} h-16 flex items-center justify-between gap-4`}
        >
          <div className="text-xl font-bold text-primary">NSC</div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#faq" className="text-foreground hover:text-primary transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white p-4 flex flex-col gap-4">
            <a href="#services" className="text-foreground hover:text-primary">
              Services
            </a>
            <a href="#testimonials" className="text-foreground hover:text-primary">
              Testimonials
            </a>
            <a href="#faq" className="text-foreground hover:text-primary">
              FAQ
            </a>
            <a href="#contact" className="text-foreground hover:text-primary">
              Contact
            </a>
            <Link href="/sign-in">
              <Button variant="ghost" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className={`pt-28 sm:pt-32 pb-16 sm:pb-24 ${sectionShell} bg-gradient-to-b from-secondary via-background to-background overflow-hidden relative`}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse-soft" />
          <div
            className="absolute -bottom-20 left-1/4 w-[28rem] h-[28rem] bg-accent rounded-full blur-3xl animate-pulse-soft"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className={`${contentMax} relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center`}>
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary">Welcome to Premier Dermatology</p>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-foreground mb-6 text-balance leading-tight animate-slide-up">
              Expert Dermatology with AI-Powered Insights
            </h1>
            <p
              className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto lg:mx-0 lg:max-w-none animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Nairobi Skin Centre combines cutting-edge technology with expert medical care to deliver
              personalized skincare solutions tailored to your unique needs.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 px-8">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="#contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-secondary/50 px-8">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative animate-slide-right" style={{ animationDelay: '0.15s' }}>
            <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-border/60 ring-1 ring-black/5">
              <Image
                src={IMG.heroClinic}
                alt="Bright, modern hospital clinic corridor"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent pointer-events-none" />
              <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium drop-shadow-md">
                A calm, clinical environment focused on skin health
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`py-20 sm:py-28 ${sectionShell} bg-background`}>
        <div className={contentMax}>
          <div className="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground mb-4 animate-slide-up">
              Our Services
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Comprehensive dermatological care for all your skin concerns
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {SERVICES.map((service, idx) => (
              <div
                key={service.title}
                className="group border border-border bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex flex-col animate-slide-up"
                style={{ animationDelay: `${0.05 * idx}s` }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.title} — dermatology care at Nairobi Skin Centre`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-xl font-semibold text-white drop-shadow-sm">
                    {service.title}
                  </h3>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Analysis Feature */}
      <section className={`py-20 sm:py-28 ${sectionShell} bg-secondary/30 overflow-hidden relative`}>
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div
            className="absolute top-1/2 right-0 w-[28rem] h-[28rem] bg-primary rounded-full blur-3xl animate-pulse-soft"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className={`${contentMax} relative z-10`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            <div className="animate-slide-left max-w-xl lg:max-w-none">
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground mb-6 text-balance">
                AI-Powered Skin Analysis
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Our advanced AI technology analyzes your skin with precision, identifying concerns and
                recommending personalized treatment plans reviewed by our expert dermatologists.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Instant skin analysis in minutes',
                  'Personalized treatment recommendations',
                  'Doctor-reviewed results',
                  'Progress tracking over time',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary transition-colors" />
                    <span className="text-foreground group-hover:text-primary transition-colors text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                  Try AI Analysis Today
                </Button>
              </Link>
            </div>

            <div className="relative animate-slide-right" style={{ animationDelay: '0.2s' }}>
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/60 ring-1 ring-black/5">
                <Image
                  src={IMG.medicalTeam}
                  alt="Clinical team in a hospital setting"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-foreground/80 to-transparent">
                  <p className="text-lg font-semibold text-white">Advanced clinical workflows</p>
                  <p className="text-white/90 text-sm mt-1">AI-assisted documentation and dermatology pathways</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section
        className={`py-20 sm:py-28 ${sectionShell} bg-gradient-to-b from-secondary/50 to-background overflow-hidden relative`}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse-soft" />
        </div>

        <div className={`${contentMax} relative z-10`}>
          <div className="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground mb-4 animate-slide-up">
              Your Dashboard at a Glance
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Access comprehensive tools designed for your dermatological care journey
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <Link href="/patient">
                <Button size="lg">View patient dashboard</Button>
              </Link>
              <Link href="/doctor">
                <Button size="lg" variant="outline">
                  View doctor dashboard
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
              Demo layouts only — no sign-in required. API calls use <span className="font-mono text-xs">NEXT_PUBLIC_API_URL</span> and{' '}
              <span className="font-mono text-xs">lib/api.ts</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-12 lg:mb-16">
            {/* Patient Dashboard Features */}
            <div className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-xl transition-all duration-300 animate-slide-left flex flex-col">
              <div className="relative h-44 sm:h-52 w-full">
                <Image
                  src={IMG.consultation}
                  alt="Patient consultation at a dermatology clinic"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card from-10% to-transparent" />
              </div>
              <div className="p-8 pt-4 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Patient Dashboard</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1 bg-primary rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Medical Profile</h4>
                    <p className="text-sm text-muted-foreground">Complete medical history, allergies, and health records in one secure location</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-primary rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">AI Skin Analysis</h4>
                    <p className="text-sm text-muted-foreground">Get detailed skin analysis with AI-powered insights and personalized treatment recommendations</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-primary rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Appointment Booking</h4>
                    <p className="text-sm text-muted-foreground">Book consultations with our expert dermatologists with real-time availability</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-primary rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Prescription Management</h4>
                    <p className="text-sm text-muted-foreground">Track prescriptions, refills, and recommended pharmacy products</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-primary rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Lab Management</h4>
                    <p className="text-sm text-muted-foreground">Order diagnostic tests and view results with voice assistant support</p>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Doctor Dashboard Features */}
            <div
              className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-xl transition-all duration-300 animate-slide-right flex flex-col"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="relative h-44 sm:h-52 w-full">
                <Image
                  src={IMG.dermatologyExam}
                  alt="Dermatologist examining a patient"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card from-10% to-transparent" />
              </div>
              <div className="p-8 pt-4 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-accent rounded"></div>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Doctor Dashboard</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Patient Queue Management</h4>
                    <p className="text-sm text-muted-foreground">View prioritized patient queue with AI skin analysis scores and status</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Patient Records</h4>
                    <p className="text-sm text-muted-foreground">Access complete patient history and diagnosis templates for efficient consultation</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Appointment Schedule</h4>
                    <p className="text-sm text-muted-foreground">View daily appointments with detailed patient information and notes</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Analytics & Insights</h4>
                    <p className="text-sm text-muted-foreground">Track treatment outcomes, trends, and performance metrics</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Diagnosis Tools</h4>
                    <p className="text-sm text-muted-foreground">Access AI-assisted diagnosis and personalized treatment planning</p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="relative rounded-2xl border border-border overflow-hidden animate-slide-up">
            <div className="absolute inset-0">
              <Image
                src={IMG.reception}
                alt="Welcoming clinic reception"
                fill
                className="object-cover opacity-20"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/90" />
            </div>
            <div className="relative p-8 sm:p-12 lg:p-14">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-8 sm:mb-10 text-center">
              Why Choose NSC&apos;s Platform
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                <p className="text-muted-foreground">Active patients trust our platform for their skincare needs</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Expert dermatologists providing comprehensive care</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Access your health data anytime, anywhere, with top-tier security</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-20 sm:py-28 ${sectionShell} bg-background`}>
        <div className={contentMax}>
          <div className="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground mb-4 animate-slide-up">
              What Patients Say
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Real results from real patients at Nairobi Skin Centre
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: 'Sarah Kipchoge',
                text: 'The AI skin analysis was incredibly accurate. The treatment plan was tailored perfectly to my needs. Highly recommended!',
                initials: 'SK',
                rating: 5,
              },
              {
                name: 'James Mwangi',
                text: 'Professional staff, state-of-the-art equipment, and results that exceed expectations. Best dermatology clinic in Nairobi.',
                initials: 'JM',
                rating: 5,
              },
              {
                name: 'Grace Okonkwo',
                text: 'The combination of technology and expert doctors made my treatment journey smooth and effective.',
                initials: 'GO',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="border border-border p-8 bg-card rounded-xl hover:shadow-xl hover:border-primary/30 transition-all duration-300 group animate-slide-up h-full flex flex-col"
                style={{ animationDelay: `${0.1 * idx}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold text-sm group-hover:scale-110 transition-transform">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">Patient</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-20 sm:py-28 ${sectionShell} bg-secondary/30`}>
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground mb-4 animate-slide-up">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Everything you need to know about NSC
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does the AI skin analysis work?',
                a: 'Our AI technology analyzes high-resolution images of your skin to identify concerns, determine skin type, and recommend personalized treatment options. Results are reviewed by our dermatologists before any treatment plan is created.',
              },
              {
                q: 'What is the cost of a consultation?',
                a: 'Initial consultations are KES 2,500. This includes a thorough skin assessment and personalized recommendations. AI analysis is included at no additional cost.',
              },
              {
                q: 'Do you offer payment plans?',
                a: 'Yes, we offer flexible payment plans for major treatments. Contact our office to discuss options that work for your budget.',
              },
              {
                q: 'How long do results typically take to show?',
                a: 'Results vary by treatment type. Some treatments show improvement within 2-4 weeks, while others may take 8-12 weeks. Your doctor will provide a detailed timeline during your consultation.',
              },
              {
                q: 'Are your doctors qualified dermatologists?',
                a: 'All our doctors are board-certified dermatologists with extensive experience in cosmetic and medical dermatology.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="border border-border bg-card group rounded-lg overflow-hidden hover:border-primary/30 transition-colors animate-slide-up"
                style={{animationDelay: `${0.05 * idx}s`}}
              >
                <summary className="p-6 cursor-pointer font-semibold text-foreground flex items-center justify-between hover:bg-secondary/50 transition-colors">
                  <span className="group-open:text-primary transition-colors">{faq.q}</span>
                  <ChevronDown size={20} className="group-open:rotate-180 group-open:text-primary transition-all" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground border-t border-border bg-secondary/20">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`py-20 sm:py-28 ${sectionShell} bg-background overflow-hidden relative`}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse-soft" />
        </div>

        <div className={`${contentMax} relative z-10`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5 animate-slide-left">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-border mb-10 lg:mb-0 lg:sticky lg:top-28">
                <Image
                  src={IMG.heroClinic}
                  alt="Nairobi Skin Centre clinic interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent pointer-events-none" />
                <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                  Visit us in Hurlingham — consultations by appointment
                </p>
              </div>
            </div>
            <div className="lg:col-span-3 animate-slide-left" style={{ animationDelay: '0.05s' }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Get In Touch</h2>
              <div className="space-y-6">
                <div className="group">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Phone</h3>
                  <p className="text-muted-foreground">+254 (0)20 2720 100</p>
                </div>
                <div className="group">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Email</h3>
                  <p className="text-muted-foreground">info@nairobiskincentre.co.ke</p>
                </div>
                <div className="group">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Location</h3>
                  <p className="text-muted-foreground">Hurlingham, Nairobi, Kenya</p>
                </div>
                <div className="group">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Hours</h3>
                  <p className="text-muted-foreground">Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Sat: 9:00 AM - 4:00 PM</p>
                  <p className="text-muted-foreground">Sun: Closed</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-secondary/50 to-card border border-border p-8 sm:p-10 rounded-2xl hover:shadow-lg transition-shadow animate-slide-right">
              <h3 className="text-xl font-semibold text-foreground mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-all"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-all"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-all"
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-gradient-to-r from-foreground to-foreground/95 text-white py-14 sm:py-16 ${sectionShell}`}>
        <div className={contentMax}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-primary/80 rounded"></div>
                <h3 className="font-bold text-lg">Nairobi Skin Centre</h3>
              </div>
              <p className="text-white/70 text-sm">
                Expert dermatology services with AI-powered insights for beautiful, healthy skin.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#services" className="hover:text-white hover:translate-x-1 transition-all inline-block">→ Acne Treatment</a></li>
                <li><a href="#services" className="hover:text-white hover:translate-x-1 transition-all inline-block">→ Laser Treatments</a></li>
                <li><a href="#services" className="hover:text-white hover:translate-x-1 transition-all inline-block">→ Hair Loss Solutions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">→ About Us</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">→ Blog</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">→ Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">→ Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">→ Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2024 Nairobi Skin Centre. All rights reserved. | Caring for Your Skin Health</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
