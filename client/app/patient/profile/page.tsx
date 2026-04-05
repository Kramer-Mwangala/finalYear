'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Edit2 } from 'lucide-react';

export default function PatientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const patient = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+254 (0)712 345 678',
    dateOfBirth: 'June 15, 1990',
    gender: 'Female',
    address: 'Hurlingham, Nairobi',
    city: 'Nairobi',
    zipCode: '00100',
    country: 'Kenya',
  };

  const medicalHistory = [
    {
      id: 1,
      condition: 'Mild Acne',
      onset: 'March 2024',
      status: 'Active',
      notes: 'Responsive to topical treatment',
    },
    {
      id: 2,
      condition: 'Sensitive Skin',
      onset: 'February 2020',
      status: 'Ongoing',
      notes: 'Requires gentle products',
    },
    {
      id: 3,
      condition: 'Hyperpigmentation',
      onset: 'January 2024',
      status: 'Active',
      notes: 'Improving with laser treatment',
    },
  ];

  const allergies = [
    { id: 1, allergen: 'Benzoyl Peroxide', severity: 'Moderate', reaction: 'Irritation' },
    { id: 2, allergen: 'Salicylic Acid', severity: 'Mild', reaction: 'Dryness' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal and medical information.</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Edit2 size={18} className="mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="border border-border p-8 bg-white">
            <h2 className="text-2xl font-bold text-foreground mb-6">Personal Information</h2>

            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Full Name</p>
                  <p className="text-lg text-foreground font-semibold">{patient.name}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Email</p>
                    <p className="text-foreground flex items-center gap-2">
                      <Mail size={18} className="text-primary" />
                      {patient.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Phone</p>
                    <p className="text-foreground flex items-center gap-2">
                      <Phone size={18} className="text-primary" />
                      {patient.phone}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Date of Birth</p>
                    <p className="text-foreground">{patient.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Gender</p>
                    <p className="text-foreground">{patient.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Address</p>
                  <p className="text-foreground flex items-start gap-2">
                    <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                    <span>
                      {patient.address}, {patient.city}, {patient.zipCode}, {patient.country}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <form className="space-y-6">
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-semibold mb-2 block">Full Name</label>
                  <input
                    type="text"
                    defaultValue={patient.name}
                    className="w-full px-4 py-3 border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase font-semibold mb-2 block">Email</label>
                    <input
                      type="email"
                      defaultValue={patient.email}
                      className="w-full px-4 py-3 border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase font-semibold mb-2 block">Phone</label>
                    <input
                      type="tel"
                      defaultValue={patient.phone}
                      className="w-full px-4 py-3 border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Save Changes</Button>
              </form>
            )}
          </div>

          {/* Medical History */}
          <div className="border border-border p-8 bg-white">
            <h2 className="text-2xl font-bold text-foreground mb-6">Medical History</h2>
            <div className="space-y-4">
              {medicalHistory.map((item) => (
                <div key={item.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.condition}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Since {item.onset}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded ${
                        item.status === 'Active'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies & Sensitivities */}
          <div className="border border-border p-8 bg-white">
            <h2 className="text-2xl font-bold text-foreground mb-6">Allergies & Sensitivities</h2>
            <div className="space-y-4">
              {allergies.length > 0 ? (
                allergies.map((allergy) => (
                  <div key={allergy.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-foreground">{allergy.allergen}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>Severity: {allergy.severity}</span>
                      <span>•</span>
                      <span>Reaction: {allergy.reaction}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No known allergies</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="border border-border p-6 bg-card">
            <h3 className="font-semibold text-foreground mb-6">Account Status</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Member Since</p>
                <p className="text-foreground font-semibold">January 2024</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Total Visits</p>
                <p className="text-foreground font-semibold">8 Consultations</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Account Level</p>
                <p className="text-foreground font-semibold">Active Patient</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="border border-border p-6 bg-card">
            <h3 className="font-semibold text-foreground mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Name</p>
                <p className="text-foreground">John Doe</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Relationship</p>
                <p className="text-foreground">Spouse</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Phone</p>
                <p className="text-foreground">+254 (0)723 456 789</p>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Download Medical Records
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
