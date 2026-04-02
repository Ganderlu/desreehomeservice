'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { db } from '../../../lib/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUserStore } from '../../../store/store';

function BookPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { uid } = useUserStore();
  const service = params.get('service') || '';
  const price = Number(params.get('price') || 0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function book() {
    if (!uid) return;
    setLoading(true);
    const ref = await addDoc(collection(db, 'bookings'), {
      createdAt: serverTimestamp(),
      customerId: uid,
      service,
      price,
      date,
      time,
      address,
      notes,
      status: 'Booked'
    });
    router.replace(`/customer/checkout?id=${ref.id}`);
  }

  return (
    <div className="container-padded py-6 max-w-lg">
      <h1 className="text-2xl font-bold text-secondary">Book {service}</h1>
      <div className="mt-6 grid gap-4">
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <Input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <textarea className="h-28 rounded-lg border p-3" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Total ₦{price.toLocaleString()}</div>
          <Button onClick={book} disabled={loading || !date || !time || !address}>Continue</Button>
        </div>
        <div className="text-sm text-gray-600">Escrow via Paystack. Funds are released after photo proof.</div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={<div className="container-padded py-6 max-w-lg">Loading…</div>}
    >
      <BookPageContent />
    </Suspense>
  );
}
