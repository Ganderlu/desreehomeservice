"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "../../../lib/utils";

type DisputeStatus = "Open" | "Closed";

type Dispute = {
  id: string;
  jobId: string;
  customer: string;
  worker: string;
  issue: string;
  status: DisputeStatus;
  date: string;
  city: "Awka" | "Onitsha";
  chat: Array<{ who: "Customer" | "Worker"; text: string }>;
  afterPhotos: Array<{ label: string }>;
};

export default function AdminDisputesPage() {
  const nav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Workers", href: "/admin/workers", icon: Wrench },
    { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle, active: true },
    { label: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
    { label: "Settings", href: "/admin/settings", icon: SlidersHorizontal },
  ];

  const [awkaFilter, setAwkaFilter] = useState<"Awka" | "All">("Awka");
  const [onitshaFilter, setOnitshaFilter] = useState<"Onitsha" | "All">("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Dispute | null>(null);

  const disputes: Dispute[] = useMemo(
    () => [
      {
        id: "d1",
        jobId: "#12345",
        customer: "John Doe",
        worker: "John Doe",
        issue: "Job not completed",
        status: "Open",
        date: "2023-10-01",
        city: "Awka",
        chat: [
          { who: "Customer", text: "Please, the job isn’t completed and my generator is still tripping." },
          { who: "Worker", text: "I finished the wiring. I can come back to check the overload." },
        ],
        afterPhotos: [{ label: "After photo 1" }, { label: "After photo 2" }],
      },
      {
        id: "d2",
        jobId: "#22341",
        customer: "John Doe",
        worker: "Jane Smith",
        issue: "Damaged wall after drilling",
        status: "Open",
        date: "2023-10-03",
        city: "Onitsha",
        chat: [
          { who: "Customer", text: "There’s a crack after the drilling. I’m not happy with the finish." },
          { who: "Worker", text: "Sorry about that. I can patch it or refund part of the fee." },
        ],
        afterPhotos: [{ label: "After photo 1" }],
      },
      {
        id: "d3",
        jobId: "#32398",
        customer: "Amaka U.",
        worker: "Chinedu E.",
        issue: "Late arrival",
        status: "Closed",
        date: "2023-10-08",
        city: "Awka",
        chat: [
          { who: "Customer", text: "Worker arrived late and I had to leave the house." },
          { who: "Worker", text: "Traffic from Onitsha bridge was heavy. Sorry." },
        ],
        afterPhotos: [],
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return disputes.filter((d) => {
      const cityOk =
        (awkaFilter === "All" && onitshaFilter === "All") ||
        (awkaFilter !== "All" && d.city === "Awka") ||
        (onitshaFilter !== "All" && d.city === "Onitsha");
      const qOk =
        !normalized ||
        d.jobId.toLowerCase().includes(normalized) ||
        d.customer.toLowerCase().includes(normalized) ||
        d.worker.toLowerCase().includes(normalized) ||
        d.issue.toLowerCase().includes(normalized) ||
        d.status.toLowerCase().includes(normalized);
      return cityOk && qOk;
    });
  }, [awkaFilter, onitshaFilter, query, disputes]);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-soft">
      <div className="container-padded py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="hidden lg:block">
            <div className="rounded-3xl border bg-[#0E6D7A]/95 text-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-accent/90 flex items-center justify-center">
                  <div className="h-5 w-5 rounded-md bg-white/90" />
                </div>
                <div>
                  <div className="text-xl font-bold leading-none">Desree</div>
                  <div className="text-xs opacity-80 mt-1">HOME SERVICE</div>
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
                        n.active ? "bg-accent/90 text-white" : "text-white/90 hover:bg-white/10",
                      )}
                    >
                      <Icon size={18} className="text-white" />
                      <span className="font-medium">{n.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-10 flex items-center gap-3 text-white/80">
                <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <div className="h-4 w-4 rounded bg-white/60" />
                </div>
                <div className="text-sm">Desree Home Service</div>
              </div>
            </div>
          </aside>

          <section>
            <div className="rounded-3xl border bg-white/80 backdrop-blur px-5 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3 rounded-2xl bg-white border px-4 h-12">
                  <div className="font-semibold text-secondary">Dispute Management</div>
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
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-secondary">Dispute Management</h1>
                  <div className="text-sm text-gray-600 mt-1">Manage and resolve customer disputes</div>
                </div>
                <button className="h-11 rounded-2xl bg-[#0E6D7A] text-white px-5 font-medium hover:opacity-95 transition">
                  New Dispute
                </button>
              </div>

              <div className="mt-5 rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <select
                      value={awkaFilter}
                      onChange={(e) => setAwkaFilter(e.target.value as any)}
                      className="h-10 rounded-xl border bg-white px-3 text-sm text-secondary"
                    >
                      <option value="All">All</option>
                      <option value="Awka">Awka</option>
                    </select>
                    <select
                      value={onitshaFilter}
                      onChange={(e) => setOnitshaFilter(e.target.value as any)}
                      className="h-10 rounded-xl border bg-white px-3 text-sm text-secondary"
                    >
                      <option value="All">All</option>
                      <option value="Onitsha">Onitsha</option>
                    </select>
                    <div className="hidden md:flex items-center gap-2 h-10 rounded-xl border bg-white px-3 text-sm text-gray-600">
                      <Search size={16} />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search disputes..."
                        className="outline-none bg-transparent w-56"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-10 rounded-xl border bg-white px-4 text-sm text-secondary hover:bg-gray-50 transition">
                      Location
                    </button>
                    <button className="h-10 rounded-xl border bg-white px-4 text-sm text-secondary hover:bg-gray-50 transition">
                      Export
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
                  <div className="grid grid-cols-[110px_1fr_1fr_1.6fr_120px_130px] gap-3 px-4 py-3 text-sm font-semibold text-secondary bg-gray-50">
                    <div>Job ID</div>
                    <div>Customer</div>
                    <div>Worker</div>
                    <div>Issue</div>
                    <div>Status</div>
                    <div>Date</div>
                  </div>
                  <div className="divide-y">
                    {filtered.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelected(d)}
                        className="w-full text-left grid grid-cols-[110px_1fr_1fr_1.6fr_120px_130px] gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
                      >
                        <div className="text-secondary font-medium">{d.jobId}</div>
                        <div className="text-secondary">{d.customer}</div>
                        <div className="text-secondary">{d.worker}</div>
                        <div className="text-gray-700">{d.issue}</div>
                        <div>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
                              d.status === "Open"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-700",
                            )}
                          >
                            {d.status}
                          </span>
                        </div>
                        <div className="text-gray-700">{d.date}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Dialog.Root open={!!selected} onOpenChange={(o) => (!o ? setSelected(null) : null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(760px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-secondary">Dispute Details</Dialog.Title>
              <Dialog.Close className="h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center justify-center">
                <X size={18} className="text-gray-600" />
              </Dialog.Close>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="rounded-2xl bg-gray-50 border p-4">
                <div className="text-sm font-semibold text-secondary">Chat log</div>
                <div className="mt-3 grid gap-3">
                  {(selected?.chat || []).map((m, idx) => (
                    <div key={idx} className="grid gap-1">
                      <div className="text-xs font-semibold text-secondary">{m.who}</div>
                      <div className="rounded-2xl bg-white border px-4 py-3 text-sm text-gray-700">
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 border p-4">
                <div className="text-sm font-semibold text-secondary">After photos</div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(selected?.afterPhotos || []).length === 0 ? (
                    <div className="text-sm text-gray-600 col-span-full">No photos attached</div>
                  ) : (
                    (selected?.afterPhotos || []).map((p, idx) => (
                      <div key={idx} className="aspect-video rounded-2xl border bg-white flex items-center justify-center text-sm text-gray-600">
                        {p.label}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button className="h-11 rounded-2xl bg-[#0E6D7A] text-white px-5 font-medium hover:opacity-95 transition">
                  Refund
                </button>
                <button className="h-11 rounded-2xl border bg-white text-secondary px-5 font-medium hover:bg-gray-50 transition">
                  Pay Worker
                </button>
                <button className="h-11 rounded-2xl border bg-white text-secondary px-5 font-medium hover:bg-gray-50 transition">
                  Close Dispute
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
