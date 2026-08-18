"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface ProfileStrengthCardProps {
    percentage?: number;
}

export function ProfileStrengthCard({ percentage = 85 }: ProfileStrengthCardProps) {
    return (
        <section className="bg-primary text-on-primary rounded-lg p-6">
            <p className="text-body-lg font-bold">Profile Strength</p>
            <p className="text-body-sm opacity-90 mt-1">
                A complete profile attracts 3x more clients.
            </p>
            <p className="text-display-lg !text-[40px] !leading-none font-bold mt-4">
                {percentage}%
            </p>
            <div className="h-2 rounded-full bg-on-primary/20 mt-3 overflow-hidden">
                <div
                    className="h-full rounded-full bg-on-primary"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <span className="flex items-center gap-2 text-body-sm">
                    <CheckCircle2 size={15} />
                    Basic Info
                </span>
                <span className="flex items-center gap-2 text-body-sm">
                    <CheckCircle2 size={15} />
                    Hourly Rate
                </span>
                <span className="flex items-center gap-2 text-body-sm opacity-80">
                    <Circle size={15} />
                    Add Portfolio Items (+15%)
                </span>
            </div>
        </section>
    );
}