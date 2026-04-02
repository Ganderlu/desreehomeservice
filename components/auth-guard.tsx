'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/store';

export default function AuthGuard({ role, children }: { role?: 'customer' | 'worker' | 'admin'; children: React.ReactNode }) {
  const router = useRouter();
  const { uid, role: current } = useUserStore();
  useEffect(() => {
    if (!uid) router.replace('/auth');
    else if (role && current && current !== role) router.replace(`/${current}`);
  }, [uid, current, role, router]);
  return <>{children}</>;
}
