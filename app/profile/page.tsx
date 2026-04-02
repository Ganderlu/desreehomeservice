'use client';
import { useUserStore } from '../../store/store';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { db } from '../../lib/firebase/client';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const { uid, displayName } = useUserStore();
  const [address, setAddress] = useState('');
  const [refCode] = useState(() => (uid ? `DES-${uid.slice(0,6).toUpperCase()}` : 'DES-REF'));

  async function save() {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid), { address }, { merge: true });
    alert('Saved');
  }

  return (
    <div className="container-padded py-6 max-w-xl">
      <h1 className="text-2xl font-bold text-secondary">Profile</h1>
      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm text-gray-600">Name</div>
          <div className="font-semibold">{displayName || 'User'}</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 grid gap-3">
          <div className="text-sm text-gray-600">Saved address</div>
          <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Awka GRA" />
          <Button onClick={save}>Save</Button>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="font-semibold text-secondary">Referral</div>
          <div className="text-gray-700">Share your code for ₦2,000 credit per successful referral</div>
          <div className="mt-2 rounded-lg bg-gray-100 px-3 py-2 inline-block">{refCode}</div>
        </div>
      </div>
    </div>
  );
}
