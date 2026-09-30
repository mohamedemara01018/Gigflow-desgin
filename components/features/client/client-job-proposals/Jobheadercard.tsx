'use client';

import { FileEdit, Lock, UserPlus, Wallet, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { IJob } from "@/services/jobs.service";
import { JobType } from "@/utils/enums.utils";

interface JobHeaderCardProps {
    job: IJob | null;
    loading?: boolean;
}

export default function JobHeaderCard({ job, loading }: JobHeaderCardProps) {
    if (loading) {
        return (
            <section className="card flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-primary" size={24} />
            </section>
        );
    }

    if (!job) return null;

    // Helper to format currency/budget
    const formatBudget = () => {
        if (job.type === JobType.HOURLY || job.type === "hourly") {
            if (job.hourlyRateFrom && job.hourlyRateTo) {
                return `$${job.hourlyRateFrom} - $${job.hourlyRateTo}/hr`;
            }
            return "Hourly Rate";
        }
        return `$${job.budget?.toLocaleString() || 0} Fixed Price`;
    };

    // Format relative or published date
    const formattedDate = job.publishedAt
        ? new Date(job.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "Recently";

    return (
        <section className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1.5 text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded capitalize">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {job.status?.toLowerCase() || "Active"}
                    </span>
                    <span>Posted {formattedDate}</span>
                    <span>•</span>
                    <span>Job ID: {job._id}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button className="flex items-center gap-1.5 bg-surface-variant text-on-surface-variant text-label-sm rounded-md px-4 py-2 hover:opacity-90 transition-opacity cursor-pointer">
                        <FileEdit size={15} />
                        Edit Job Brief
                    </button>
                    <button className="flex items-center gap-1.5 bg-surface-variant text-on-surface-variant text-label-sm rounded-md px-4 py-2 hover:opacity-90 transition-opacity cursor-pointer">
                        <Lock size={15} />
                        Close Job
                    </button>
                    <button className="flex items-center gap-1.5 bg-primary text-on-primary text-label-sm rounded-md px-4 py-2 hover:opacity-90 transition-opacity cursor-pointer">
                        <UserPlus size={15} />
                        Invite Talent
                    </button>
                </div>
            </div>

            <h1 className="text-headline-lg text-on-surface mt-3">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-body-sm text-on-surface-variant">
                <span className="flex items-center gap-1.5 font-medium text-on-surface">
                    <Wallet size={14} className="text-on-surface-variant" />
                    {formatBudget()}
                </span>
                {job.duration && (
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {job.duration}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-body-sm text-on-surface-variant">
                <ShieldCheck size={14} className="text-primary" />
                {job.paymentVerified ? "Payment Verified" : "Payment Unverified"}
            </div>
        </section>
    );
}