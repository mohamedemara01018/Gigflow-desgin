import React from "react";
import { LucideIcon } from "lucide-react";

export interface JobDetailItem {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
}

interface JobDetailsCardProps {
    JOB_DETAILS: JobDetailItem[];
}

export default function JobDetailsCard({ JOB_DETAILS }: JobDetailsCardProps) {
    return (
        <section className="card">
            <h3 className="text-headline-md text-[16px]! leading-6! text-on-surface pb-3 border-b border-outline-variant">
                Job Details
            </h3>
            <div className="flex flex-col gap-4 mt-4">
                {JOB_DETAILS.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                        <span className="text-primary mt-0.5 shrink-0">
                            <Icon size={20} />
                        </span>
                        <div className="flex flex-col min-w-0">
                            <p className="text-body-md text-on-surface font-medium wrap-break-word">
                                {value}
                            </p>
                            <p className="text-body-sm text-on-surface-variant">
                                {label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}