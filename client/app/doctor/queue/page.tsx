'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PatientQueuePage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const patientQueue = [
    {
      id: 1,
      name: 'Jane Doe',
      time: '2:00 PM',
      concern: 'Mild Acne',
      status: 'Waiting',
      analysisScore: 78,
      priority: 'Normal',
      notes: 'First-time consultation',
    },
    {
      id: 2,
      name: 'Michael Chen',
      time: '2:30 PM',
      concern: 'Hyperpigmentation',
      status: 'In Consultation',
      analysisScore: 82,
      priority: 'High',
      notes: 'Follow-up from laser therapy',
    },
    {
      id: 3,
      name: 'Sarah Kipchoge',
      time: '3:00 PM',
      concern: 'Eczema',
      status: 'Waiting',
      analysisScore: 65,
      priority: 'High',
      notes: 'Severe inflammation detected',
    },
    {
      id: 4,
      name: 'David Ochieng',
      time: '3:30 PM',
      concern: 'Hair Loss',
      status: 'Waiting',
      analysisScore: 71,
      priority: 'Normal',
      notes: 'Considering PRP treatment',
    },
    {
      id: 5,
      name: 'Emma Wilson',
      time: '4:00 PM',
      concern: 'Skin Texture',
      status: 'Completed',
      analysisScore: 75,
      priority: 'Low',
      notes: 'Tretinoin prescribed',
    },
  ];

  const filteredQueue = patientQueue.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.status.toLowerCase() === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Consultation':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Normal':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Patient Queue</h1>
        <p className="text-muted-foreground">Manage your patient queue and view AI analysis scores.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {['all', 'waiting', 'in consultation', 'completed'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 border transition-colors capitalize ${
              activeFilter === filter
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-foreground hover:border-primary'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {filteredQueue.map((patient) => (
          <div key={patient.id} className="border border-border p-6 bg-white hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Patient</p>
                <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Concern</p>
                <p className="text-foreground">{patient.concern}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Time</p>
                <p className="text-foreground font-semibold">{patient.time}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Status</p>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4 pb-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">AI Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">{patient.analysisScore}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Priority</p>
                <span className={`font-semibold ${getPriorityColor(patient.priority)}`}>
                  {patient.priority}
                </span>
              </div>
              <div className="lg:col-span-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Notes</p>
                <p className="text-foreground">{patient.notes}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" size="sm">
                View Full Analysis
              </Button>
              <Button variant="ghost" size="sm">
                View Medical Records
              </Button>
              {patient.status === 'Waiting' && (
                <Button size="sm">Start Consultation</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-yellow-600" size={20} />
            <h3 className="font-semibold text-foreground">Waiting</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {patientQueue.filter((p) => p.status === 'Waiting').length}
          </p>
        </div>

        <div className="border border-border p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-blue-600" size={20} />
            <h3 className="font-semibold text-foreground">In Consultation</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {patientQueue.filter((p) => p.status === 'In Consultation').length}
          </p>
        </div>

        <div className="border border-border p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-green-600" size={20} />
            <h3 className="font-semibold text-foreground">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {patientQueue.filter((p) => p.status === 'Completed').length}
          </p>
        </div>
      </div>
    </div>
  );
}
