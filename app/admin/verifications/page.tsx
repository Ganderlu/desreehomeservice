"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function AdminVerificationsPage() {
  const nav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Workers", href: "/admin/workers", icon: Wrench },
    { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
    { label: "Verifications", href: "/admin/verifications", icon: ShieldCheck, active: true },
    { label: "Settings", href: "/admin/settings", icon: SlidersHorizontal },
  ];

  const items = [
    { id: "w_1", name: "Ifeanyi Okeke", skill: "Plumber", city: "Onitsha", status: "Pending" },
    { id: "w_2", name: "Amaka U.", skill: "Cleaner", city: "Awka", status: "Pending" },
    { id: "w_3", name: "Chinedu E.", skill: "Electrician", city: "Awka", status: "Verified" },
  ];

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
                  <div className="text-xl font-bold text-secondary leading-none">Desree</div>
                  <div className="text-xs text-gray-500 mt-1">Home ServicePlace</div>
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
                        n.active ? "bg-secondary text-white shadow-sm" : "text-secondary hover:bg-gray-50",
                      )}
                    >
                      <Icon size={18} className={cn(n.active ? "text-white" : "text-gray-600")} />
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
                  <div className="font-semibold text-secondary">Verifications</div>
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

            <div className="mt-6 rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-2xl font-bold text-secondary">Worker Verification</div>
                  <div className="text-sm text-gray-600 mt-1">Approve IDs, portfolios, and skill checks.</div>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_140px] gap-3 px-4 py-3 text-sm font-semibold text-secondary bg-gray-50">
                  <div>Name</div>
                  <div>Skill</div>
                  <div>City</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {items.map((i) => (
                    <div key={i.id} className="grid grid-cols-[1.4fr_1fr_1fr_140px] gap-3 px-4 py-3 text-sm">
                      <div className="font-medium text-secondary">{i.name}</div>
                      <div className="text-gray-700">{i.skill}</div>
                      <div className="text-gray-700">{i.city}</div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
                            i.status === "Verified"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-800",
                          )}
                        >
                          {i.status}
                        </span>
                        {i.status === "Pending" && (
                          <button className="ml-auto h-9 rounded-xl bg-secondary text-white px-3 text-xs font-semibold hover:opacity-90 transition">
                            Approve
                          </button>
                        )}
                        {i.status === "Verified" && <CheckCircle2 size={18} className="text-emerald-600 ml-auto" />}
                      </div>
                    </div>
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

