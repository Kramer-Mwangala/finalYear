'use client';

import { Button } from '@/components/ui/button';
import { Pill, ShoppingCart, AlertCircle } from 'lucide-react';

export default function PharmacyPage() {
  const prescriptions = [
    {
      id: 1,
      name: 'Tretinoin 0.05%',
      dosage: '30g cream',
      instructions: 'Apply thin layer at night, 3x weekly',
      startDate: 'March 1, 2024',
      endDate: 'May 31, 2024',
      refillsRemaining: 2,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Vitamin C Serum',
      dosage: '30ml bottle',
      instructions: 'Apply to clean face in morning',
      startDate: 'March 10, 2024',
      endDate: 'June 10, 2024',
      refillsRemaining: 3,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Sunscreen SPF 50',
      dosage: '50ml bottle',
      instructions: 'Apply daily, reapply every 2 hours',
      startDate: 'February 1, 2024',
      endDate: 'Ongoing',
      refillsRemaining: 'Unlimited',
      status: 'Active',
    },
  ];

  const availableProducts = [
    {
      id: 1,
      name: 'Hydrating Night Cream',
      price: 'KES 2,500',
      description: 'Rich hydrating formula for night use',
      inStock: true,
    },
    {
      id: 2,
      name: 'Gentle Cleanser',
      price: 'KES 1,800',
      description: 'Mild cleansing for daily use',
      inStock: true,
    },
    {
      id: 3,
      name: 'Niacinamide 10%',
      price: 'KES 3,200',
      description: 'Pore-minimizing serum',
      inStock: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pharmacy</h1>
        <p className="text-muted-foreground">
          View your prescriptions and reorder recommended skincare products.
        </p>
      </div>

      {/* Prescriptions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Pill size={24} />
          Active Prescriptions
        </h2>
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="border border-border p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{prescription.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{prescription.dosage}</p>
                </div>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                  {prescription.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Instructions</p>
                  <p className="text-sm text-foreground">{prescription.instructions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Duration</p>
                  <p className="text-sm text-foreground">
                    {prescription.startDate} to {prescription.endDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Refills Remaining</p>
                  <p className="text-sm text-foreground">{prescription.refillsRemaining}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost">View Details</Button>
                <Button>Request Refill</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Recommendations */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <ShoppingCart size={24} />
          Recommended Products
        </h2>
        <p className="text-muted-foreground mb-6">
          Additional skincare products recommended for your treatment plan
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableProducts.map((product) => (
            <div key={product.id} className="border border-border p-6 bg-white hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
              </div>

              <div className="mb-6">
                <p className="text-2xl font-bold text-primary">{product.price}</p>
                <p
                  className={`text-xs font-semibold mt-2 ${
                    product.inStock
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </p>
              </div>

              <Button
                disabled={!product.inStock}
                className="w-full"
              >
                {product.inStock ? 'Add to Cart' : 'Notify Me'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="border border-border p-6 bg-yellow-50 flex gap-4">
        <AlertCircle className="text-yellow-700 flex-shrink-0 mt-1" size={24} />
        <div>
          <h3 className="font-semibold text-foreground mb-2">Important Information</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Always follow your doctor's instructions carefully</li>
            <li>• Do not exceed recommended dosages</li>
            <li>• Inform your doctor of any adverse reactions</li>
            <li>• Keep all products in their original containers</li>
            <li>• Store according to instructions (usually cool, dry place)</li>
          </ul>
        </div>
      </div>

      {/* Reorder History */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Recent Orders</h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-foreground">Tretinoin 0.05%</td>
                <td className="px-6 py-4 text-muted-foreground">March 10, 2024</td>
                <td className="px-6 py-4 text-foreground font-semibold">KES 4,500</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    Delivered
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-foreground">Vitamin C Serum</td>
                <td className="px-6 py-4 text-muted-foreground">February 28, 2024</td>
                <td className="px-6 py-4 text-foreground font-semibold">KES 3,200</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    Delivered
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
