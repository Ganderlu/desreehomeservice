'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useUserStore } from '../../store/store';
import { db } from '../../lib/firebase/client';
import { doc, setDoc } from 'firebase/firestore';

export default function OnboardingPage() {
  const router = useRouter();
  const { uid } = useUserStore.getState();
  const [role, setRole] = useState<'customer' | 'worker' | 'admin' | ''>('');
  const [city, setCity] = useState(process.env.NEXT_PUBLIC_DEFAULT_CITY || 'Awka');
  const [address, setAddress] = useState('');

  async function complete() {
    if (!uid || !role) return;
    await setDoc(doc(db, 'users', uid), { role, city, address }, { merge: true });
    useUserStore.getState().setUser({ role });
    if (role === 'customer') router.replace('/customer');
    else if (role === 'worker') router.replace('/worker');
    else router.replace('/admin');
  }

  return (
    <div className="container-padded py-10 max-w-lg">
      <h1 className="text-2xl font-bold text-secondary">Set up your account</h1>
      <div className="mt-6 grid gap-4">
        <div className="grid grid-cols-3 gap-3">
          {['customer','worker','admin'].map(r => (
            <button key={r} onClick={() => setRole(r as any)} className={`rounded-xl border p-4 ${role===r?'border-primary ring-2 ring-primary':''}`}>
              <div className="capitalize font-semibold">{r}</div>
            </button>
          ))}
        </div>
        <select value={city} onChange={e => setCity(e.target.value)} className="h-11 rounded-lg border px-3">
          <option>Awka</option>
          <option>Onitsha</option>
          <option>Awka GRA</option>
        </select>
        <Input placeholder="Default address" value={address} onChange={e => setAddress(e.target.value)} />
        <Button onClick={complete} disabled={!role}>Continue</Button>
      </div>
    </div>
  );
}
