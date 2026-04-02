"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const pathname = usePathname();
  const hide =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/get-started") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/worker");

  if (hide) return null;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container-padded flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="font-semibold text-secondary">Desree</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/customer" className="text-secondary hover:text-primary">
            Customer!!!
          </Link>
          <Link href="/worker" className="text-secondary hover:text-primary">
            Worker
          </Link>
          <Link href="/admin" className="text-secondary hover:text-primary">
            Admin!!
          </Link>
        </nav>
      </div>
    </header>
  );
}
