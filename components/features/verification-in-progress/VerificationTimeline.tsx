import React from 'react'
import TimelineDot from './TimelineDot';
import { Clock } from 'lucide-react';
import { VerificationStatus } from '@/utils/enums.utils';

const TIMELINE: {
    status: VerificationStatus;
    title: string;
    description: string;
    badge?: string;
}[] = [
        {
            status: VerificationStatus.PENDING,
            title: "Documents Submitted",
            description: "Your identity documents were successfully uploaded securely.",
        },
        {
            status: VerificationStatus.IN_REVIEW,
            title: "Admin Review",
            description: "Our compliance team is verifying your information.",
            badge: "Estimated wait: Less than 24 hours",
        },
        {
            status: VerificationStatus.APPROVED,
            title: "Verification Complete",
            description: "You'll receive an email notification once approved.",
        },
    ];


function VerificationTimeline({ status }: { status: VerificationStatus }) {
    return (
        <section className="card">
            <h2 className="text-headline-md text-on-surface">
                Verification Timeline
            </h2>

            <div className="flex flex-col mt-6">
                {TIMELINE.map((item, i) => (
                    <div key={item.title} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <TimelineDot status={item.status} />
                            {i < TIMELINE.length - 1 && (
                                <span
                                    className={`w-0.5 flex-1 min-h-10 ${item.status === status ? "bg-primary" : "bg-outline-variant"
                                        }`}
                                />
                            )}
                        </div>
                        <div className="pb-6">
                            <p
                                className={`text-body-md font-medium ${item.status === status
                                    ? "text-on-surface-variant"
                                    : "text-on-surface"
                                    }`}
                            >
                                {item.title}
                            </p>
                            <p className="text-body-sm text-on-surface-variant mt-1">
                                {item.description}
                            </p>
                            {item.badge && (
                                <span className="inline-flex items-center gap-1.5 bg-surface-container-low text-on-surface-variant text-body-sm px-3 py-1.5 rounded-md mt-3">
                                    <Clock size={14} />
                                    {item.badge}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default VerificationTimeline