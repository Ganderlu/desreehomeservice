'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronDown, Home, MessageCircle, Search, Settings, User, Users } from 'lucide-react';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db, firebaseEnabled } from '../../lib/firebase/client';
import { MobileNav } from '../../components/nav/mobile-nav';
import { Button } from '../../components/ui/button';
import AuthGuard from '../../components/auth-guard';
import { useUserStore } from '../../store/store';
import { cn } from '../../lib/utils';

export default function CustomerDashboard() {
  const { uid, displayName: storeName } = useUserStore();
  const [name, setName] = useState<string | null>(storeName || null);
  const [activeBookings, setActiveBookings] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState(0);
  const [recent, setRecent] = useState<Array<{ id: string; title: string; subtitle: string; status: string }>>([]);
  const [location, setLocation] = useState('Awka GRA');

  useEffect(() => {
    if (!uid) return;
    if (!firebaseEnabled) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        const data = snap.exists() ? (snap.data() as any) : null;
        const dn = typeof data?.displayName === 'string' ? data.displayName : null;
        if (dn) setName(dn);
        const addr = data?.address;
        const addrs = Array.isArray(data?.addresses) ? data.addresses : null;
        if (addrs) setSavedAddresses(addrs.length);
        else if (typeof addr === 'string' && addr.trim()) setSavedAddresses(1);
      } catch {}
    })();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    if (!firebaseEnabled) return;
    try {
      const q = query(
        collection(db, 'bookings'),
        where('customerId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(8),
      );
      const unsub = onSnapshot(q, (snap: any) => {
        const docs = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as any[];
        const active = docs.filter((b) => String(b.status || '').toLowerCase() !== 'completed').length;
        setActiveBookings(active);
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        const spent = docs
          .filter((b) => {
            const dt = b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt ? new Date(b.createdAt) : null;
            if (!dt) return false;
            return dt.getFullYear() === y && dt.getMonth() === m;
          })
          .reduce((sum, b) => sum + (Number(b.price) || 0), 0);
        setTotalSpent(spent);
        setRecent(
          docs.slice(0, 3).map((b) => ({
            id: b.id,
            title: String(b.service || b.category || 'Service'),
            subtitle: String(b.status || 'Pending'),
            status: String(b.status || 'Pending'),
          })),
        );
      });
      return () => unsub();
    } catch {}
  }, [uid]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const categories = [
    { label: 'Plumbing', href: '/customer/services?category=Plumbing', className: 'from-emerald-700 to-teal-500' },
    { label: 'Electrical', href: '/customer/services?category=Electrical', className: 'from-sky-600 to-blue-500' },
    { label: 'Cleaning', href: '/customer/services?category=Cleaning', className: 'from-orange-500 to-amber-400' },
    { label: 'Painting', href: '/customer/services?category=Painting', className: 'from-orange-600 to-red-500' },
    { label: 'AC Repair', href: '/customer/services?category=AC%20Repair', className: 'from-indigo-600 to-blue-800' },
    { label: 'Generator Fix', href: '/customer/services?category=Generator%20Fix', className: 'from-rose-600 to-pink-500' },
  ];

  return (
    <AuthGuard role="customer">
      <div className="min-h-screen bg-gradient-soft pb-16 md:pb-0">
        <div className="container-padded py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
            <aside className="hidden lg:block">
              <div className="rounded-3xl border bg-white/80 backdrop-blur p-4 shadow-sm">
                <div className="flex items-center gap-2 px-2 py-2">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20" />
                  <div className="text-lg font-bold text-secondary">Desree</div>
                </div>
                <div className="mt-4 grid gap-1">
                  {[
                    { label: 'Home', href: '/customer', icon: Home, active: true },
                    { label: 'Services', href: '/customer/services', icon: Settings },
                    { label: 'My Bookings', href: '/customer/bookings', icon: User },
                    { label: 'Chat', href: '/customer/chat', icon: MessageCircle },
                    { label: 'Workers', href: '/customer/services', icon: Users },
                    { label: 'Profile', href: '/profile', icon: User },
                  ].map((i) => {
                    const Icon = i.icon;
                    return (
                      <Link
                        key={i.label}
                        href={i.href}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl px-4 py-3 transition',
                          i.active ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:bg-gray-50',
                        )}
                      >
                        <Icon size={18} className={cn(i.active ? 'text-white' : 'text-gray-600')} />
                        <span className="font-medium">{i.label}</span>
                      </Link>
                    );
                  })}
                  <button className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-secondary hover:bg-gray-50 transition">
                    <span className="h-4 w-4 rounded bg-gray-400" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </aside>

            <section>
              <div className="rounded-3xl border bg-white/80 backdrop-blur px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 rounded-2xl border bg-white px-4 h-11 flex-1">
                    <Search size={18} className="text-gray-500" />
                    <div className="text-sm text-secondary">
                      {location} <span className="text-gray-400">•</span>{' '}
                      <button
                        type="button"
                        className="text-primary font-medium"
                        onClick={() => setLocation((p) => (p === 'Awka GRA' ? 'Onitsha GRA' : 'Awka GRA'))}
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <button className="relative h-11 w-11 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center justify-center">
                    <Bell size={18} className="text-secondary" />
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                  </button>

                  <div className="h-11 rounded-2xl border bg-white px-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary/10 border" />
                    <div className="hidden sm:block text-sm font-medium text-secondary">
                      {name || 'Customer'}
                    </div>
                    <ChevronDown size={16} className="text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border bg-gradient-to-r from-primary/10 via-white to-accent/10 px-6 py-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-2xl font-bold text-secondary">
                      {greeting}, {name || 'there'}!
                    </div>
                    <div className="text-gray-600">What needs fixing today?</div>
                  </div>
                  <Link href="/customer/services">
                    <Button className="h-11 rounded-2xl bg-accent text-white hover:opacity-90 px-6">
                      Book a Service
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border bg-[#0E6D7A] text-white p-5 shadow-sm">
                  <div className="text-sm opacity-90">Active Bookings</div>
                  <div className="mt-2 text-4xl font-semibold">{activeBookings}</div>
                </div>
                <div className="rounded-2xl border bg-accent text-white p-5 shadow-sm">
                  <div className="text-sm opacity-90">Total Spent This Month</div>
                  <div className="mt-2 text-4xl font-semibold">₦{totalSpent.toLocaleString()}</div>
                </div>
                <div className="rounded-2xl border bg-[#0E6D7A] text-white p-5 shadow-sm">
                  <div className="text-sm opacity-90">Saved Addresses</div>
                  <div className="mt-2 text-4xl font-semibold">{savedAddresses}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
                <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-secondary">Service Categories</div>
                    <Link href="/customer/services" className="text-sm font-medium text-primary">
                      View All
                    </Link>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className={cn(
                          'rounded-2xl p-4 text-white shadow-sm hover:shadow-md transition bg-gradient-to-br',
                          c.className,
                        )}
                      >
                        <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/20" />
                        <div className="mt-3 font-semibold">{c.label}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-secondary">Recent Bookings</div>
                    <Link href="/customer/bookings" className="text-sm font-medium text-primary">
                      View All
                    </Link>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {recent.length === 0 ? (
                      <div className="rounded-2xl border bg-white p-4 text-sm text-gray-600">
                        No recent bookings yet.
                      </div>
                    ) : (
                      recent.map((b) => (
                        <div key={b.id} className="rounded-2xl border bg-white p-4 flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="font-semibold text-secondary truncate">{b.title}</div>
                            <div className="text-sm text-gray-600 truncate">{b.subtitle}</div>
                          </div>
                          <Link href={`/customer/track/${b.id}`} className="text-sm font-medium text-primary">
                            Track
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-secondary">Nearby Verified Workers</div>
                  <Link href="/customer/services" className="text-sm font-medium text-primary">
                    View All
                  </Link>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex -space-x-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-secondary/10" />
                    ))}
                  </div>
                  <Button className="h-10 rounded-2xl bg-accent text-white hover:opacity-90 px-5">
                    Hire Now
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <MobileNav active="/customer" />
      </div>
    </AuthGuard>
  );
}
