'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

const services = [
  { name: 'Plumbing', price: 3000 },
  { name: 'Electrical', price: 4000 },
  { name: 'Cleaning', price: 2500 },
  { name: 'Painting', price: 5000 },
  { name: 'AC Repair', price: 6000 },
  { name: 'Generator Fix', price: 7000 },
  { name: 'Handyman', price: 3500 }
];

function ServicesPageContent() {
  const params = useSearchParams();
  const category = params.get('category');
  const items = category ? services.filter(s => s.name === category) : services;
  return (
    <div className="container-padded py-6">
      <h1 className="text-2xl font-bold text-secondary">Services</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(s => (
          <div key={s.name} className="rounded-2xl border bg-white p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-secondary">{s.name}</div>
              <div className="text-sm text-gray-500">From ₦{s.price.toLocaleString()}</div>
            </div>
            <Link href={`/customer/book?service=${encodeURIComponent(s.name)}&price=${s.price}`}>
              <Button>Book</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="container-padded py-6">Loading…</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}
