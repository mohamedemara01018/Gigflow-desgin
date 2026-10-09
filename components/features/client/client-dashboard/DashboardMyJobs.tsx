"use client";

import Link from "next/link";
import { Briefcase, ArrowRight, Clock, Users, ShieldCheck, FileText } from "lucide-react";
import { IJob } from "@/services/jobs.service";
import EmptyState from "@/components/ui/Emptystate";
import { formatCurrency, formatDistanceToNow } from "@/utils/functions.utils";
import { JobStatus } from "@/utils/enums.utils";

interface DashboardMyJobsProps {
    jobs: IJob[];
    isLoading?: boolean;
}

const STATUS_BADGE: Record<string, string> = {
    [JobStatus.OPEN]: "bg-primary/10 text-primary",
    [JobStatus.IN_PROGRESS]: "bg-secondary/15 text-secondary",
    [JobStatus.COMPLETED]: "bg-primary/10 text-primary",
    [JobStatus.CLOSED]: "bg-surface-container-high text-on-surface-variant",
    [JobStatus.DRAFT]: "bg-surface-container-high text-on-surface-variant",
};

function DashboardJobRow({ job }: { job: IJob }) {
    const categoryName =
        typeof job.category === "object" && job.category !== null
            ? job.category.name
            : typeof job.category === "string"
            ? job.category
            : "General";

    const createdTimeAgo = job.createdAt
        ? formatDistanceToNow(job.createdAt, { addSuffix: true })
        : "Recently";

    const isHourly = job.type === "hourly" || job.type === "HOURLY";
    const budgetDisplay = isHourly
        ? job.hourlyRateFrom && job.hourlyRateTo
            ? `$${job.hourlyRateFrom} - $${job.hourlyRateTo}/hr`
            : job.budget
            ? `$${job.budget}/hr`
            : "Hourly"
        : formatCurrency(job.budget);

    const typeLabel = isHourly ? "Hourly" : "Fixed-Price";
    const experienceLabel = job.experienceLevel
        ? `${job.experienceLevel.charAt(0).toUpperCase()}${job.experienceLevel.slice(1).toLowerCase()}`
        : "All levels";

    const statusKey = (job.status || JobStatus.OPEN).toLowerCase();
    const badgeClass = STATUS_BADGE[statusKey] || "bg-surface-container-high text-on-surface-variant";

    return (
        <div className="border border-outline-variant rounded-lg p-4.5 bg-surface-container-low hover:border-outline transition-colors">
            {/* Header / Meta */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-label-sm px-2.5 py-0.5 rounded-full font-semibold uppercase ${badgeClass}`}>
                        {job.status?.replace("_", " ") || "OPEN"}
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                        {categoryName} · Posted {createdTimeAgo}
                    </span>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-body-lg font-bold text-on-surface">{budgetDisplay}</p>
                    <p className="text-label-sm text-on-surface-variant">
                        {typeLabel} · {experienceLabel}
                    </p>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-body-lg font-semibold text-on-surface mt-2.5 hover:text-primary transition-colors">
                <Link href={`/client/proposals/job/${job._id}`}>{job.title}</Link>
            </h3>

            {/* Footer / Info & Navigation */}
            <div className="flex items-center justify-between flex-wrap gap-3 mt-3.5 pt-3 border-t border-outline-variant/40">
                <div className="flex items-center gap-4 text-body-sm text-on-surface-variant flex-wrap">
                    <span className="flex items-center gap-1.5 font-medium text-on-surface">
                        <Users size={14} className="text-primary" />
                        {job.proposalsCount || 0} {job.proposalsCount === 1 ? "Proposal" : "Proposals"}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-primary" />
                        Hires: {job.hiresCount || 0}
                    </span>
                </div>

                <Link
                    href={`/client/proposals/job/${job._id}`}
                    className="inline-flex items-center gap-1.5 text-label-md bg-primary text-on-primary rounded-md px-4 py-2 hover:opacity-90 transition-opacity font-medium"
                >
                    View Proposals
                    <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}

export default function DashboardMyJobs({ jobs, isLoading = false }: DashboardMyJobsProps) {
    return (
        <section className="card p-5!">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-outline-variant/50">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-headline-md font-bold text-on-surface">My Jobs</h2>
                    <span className="text-label-sm bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full">
                        {jobs.length} Listed
                    </span>
                </div>

                <Link
                    href="/client/jobs"
                    className="inline-flex items-center gap-1.5 text-label-md text-primary hover:underline font-semibold"
                >
                    View All Jobs
                    <ArrowRight size={14} />
                </Link>
            </div>

            <div className="flex flex-col gap-3.5 mt-4">
                {isLoading ? (
                    <div className="py-8 text-center text-body-md text-on-surface-variant">
                        Loading your jobs…
                    </div>
                ) : jobs.length === 0 ? (
                    <EmptyState
                        title="No jobs posted yet"
                        description="Post your first job to start receiving proposals from top freelancers."
                        size="compact"
                    />
                ) : (
                    jobs.slice(0, 5).map((job) => <DashboardJobRow key={job._id} job={job} />)
                )}
            </div>
        </section>
    );
}
