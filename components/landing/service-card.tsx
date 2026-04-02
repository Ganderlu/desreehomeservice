"use client";

import { cn } from "../../lib/utils";

export type ServiceCardProps = {
  icon: React.ReactNode;
  name: string;
  priceFrom: number;
  gradientClassName: string;
};

export default function ServiceCard({
  icon,
  name,
  priceFrom,
  gradientClassName,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md",
        "min-w-[170px] sm:min-w-0",
        gradientClassName,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(180px_circle_at_20%_20%,rgba(255,255,255,0.9),transparent)]" />
      <div className="relative">
        <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
          <div className="text-white">{icon}</div>
        </div>
        <div className="mt-5 text-white font-semibold">{name}</div>
        <div className="mt-2 text-white/90 text-sm">
          ₦ {priceFrom.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
