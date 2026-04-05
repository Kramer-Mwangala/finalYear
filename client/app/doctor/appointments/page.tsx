'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

export default function DoctorAppointmentsPage() {
  const appointments = [
    {
      id: 1,
      patientName: 'Jane Doe',
      time: '2:00 PM',
      duration: '30 minutes',
      type: 'Initial Consultation',
      status: 'Confirmed',
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      time: '2:30 PM',
      duration: '30 minutes',
      type: 'Follow-up',
      status: 'In Progress',
    },
    {
      id: 3,
      patientName: 'Sarah Kipchoge',
      time: '3:00 PM',
      duration: '45 minutes',
      type: 'Laser Treatment',
      status: 'Confirmed',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Appointments</h1>
        <p className="text-muted-foreground">View and manage your daily appointment schedule.</p>
      </div>

      {/* Date Selector */}
      <div className="border border-border p-6 bg-white">
        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-primary" />
          <input
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Appointments Timeline */}
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="border border-border p-6 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{apt.patientName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{apt.type}</p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded ${
                  apt.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {apt.status}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Clock size={16} />
                {apt.time}
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{apt.duration}</span>
              <div className="flex-1" />
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
