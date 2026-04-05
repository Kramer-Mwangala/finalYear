'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, FileText, Plus } from 'lucide-react';

export default function PatientRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const patients = [
    {
      id: 1,
      name: 'Jane Doe',
      patientId: 'NSC-001',
      lastVisit: 'March 28, 2024',
      diagnosis: 'Mild Acne',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Michael Chen',
      patientId: 'NSC-002',
      lastVisit: 'March 25, 2024',
      diagnosis: 'Hyperpigmentation',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Sarah Kipchoge',
      patientId: 'NSC-003',
      lastVisit: 'March 20, 2024',
      diagnosis: 'Eczema',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Peter Kimani',
      patientId: 'NSC-004',
      lastVisit: 'February 15, 2024',
      diagnosis: 'Acne vulgaris with scarring',
      status: 'Inactive',
    },
  ];

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Patient Records</h1>
            <p className="text-muted-foreground">Search and manage patient medical records.</p>
          </div>
          <Button>
            <Plus size={18} className="mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="border border-border p-4 bg-white flex items-center gap-2">
        <Search className="text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search by name or patient ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-white text-foreground placeholder-muted-foreground focus:outline-none"
        />
      </div>

      {/* Patient List */}
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Patient Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Patient ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Last Visit</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Diagnosis</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-foreground font-semibold">{patient.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{patient.patientId}</td>
                <td className="px-6 py-4 text-muted-foreground">{patient.lastVisit}</td>
                <td className="px-6 py-4 text-muted-foreground">{patient.diagnosis}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded ${
                      patient.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:underline text-sm font-semibold">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Templates */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-border p-6 bg-white hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="text-primary mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">New Diagnosis Note</h3>
            <p className="text-sm text-muted-foreground">Create a new diagnosis and treatment plan.</p>
          </div>
          <div className="border border-border p-6 bg-white hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="text-primary mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">Add Prescription</h3>
            <p className="text-sm text-muted-foreground">Issue a new prescription for a patient.</p>
          </div>
          <div className="border border-border p-6 bg-white hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="text-primary mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">Follow-up Note</h3>
            <p className="text-sm text-muted-foreground">Document patient progress and outcomes.</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="border border-border p-6 bg-card">
        <h3 className="font-semibold text-foreground mb-4">Data Management</h3>
        <div className="flex gap-3">
          <Button variant="ghost">Export Records</Button>
          <Button variant="ghost">Backup Data</Button>
          <Button variant="ghost">View Audit Log</Button>
        </div>
      </div>
    </div>
  );
}
