"use client";

import { Card, CardContent } from "../ui/card";

export type StepCardProps = {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default function StepCard({ step, title, description, icon }: StepCardProps) {
  return (
    <Card className="rounded-2xl hover:shadow-md transition">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            {icon}
          </div>
          <div className="text-sm font-semibold text-secondary/70">{step}</div>
        </div>
        <div className="mt-4 font-semibold text-secondary">{title}</div>
        <div className="mt-1 text-sm text-gray-600">{description}</div>
      </CardContent>
    </Card>
  );
}

