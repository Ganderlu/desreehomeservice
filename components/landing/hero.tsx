"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import LandingNavbar from "./navbar";
import { Button } from "../ui/button";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <LandingNavbar />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-white to-accent/25" />
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2400&q=80"
          alt="Modern Nigerian home in an estate"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/30 to-transparent" />
      </div>

      <div className="relative container-padded pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white">
            <BadgeCheck size={18} className="text-primary" />
            <span className="text-sm font-medium">
              Awka & Onitsha • Verified local pros
            </span>
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Fix Your Home, Fix Your Day
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Reliable plumbers, electricians, cleaners, painters & more at your
            fingertips in Awka & Onitsha.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/customer">
              <Button className="h-12 rounded-2xl bg-accent text-white hover:opacity-90 px-7 text-base">
                Book a Service Now
              </Button>
            </Link>
            <Link href="/get-started?role=worker">
              <Button className="h-12 rounded-2xl bg-primary text-white hover:opacity-90 px-7 text-base">
                Join as a Worker
              </Button>
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/90">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-accent" />
              Trusted by 5,000+ homes in Anambra
            </div>
            <span className="text-white/60">•</span>
            <div>Secure payments with Paystack (Escrow)</div>
          </div>

          <div id="locations" className="mt-8 inline-flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 border border-white/20 px-4 py-2 text-sm text-white">
              Awka (GRA, Ifite, Amansea)
            </span>
            <span className="rounded-full bg-white/15 border border-white/20 px-4 py-2 text-sm text-white">
              Onitsha (GRA, Fegge, Inland Town)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
