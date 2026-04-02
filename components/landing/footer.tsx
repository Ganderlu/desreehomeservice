"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, X } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="container-padded py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20" />
              <div>
                <div className="font-bold text-secondary">Desree Home Service</div>
                <div className="text-sm text-gray-600">Reliable home services in Anambra</div>
              </div>
            </Link>
            <div className="mt-4 text-sm text-gray-600 leading-relaxed">
              Book trusted artisans near you, track jobs in real-time, and pay securely with escrow for peace of mind.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 xl:col-span-2">
            <div>
              <div className="font-semibold text-secondary">Quick Links</div>
              <div className="mt-4 grid gap-2 text-sm">
                <a href="#services" className="text-gray-600 hover:text-secondary transition">Services</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-secondary transition">How it Works</a>
                <a href="#for-workers" className="text-gray-600 hover:text-secondary transition">For Workers</a>
                <Link href="/" className="text-gray-600 hover:text-secondary transition">Blog</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold text-secondary">Company</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link href="/" className="text-gray-600 hover:text-secondary transition">About</Link>
                <Link href="/" className="text-gray-600 hover:text-secondary transition">Careers</Link>
                <Link href="/" className="text-gray-600 hover:text-secondary transition">Contact</Link>
              </div>
              <div className="mt-6 font-semibold text-secondary">Legal</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link href="/" className="text-gray-600 hover:text-secondary transition">Privacy</Link>
                <Link href="/" className="text-gray-600 hover:text-secondary transition">Terms</Link>
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-secondary">Contact</div>
            <div className="mt-4 grid gap-2 text-sm text-gray-600">
              <div>Awka & Onitsha, Anambra State</div>
              <div>support@desree.ng</div>
              <div>+234 803 000 0000</div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" className="h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center justify-center">
                <MessageCircle size={18} className="text-primary" />
              </a>
              <a href="#" className="h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center justify-center">
                <Instagram size={18} className="text-secondary" />
              </a>
              <a href="#" className="h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center justify-center">
                <Facebook size={18} className="text-secondary" />
              </a>
              <a href="#" className="h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 transition flex items-center justify-center">
                <X size={18} className="text-secondary" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-3 border-t pt-6 text-sm text-gray-600">
          <div>© 2026 Desree Home Service. All rights reserved.</div>
          <div>Made for Awka & Onitsha, Anambra</div>
        </div>
      </div>
    </footer>
  );
}

