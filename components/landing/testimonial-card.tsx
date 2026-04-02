"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export type TestimonialCardProps = {
  name: string;
  location: string;
  rating: number;
  quote: string;
};

export default function TestimonialCard({ name, location, rating, quote }: TestimonialCardProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <Card className="rounded-2xl hover:shadow-md transition">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-secondary/10 border flex items-center justify-center font-semibold text-secondary">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-secondary">{name}</div>
            <div className="text-sm text-gray-500">{location}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "text-accent fill-accent" : "text-gray-300"}
            />
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-700 leading-relaxed">“{quote}”</div>
      </CardContent>
    </Card>
  );
}

