'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const doctors = [
    { id: 1, name: 'Dr. Samuel Kariuki', specialty: 'Acne & Cosmetic', availability: 5 },
    { id: 2, name: 'Dr. Susan Mwangi', specialty: 'Laser Treatments', availability: 3 },
    { id: 3, name: 'Dr. Peter Kimani', specialty: 'Hair Loss', availability: 4 },
  ];

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const appointmentHistory = [
    {
      id: 1,
      type: 'Initial Consultation',
      doctor: 'Dr. Samuel Kariuki',
      date: 'March 15, 2024',
      time: '10:00 AM',
      status: 'Completed',
    },
    {
      id: 2,
      type: 'Follow-up',
      doctor: 'Dr. Susan Mwangi',
      date: 'February 28, 2024',
      time: '3:00 PM',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Book Appointment</h1>
        <p className="text-muted-foreground">Schedule a consultation with our expert dermatologists.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {/* Doctor Selection */}
            <div className="border border-border p-6 bg-white">
              <h2 className="text-2xl font-bold text-foreground mb-6">Select a Doctor</h2>
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <User size={18} />
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{doctor.specialty}</p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded">
                        {doctor.availability} slots
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="border border-border p-6 bg-white">
              <h2 className="text-2xl font-bold text-foreground mb-6">Select a Date</h2>
              <div className="flex items-center gap-4 mb-6">
                <Calendar size={20} className="text-primary" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 px-4 py-2 border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {selectedDate && (
                <p className="text-sm text-muted-foreground">
                  You selected: {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="border border-border p-6 bg-white">
                <h2 className="text-2xl font-bold text-foreground mb-6">Select a Time</h2>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-3 border transition-all flex items-center justify-center gap-2 ${
                        selectedTime === slot
                          ? 'border-primary bg-primary text-white'
                          : 'border-border bg-white text-foreground hover:border-primary'
                      }`}
                    >
                      <Clock size={16} />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Appointment Details */}
            {selectedDate && selectedTime && (
              <div className="border border-border p-6 bg-blue-50">
                <h2 className="text-2xl font-bold text-foreground mb-6">Confirm Details</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">Date:</span>
                    <span className="text-foreground">
                      {new Date(selectedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">Time:</span>
                    <span className="text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">Type:</span>
                    <span className="text-foreground">Initial Consultation</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">Duration:</span>
                    <span className="text-foreground">30 minutes</span>
                  </div>
                </div>
                <Button className="w-full">Confirm Appointment</Button>
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="border border-border p-6 bg-card">
            <h3 className="font-semibold text-foreground mb-4">Appointment Info</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Consultations are 30 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Arrive 10 minutes early</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Cost: KES 2,500</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Free cancellation 24h before</span>
              </li>
            </ul>
          </div>

          <div className="border border-border p-6 bg-card">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin size={18} />
              Location
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Hurlingham, Nairobi, Kenya
            </p>
            <Button variant="ghost" className="w-full justify-start text-primary">
              View on Map
            </Button>
          </div>
        </div>
      </div>

      {/* Appointment History */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Appointment History</h2>
        <div className="space-y-4">
          {appointmentHistory.map((apt) => (
            <div key={apt.id} className="border border-border p-6 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{apt.type}</h3>
                  <p className="text-sm text-muted-foreground mt-1">with {apt.doctor}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-800 rounded">
                  {apt.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{apt.date}</span>
                <span>•</span>
                <span>{apt.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
