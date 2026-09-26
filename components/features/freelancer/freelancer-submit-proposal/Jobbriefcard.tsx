'use client';

import ReadOnlyOverview from "@/components/ui/ReadOnlyOverview";
import { IJob } from "@/services/jobs.service";
import { BadgeCheck, Users2, DollarSign, GraduationCap, CalendarClock, MapPin } from "lucide-react";
import Link from "next/link";

interface JobBriefCardProps {
    job: IJob | null;
}

export default function JobBriefCard({ job }: JobBriefCardProps) {
    if (!job) return null;

    const isHourly = job.type === "HOURLY" || job.type === "Hourly";
    const budgetValue = isHourly && job.hourlyRateFrom && job.hourlyRateTo
        ? `$${job.hourlyRateFrom} - $${job.hourlyRateTo}/hr`
        : `$${(job.budget || 0).toLocaleString()}`;

    const JOB_STATS = [
        {
            icon: DollarSign,
            label: isHourly ? "Hourly Rate" : "Client Budget",
            value: budgetValue,
            sub: isHourly ? "Hourly Tier" : "Fixed-Price Tier"
        },
        {
            icon: GraduationCap,
            label: "Experience Level",
            value: typeof job.experienceLevel === "string" ? job.experienceLevel : "Any",
            sub: "Required"
        },
        {
            icon: CalendarClock,
            label: "Engagement",
            value: typeof job.duration === "string" ? job.duration : "Ongoing",
            sub: "Project-based"
        },
        {
            icon: MapPin,
            label: "Location",
            value: job.location || "Worldwide",
            sub: "Remote"
        },
    ];

    // Format category for tags (handle both populated object and raw string ID scenarios)
    const categoryName = typeof job.category === "object" && job.category !== null
        ? job.category.name
        : "General";

    // Format publication date
    const postedDate = job.publishedAt
        ? new Date(job.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recently';

    return (
        <section className="card border-l-4 border-l-primary p-6 bg-surface-container-lowest rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded">
                    {job.paymentVerified && <BadgeCheck size={13} />}
                    {job.paymentVerified ? "Verified Client" : "Unverified Client"}
                </span>
                <div className="flex items-center gap-4 text-body-sm text-on-surface-variant">
                    <span>Posted {postedDate}</span>
                    <span className="flex items-center gap-1.5">
                        <Users2 size={14} />
                        {job.proposalsCount} {job.maxProposals ? `/ ${job.maxProposals}` : ""} Proposals received
                    </span>
                </div>
            </div>

            <h1 className="text-headline-lg text-on-surface mt-4">{job.title}</h1>

            <p className="text-body-md text-on-surface-variant mt-3 line-clamp-2">
                <ReadOnlyOverview content={job.description} clampLines={true} />
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {JOB_STATS.map(({ icon: Icon, label, value, sub }) => (
                    <div key={label} className="bg-surface-container-high border border-outline-variant rounded-md p-3">
                        <p className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            <Icon size={13} />
                            {label}
                        </p>
                        <p className="text-body-lg text-on-surface mt-1 capitalize">{value}</p>
                        <p className="text-label-sm text-on-surface-variant capitalize">{sub}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                <div className="flex flex-wrap gap-2">
                    <span className="text-label-sm text-on-surface-variant bg-surface-container-high rounded px-2.5 py-1">
                        {categoryName}
                    </span>
                    <span className="text-label-sm text-on-surface-variant bg-surface-container-high rounded px-2.5 py-1 capitalize">
                        {typeof job.type === 'string' ? job.type.toLowerCase().replace('_', ' ') : 'Job'}
                    </span>
                </div>
                <Link href={`/jobs/${job._id}`} className="text-label-md text-primary hover:underline underline-offset-2 cursor-pointer shrink-0">
                    View Full Brief
                </Link>
            </div>
        </section>
    );
}