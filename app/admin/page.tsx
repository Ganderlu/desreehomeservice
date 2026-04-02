"use client";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Briefcase,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function AdminDashboard() {
  const nav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, active: true },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Workers", href: "/admin/workers", icon: Wrench },
    { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
    { label: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
    { label: "Settings", href: "/admin/settings", icon: SlidersHorizontal },
  ];

  const kpis = [
    { label: "Total GMV", value: "₦2.8M", tone: "teal" as const },
    { label: "Active Jobs", value: "47", tone: "teal" as const },
    { label: "Completion Rate", value: "96%", tone: "orange" as const },
    { label: "New Users", value: "128", tone: "orange" as const },
  ];

  const trend = [
    12, 8, 15, 22, 28, 19, 35, 24, 29, 33, 27, 38, 41, 30, 24, 45, 52, 48, 49,
    60, 57, 56, 68, 71, 65, 74, 78, 72, 80, 76,
  ];

  const heatmap = Array.from({ length: 88 }).map((_, i) => {
    const isAwka = i % 3 === 0 || (i % 7 === 0 && i % 2 === 0);
    const isEmpty = i % 11 === 0;
    return isEmpty ? "empty" : isAwka ? "awka" : "onitsha";
  }) as Array<"awka" | "onitsha" | "empty">;

  const seriesPoints = (() => {
    const w = 540;
    const h = 180;
    const padX = 18;
    const padY = 18;
    const min = Math.min(...trend);
    const max = Math.max(...trend);
    const xStep = (w - padX * 2) / (trend.length - 1);
    const scaleY = (v: number) => {
      const t = (v - min) / (max - min || 1);
      return padY + (1 - t) * (h - padY * 2);
    };
    return trend
      .map((v, idx) => `${padX + idx * xStep},${scaleY(v)}`)
      .join(" ");
  })();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-soft">
      <div className="container-padded py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="hidden lg:block">
            <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">
                  <div className="h-5 w-5 rounded-md bg-white/90" />
                </div>
                <div>
                  <div className="text-xl font-bold text-secondary leading-none">
                    Desree
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Home ServicePlace
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-2">
                {nav.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.label}
                      href={n.href}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                        n.active
                          ? "bg-secondary text-white shadow-sm"
                          : "text-secondary hover:bg-gray-50",
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn(
                          n.active ? "text-white" : "text-gray-600",
                        )}
                      />
                      <span className="font-medium">{n.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <section>
            <div className="rounded-3xl border bg-white/80 backdrop-blur px-5 py-3 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3 rounded-2xl bg-white border px-4 h-12">
                  <div className="font-semibold text-secondary">Dashboard</div>
                  <div className="ml-auto flex items-center gap-3 text-gray-500">
                    <Search size={18} />
                  </div>
                </div>
                <button className="relative h-12 w-12 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center justify-center">
                  <Bell size={18} className="text-secondary" />
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                </button>
                <button className="h-12 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center gap-3 px-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/10 border" />
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((k) => (
                  <div
                    key={k.label}
                    className={cn(
                      "rounded-2xl px-5 py-4 shadow-sm border transition hover:shadow-md",
                      k.tone === "teal"
                        ? "bg-[#1E8E9A] text-white"
                        : "bg-accent text-white",
                    )}
                  >
                    <div className="text-sm opacity-90">{k.label}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight">
                      {k.value}
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      <div className="h-10 w-10 rounded-xl bg-white/90 flex items-center justify-center text-secondary">
                        <span className="text-lg leading-none">↗</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2 rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-secondary">
                      Revenue Trend (Last 30 Days)
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="h-9 rounded-xl border bg-white px-3 text-sm text-secondary hover:bg-gray-50 transition">
                        CSV
                      </button>
                      <button className="h-9 rounded-xl border bg-white px-3 text-sm text-secondary hover:bg-gray-50 transition">
                        PNG
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border bg-white p-4 overflow-hidden">
                    <svg viewBox="0 0 540 220" className="w-full h-[220px]">
                      <g opacity="0.22">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <line
                            key={i}
                            x1={18}
                            x2={522}
                            y1={18 + i * 34}
                            y2={18 + i * 34}
                            stroke="#94a3b8"
                            strokeWidth="1"
                            strokeDasharray="5 6"
                          />
                        ))}
                      </g>
                      <polyline
                        fill="none"
                        stroke="#0f4c5c"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={seriesPoints}
                      />
                      <polyline
                        fill="none"
                        stroke="rgba(0,191,165,0.45)"
                        strokeWidth="7"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={seriesPoints}
                        opacity="0.2"
                      />
                      <g fill="#0f4c5c">
                        {trend.map((_, idx) => {
                          if (idx % 6 !== 0 && idx !== trend.length - 1)
                            return null;
                          const pt = seriesPoints.split(" ")[idx].split(",");
                          return (
                            <circle key={idx} cx={pt[0]} cy={pt[1]} r="4" />
                          );
                        })}
                      </g>
                      <g fill="#475569" fontSize="12">
                        <text x="18" y="214">
                          0
                        </text>
                        <text x="120" y="214">
                          2
                        </text>
                        <text x="220" y="214">
                          4
                        </text>
                        <text x="320" y="214">
                          6
                        </text>
                        <text x="420" y="214">
                          8
                        </text>
                        <text x="510" y="214">
                          10
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-secondary">
                      Popular Services
                    </div>
                    <button className="h-9 rounded-xl border bg-white px-3 text-sm text-secondary hover:bg-gray-50 transition flex items-center gap-2">
                      Export
                      <span className="text-gray-500">:</span>
                    </button>
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <div className="relative h-44 w-44">
                      <svg viewBox="0 0 120 120" className="h-full w-full">
                        <circle
                          cx="60"
                          cy="60"
                          r="44"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="14"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="44"
                          fill="none"
                          stroke="#1E8E9A"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={`${(2 * Math.PI * 44 * 0.6).toFixed(2)} ${(2 * Math.PI * 44).toFixed(2)}`}
                          transform="rotate(-90 60 60)"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="44"
                          fill="none"
                          stroke="#FF9500"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={`${(2 * Math.PI * 44 * 0.4).toFixed(2)} ${(2 * Math.PI * 44).toFixed(2)}`}
                          transform={`rotate(${(-90 + 216).toFixed(2)} 60 60)`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-semibold text-secondary">
                            40%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-secondary">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1E8E9A]" />
                        Plumbing
                      </div>
                      <div className="text-gray-600">90%</div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full w-[90%] bg-[#1E8E9A]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="font-semibold text-secondary">
                    Jobs by Area
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-accent" />
                      <span className="text-secondary">Awka</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-[#1E8E9A]" />
                      <span className="text-secondary">Onitsha</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-[repeat(22,minmax(0,1fr))] gap-2">
                  {heatmap.map((v, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "aspect-square rounded-md",
                        v === "awka" && "bg-accent",
                        v === "onitsha" && "bg-[#1E8E9A]",
                        v === "empty" && "bg-slate-100",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
