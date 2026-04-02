'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useUserStore } from '../../../store/store';

export default function WhatsAppSimPage() {
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const setUser = useUserStore(s => s.setUser);

  function handleContinue() {
    const uid = 'wa_' + phone.replace(/\D/g, '');
    setUser({ uid, displayName: 'WhatsApp User', photoURL: null });
    router.push('/onboarding');
  }

  return (
    <div className="container-padded py-10 max-w-md">
      <h1 className="text-2xl font-bold text-secondary">WhatsApp style login</h1>
      <p className="text-gray-600 mt-2">Enter your phone number to continue</p>
      <div className="mt-6 space-y-3">
        <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0803 123 4567" />
        <Button className="w-full" onClick={handleContinue} disabled={!phone}>Continue</Button>
      </div>
    </div>
  );
}
