'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  MessageCircle,
  Settings,
  User,
  Wallet,
} from 'lucide-react';
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../../lib/firebase/client';
import AuthGuard from '../../components/auth-guard';
import { Button } from '../../components/ui/button';
import { useUserStore } from '../../store/store';
import { cn } from '../../lib/utils';

export default function WorkerDashboard() {
  const { uid, displayName: storeName } = useUserStore();
  const [name, setName] = useState<string | null>(storeName || null);
  const [skill, setSkill] = useState<string>('Worker');
  const [online, setOnline] = useState(true);
  const [availableJobs, setAvailableJobs] = useState<
    Array<{ id: string; title: string; location: string; price: number; etaMins: number }>
  >([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [earnedToday, setEarnedToday] = useState(0);
  const [recentCompleted, setRecentCompleted] = useState<
    Array<{ id: string; title: string; location: string; price: number; etaMins: number }>
  >([]);
  const [weekly, setWeekly] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!uid) return;
    if (!firebaseEnabled) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        const data = snap.exists() ? (snap.data() as any) : null;
        const dn = typeof data?.displayName === 'string' ? data.displayName : null;
        if (dn) setName(dn);
        const s0 = Array.isArray(data?.workerProfile?.skills) ? data.workerProfile.skills[0] : null;
        if (typeof s0 === 'string' && s0) setSkill(s0);
        const isOnline = data?.online;
        if (typeof isOnline === 'boolean') setOnline(isOnline);
      } catch {}
    })();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    if (!firebaseEnabled) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });

    const unsub = onSnapshot(
      query(collection(db, 'jobs'), where('workerId', '==', uid), orderBy('updatedAt', 'desc')),
      (snap: any) => {
        const docs = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as any[];
        const completed = docs.filter((j) => String(j.status || '').toLowerCase() === 'completed');
        const completedTodayDocs = completed.filter((j) => {
          const dt = j.updatedAt?.toDate ? j.updatedAt.toDate() : j.updatedAt ? new Date(j.updatedAt) : null;
          if (!dt) return false;
          return dt >= start;
        });
        setCompletedToday(completedTodayDocs.length);
        setEarnedToday(completedTodayDocs.reduce((sum, j) => sum + (Number(j.price) || 0), 0));

        setRecentCompleted(
          completed.slice(0, 3).map((j) => ({
            id: j.id,
            title: String(j.title || j.service || 'Job'),
            location: String(j.location || j.area || j.city || 'Awka GRA'),
            price: Number(j.price) || 12500,
            etaMins: Number(j.etaMins) || 8,
          })),
        );

        const series = days.map((d0, idx) => {
          const d1 = new Date(d0);
          d1.setDate(d0.getDate() + 1);
          const total = completed
            .filter((j) => {
              const dt = j.updatedAt?.toDate ? j.updatedAt.toDate() : j.updatedAt ? new Date(j.updatedAt) : null;
              if (!dt) return false;
              return dt >= d0 && dt < d1;
            })
            .reduce((sum, j) => sum + (Number(j.price) || 0), 0);
          return total;
        });
        setWeekly(series);
      },
    );

    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!firebaseEnabled) return;
    const unsub = onSnapshot(
      query(
        collection(db, 'jobs'),
        where('status', 'in', ['Open', 'Available', 'Pending']),
        orderBy('createdAt', 'desc'),
        limit(6),
      ) as any,
      (snap: any) => {
        const docs = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as any[];
        setAvailableJobs(
          docs.map((j) => ({
            id: j.id,
            title: String(j.title || j.service || 'Job'),
            location: String(j.location || j.area || j.city || 'Awka GRA'),
            price: Number(j.price) || 12500,
            etaMins: Number(j.etaMins) || 8,
          })),
        );
      },
    );
    return () => unsub();
  }, []);

  const weeklyPoints = useMemo(() => {
    const w = 320;
    const h = 140;
    const padX = 16;
    const padY = 14;
    const min = Math.min(...weekly);
    const max = Math.max(...weekly);
    const xStep = (w - padX * 2) / (weekly.length - 1 || 1);
    const y = (v: number) => {
      const t = (v - min) / (max - min || 1);
      return padY + (1 - t) * (h - padY * 2);
    };
    const pts = weekly.map((v, idx) => `${padX + idx * xStep},${y(v)}`).join(' ');
    return { pts, w, h };
  }, [weekly]);

  async function acceptJob(jobId: string) {
    if (!uid) return;
    try {
      await fetch('/api/jobs/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, workerId: uid }),
      });
      window.location.href = `/worker/jobs/${jobId}`;
    } catch {}
  }

  return (
    <AuthGuard role="worker">
      <div className="min-h-screen bg-gradient-soft">
        <div className="container-padded py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
            <aside className="hidden lg:block">
              <div className="rounded-3xl border bg-[#0E6D7A]/95 text-white p-4 shadow-sm">
                <div className="flex items-center gap-2 px-2 py-2">
                  <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15" />
                  <div className="text-lg font-bold">Desree</div>
                </div>
                <div className="mt-4 grid gap-1">
                  {[
                    { label: 'Dashboard', href: '/worker', icon: LayoutDashboard, active: true },
                    { label: 'Available Jobs', href: '/worker', icon: Briefcase },
                    { label: 'My Earnings', href: '/worker', icon: Wallet },
                    { label: 'Completed Jobs', href: '/worker', icon: CheckCircle2 },
                    { label: 'Chat', href: '/customer/chat', icon: MessageCircle },
                    { label: 'Profile', href: '/profile', icon: User },
                  ].map((i) => {
                    const Icon = i.icon;
                    return (
                      <Link
                        key={i.label}
                        href={i.href}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl px-4 py-3 transition',
                          i.active ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10',
                        )}
                      >
                        <Icon size={18} className="text-white" />
                        <span className="font-medium">{i.label}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-8 rounded-2xl bg-white/10 border border-white/15 px-4 py-3 flex items-center justify-between">
                  <div className="text-sm font-medium">Availability</div>
                  <button
                    type="button"
                    onClick={() => setOnline((v) => !v)}
                    className={cn(
                      'h-7 w-12 rounded-full border border-white/15 transition relative',
                      online ? 'bg-primary' : 'bg-white/15',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white transition',
                        online ? 'left-[26px]' : 'left-[4px]',
                      )}
                    />
                  </button>
                </div>
              </div>
            </aside>

            <section>
              <div className="rounded-3xl border bg-white/80 backdrop-blur px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20" />
                    <div className="text-lg font-bold text-secondary">Desree</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 rounded-full border bg-white px-4 h-10">
                      <span className={cn('h-2.5 w-2.5 rounded-full', online ? 'bg-emerald-500' : 'bg-gray-400')} />
                      <span className="text-sm font-medium text-secondary">{online ? 'Online' : 'Offline'}</span>
                    </div>
                    <button className="relative h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center justify-center">
                      <Bell size={18} className="text-secondary" />
                      <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                    </button>
                    <div className="h-10 rounded-2xl border bg-white px-3 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-secondary/10 border" />
                      <div className="hidden md:block text-sm font-medium text-secondary">
                        {(name || 'Worker') + ' - ' + skill}
                      </div>
                      <ChevronDown size={16} className="text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border bg-gradient-to-r from-accent to-[#F59E0B] px-6 py-5 shadow-sm">
                <div className="text-3xl font-bold text-secondary">
                  ₦{earnedToday.toLocaleString()} earned today <span className="text-secondary/70">•</span> {completedToday} jobs completed
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-[#0E6D7A] text-white px-4 h-11">
                  You are currently {online ? 'Online' : 'Offline'} <span className="opacity-80">›</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOnline((v) => !v)}
                  className={cn(
                    'h-10 w-16 rounded-full border transition relative',
                    online ? 'bg-primary border-primary/30' : 'bg-white border-gray-200',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white shadow transition',
                      online ? 'left-[34px]' : 'left-[6px]',
                    )}
                  />
                </button>
              </div>

              <div className="mt-5 rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                <div className="text-lg font-semibold text-secondary">Available Jobs Near You</div>
                <div className="mt-3 grid gap-3">
                  {availableJobs.length === 0 ? (
                    <div className="rounded-2xl border bg-white p-4 text-sm text-gray-600">
                      No available jobs right now.
                    </div>
                  ) : (
                    availableJobs.slice(0, 2).map((j) => (
                      <div key={j.id} className="rounded-2xl border bg-white p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-semibold text-secondary truncate">{j.title}</div>
                          <div className="text-sm text-gray-600">
                            {j.location}
                          </div>
                          <div className="text-sm text-primary font-medium">
                            ₦{j.price.toLocaleString()} <span className="text-gray-400">•</span> {j.etaMins} mins away
                          </div>
                        </div>
                        <Button className="h-10 rounded-2xl bg-[#0E6D7A] text-white hover:opacity-90 px-6" onClick={() => acceptJob(j.id)}>
                          Accept
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                  <div className="font-semibold text-secondary">Earnings this week</div>
                  <div className="mt-4 rounded-2xl border bg-white p-4 overflow-hidden">
                    <svg viewBox={`0 0 ${weeklyPoints.w} ${weeklyPoints.h}`} className="w-full h-[160px]">
                      <g opacity="0.22">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <line
                            key={i}
                            x1={16}
                            x2={weeklyPoints.w - 16}
                            y1={14 + i * 28}
                            y2={14 + i * 28}
                            stroke="#94a3b8"
                            strokeWidth="1"
                            strokeDasharray="5 6"
                          />
                        ))}
                      </g>
                      <polyline
                        fill="none"
                        stroke="#0E6D7A"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={weeklyPoints.pts}
                      />
                      <polyline
                        fill="none"
                        stroke="rgba(0,191,165,0.55)"
                        strokeWidth="8"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={weeklyPoints.pts}
                        opacity="0.15"
                      />
                    </svg>
                  </div>
                </div>

                <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                  <div className="font-semibold text-secondary">Recent Completed Jobs</div>
                  <div className="mt-4 grid gap-3">
                    {recentCompleted.length === 0 ? (
                      <div className="rounded-2xl border bg-white p-4 text-sm text-gray-600">
                        No completed jobs yet.
                      </div>
                    ) : (
                      recentCompleted.map((j) => (
                        <div key={j.id} className="rounded-2xl border bg-white p-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-secondary/10 border" />
                            <div className="min-w-0">
                              <div className="font-semibold text-secondary truncate">{j.title}</div>
                              <div className="text-sm text-gray-600 truncate">
                                {j.location} <span className="text-gray-400">•</span> {j.etaMins} mins away
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-primary">₦{j.price.toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
