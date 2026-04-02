'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get('id') || '';

  async function pay() {
    const res = await fetch('/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: id })
    });
    const data = await res.json();
    if (data.authorization_url) {
      window.location.href = data.authorization_url;
    }
  }

  return (
    <div className="container-padded py-10 max-w-md">
      <h1 className="text-2xl font-bold text-secondary">Checkout</h1>
      <p className="mt-2 text-gray-600">Pay securely. We hold the money until the job is completed.</p>
      <div className="mt-6">
        <Button className="w-full" onClick={pay}>Pay with Paystack</Button>
        <Button variant="outline" className="w-full mt-3" onClick={() => router.push('/customer')}>Back</Button>
      </div>
    </div>
  );
}
