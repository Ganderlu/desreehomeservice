"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Home, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type NavItem = {
  label: string;
  href?: string;
  items?: Array<{ label: string; href: string }>;
};

const nav: NavItem[] = [
  {
    label: "Services",
    items: [
      { label: "All Services", href: "#services" },
      { label: "Plumbing", href: "#services" },
      { label: "Electrical Repairs", href: "#services" },
      { label: "Deep Cleaning", href: "#services" },
      { label: "AC Repair", href: "#services" },
      { label: "Generator Repair", href: "#services" },
    ],
  },
  {
    label: "How it Works",
    items: [
      { label: "Overview", href: "#how-it-works" },
      { label: "Escrow payments", href: "#how-it-works" },
      { label: "Live tracking", href: "#how-it-works" },
    ],
  },
  {
    label: "For Workers",
    items: [
      { label: "Benefits", href: "#for-workers" },
      { label: "Register", href: "#for-workers" },
    ],
  },
  {
    label: "Locations",
    items: [
      { label: "Awka (GRA, Ifite)", href: "#locations" },
      { label: "Onitsha (GRA, Fegge)", href: "#locations" },
    ],
  },
];

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-40">
      <div className="container-padded pt-5">
        <div className="h-16 rounded-3xl border border-white/15 bg-white/10 backdrop-blur px-5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Home className="text-white" size={20} />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-white">Desree</div>
              <div className="text-xs text-white/70 flex items-center gap-1">
                <MapPin size={12} className="text-white/80" />
                Home Service
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((n) => (
              <DropdownMenu.Root key={n.label}>
                <DropdownMenu.Trigger asChild>
                  <button className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white transition">
                    {n.label}
                    <ChevronDown size={16} className="opacity-80" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={10}
                    className="min-w-[220px] rounded-2xl border bg-white p-2 shadow-lg"
                  >
                    {(n.items || []).map((it) => (
                      <DropdownMenu.Item key={it.label} asChild>
                        <a
                          href={it.href}
                          className="block rounded-xl px-3 py-2 text-sm text-secondary hover:bg-gray-50 outline-none"
                        >
                          {it.label}
                        </a>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
                <Dialog.Trigger asChild>
                  <button className="h-11 w-11 rounded-2xl border border-white/15 bg-white/10 hover:bg-white/15 transition flex items-center justify-center">
                    <Menu size={18} className="text-white" />
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                  <Dialog.Content className="fixed inset-0 bg-gradient-to-br from-secondary/90 via-primary/70 to-accent/40 text-white">
                    <div className="container-padded pt-6 pb-10 h-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          href="/"
                          className="flex items-center gap-3"
                          onClick={() => setMobileOpen(false)}
                        >
                          <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                            <Home className="text-white" size={20} />
                          </div>
                          <div className="leading-tight">
                            <div className="font-bold text-white text-lg">Desree</div>
                            <div className="text-xs text-white/75 flex items-center gap-1">
                              <MapPin size={12} className="text-white/80" />
                              Awka & Onitsha
                            </div>
                          </div>
                        </Link>
                        <Dialog.Close asChild>
                          <button className="h-11 w-11 rounded-2xl border border-white/15 bg-white/10 hover:bg-white/15 transition flex items-center justify-center">
                            <X size={18} className="text-white" />
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="mt-6 grid gap-3">
                        <Link href="/get-started" onClick={() => setMobileOpen(false)}>
                          <Button className="h-12 w-full rounded-2xl bg-accent text-white hover:opacity-90 text-base">
                            Get Started
                          </Button>
                        </Link>
                        <Link href="/auth" onClick={() => setMobileOpen(false)}>
                          <Button
                            variant="outline"
                            className="h-12 w-full rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/15 text-base"
                          >
                            Login
                          </Button>
                        </Link>
                      </div>

                      <div className="mt-8 flex-1 overflow-auto">
                        <div className="grid gap-6">
                          {nav.map((group) => (
                            <div key={group.label} className="rounded-3xl border border-white/15 bg-white/10 p-5">
                              <div className="text-sm font-semibold tracking-wide text-white/90">
                                {group.label}
                              </div>
                              <div className="mt-3 grid gap-1">
                                {(group.items || []).map((it) => (
                                  <a
                                    key={it.label}
                                    href={it.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-2xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10 transition"
                                  >
                                    {it.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 text-center text-xs text-white/75">
                        Trusted home services for Awka & Onitsha
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>

            <Link href="/auth" className="hidden lg:block">
              <Button
                variant="ghost"
                className="h-11 rounded-2xl text-white hover:bg-white/10 px-4"
              >
                Login
              </Button>
            </Link>
            <Link href="/get-started" className="hidden lg:block">
              <Button
                className={cn(
                  "h-11 rounded-2xl bg-accent text-white hover:opacity-90 px-5",
                )}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
