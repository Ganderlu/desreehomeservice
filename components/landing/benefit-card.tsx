"use client";

import { Card, CardContent } from "../ui/card";

export type BenefitCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default function BenefitCard({ title, description, icon }: BenefitCardProps) {
  return (
    <Card className="rounded-2xl hover:shadow-md transition">
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          {icon}
        </div>
        <div className="mt-4 font-semibold text-secondary">{title}</div>
        <div className="mt-1 text-sm text-gray-600">{description}</div>
      </CardContent>
    </Card>
  );
}

