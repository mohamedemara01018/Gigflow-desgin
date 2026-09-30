"use client";

import Link from "next/link";
import { Gem, ShieldCheck, ExternalLink } from "lucide-react";
import { IProposal } from "@/services/proposal.service";
import { IJob } from "@/services/jobs.service";

interface ClientBriefCardProps {
    job?: IJob | null;
    proposal?: IProposal | null;
}

export default function ClientBriefCard({ job: propJob, proposal }: ClientBriefCardProps) {
    const job = propJob || (typeof proposal?.job === "object" ? proposal.job : null);

    if (!job) return null;

    const clientObj = typeof job.client === "object" ? (job.client as any) : null;
    const clientName = clientObj?.companyName || clientObj?.name || (clientObj?.firstName ? `${clientObj.firstName} ${clientObj.lastName || ""}`.trim() : "Client");
    const isPaymentVerified = clientObj?.paymentVerified ?? true;

    const jobTitle = job.title || "Job Posting";
    const budgetAmount = typeof job.budget === "number" ? job.budget : (job.budget as any)?.amount ?? 0;
    const rawJob = job as any;
    const experienceLevel = rawJob.experienceLevel
        ? `${rawJob.experienceLevel.charAt(0).toUpperCase()}${rawJob.experienceLevel.slice(1)} Level`
        : "Expert Level";

    const jobType = rawJob.type
        ? `${rawJob.type.charAt(0).toUpperCase()}${rawJob.type.slice(1)}`
        : "Fixed";

    return (
        <section className="card flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-md bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
                    <Gem size={18} />
                </span>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-body-lg text-on-surface">{clientName}</p>
                        {isPaymentVerified && (
                            <span className="flex items-center gap-1 text-label-sm text-primary bg-primary-container/15 px-2 py-0.5 rounded">
                                <ShieldCheck size={11} />
                                Enterprise Verified
                            </span>
                        )}
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                        Role: {jobTitle}
                        {budgetAmount > 0
                            ? ` · Posted Budget: $${budgetAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : ""}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                        {jobType} · {experienceLevel}
                    </p>
                </div>
            </div>

            {job._id && (
                <Link
                    href={`/jobs/${job._id}`}
                    className="flex items-center gap-1.5 bg-surface-variant text-on-surface text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                >
                    View Original Job
                    <ExternalLink size={14} />
                </Link>
            )}
        </section>
    );
}