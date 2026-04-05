'use client';

import { Button } from '@/components/ui/button';
import { TrendingUp, Users, CheckCircle, Calendar } from 'lucide-react';

export default function DoctorAnalyticsPage() {
  const stats = [
    { label: 'Total Patients', value: '48', icon: Users, trend: '+12% this month' },
    { label: 'Completed Treatments', value: '156', icon: CheckCircle, trend: '+8% this month' },
    { label: 'Avg. Patient Rating', value: '4.8/5', icon: TrendingUp, trend: '+0.2 since last month' },
    { label: 'Appointments Scheduled', value: '32', icon: Calendar, trend: '+15% this month' },
  ];

  const treatmentBreakdown = [
    { name: 'Acne Treatment', count: 28, percentage: 35 },
    { name: 'Anti-Aging', count: 18, percentage: 22 },
    { name: 'Laser Treatments', count: 15, percentage: 19 },
    { name: 'Hair Loss', count: 12, percentage: 15 },
    { name: 'Other', count: 7, percentage: 9 },
  ];

  const monthlyData = [
    { month: 'Jan', consultations: 24, treatments: 18 },
    { month: 'Feb', consultations: 32, treatments: 25 },
    { month: 'Mar', consultations: 28, treatments: 22 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">View your performance metrics and patient data.</p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="border border-border p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{stat.label}</h3>
                <Icon className="text-primary" size={20} />
              </div>
              <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Treatment Breakdown */}
      <div className="border border-border p-8 bg-white">
        <h2 className="text-2xl font-bold text-foreground mb-6">Treatment Breakdown</h2>
        <div className="space-y-4">
          {treatmentBreakdown.map((treatment) => (
            <div key={treatment.name}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{treatment.name}</h3>
                <span className="text-sm text-muted-foreground">{treatment.count} cases</span>
              </div>
              <div className="w-full bg-muted h-3 rounded overflow-hidden">
                <div
                  className="bg-primary h-full transition-all"
                  style={{ width: `${treatment.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{treatment.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="border border-border p-8 bg-white">
        <h2 className="text-2xl font-bold text-foreground mb-6">Monthly Trends</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Month</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Consultations</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Treatments</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data) => (
                <tr key={data.month} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-4 text-foreground font-semibold">{data.month}</td>
                  <td className="px-6 py-4 text-foreground">{data.consultations}</td>
                  <td className="px-6 py-4 text-foreground">{data.treatments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export & Reporting */}
      <div className="border border-border p-8 bg-blue-50">
        <h2 className="text-2xl font-bold text-foreground mb-6">Reports & Exports</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost">Generate Monthly Report</Button>
          <Button variant="ghost">Export Data</Button>
          <Button variant="ghost">View Annual Summary</Button>
        </div>
      </div>
    </div>
  );
}
