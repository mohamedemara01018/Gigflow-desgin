'use client';

import ReadOnlyOverview from "@/components/ui/ReadOnlyOverview";
import { IJob } from "@/services/jobs.service";
import {
    Bookmark,
    Clock,
    Banknote,
    TrendingUp,
    ShieldCheck,
    Star,
    Award,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Utility function to format relative time
function formatPostedTime(dateString?: string): string {
    if (!dateString) return "Recently posted";
    const now = new Date();
    const posted = new Date(dateString);
    const diffInMs = now.getTime() - posted.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) return "Posted just now";
    if (diffInHours < 24) return `Posted ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Posted ${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}

// Utility function to format pay label
function formatPayLabel(job: IJob): string {
    if (job.type === "hourly") {
        if (job.hourlyRateFrom && job.hourlyRateTo) {
            return `$${job.hourlyRateFrom} - $${job.hourlyRateTo} / hr`;
        }
        return `$${job.budget} / hr`;
    }
    return `$${job.budget.toLocaleString()} Fixed Price`;
}

function JobCard({ job }: { job: IJob }) {
    const router = useRouter();

    // Extract category name safely if populated or plain string
    const categoryName = typeof job.category === "object" && job.category !== null
        ? job.category.name
        : (job.category || "General");

    return (
        <article className="card relative p-6 bg-surface border border-outline-variant rounded-xl shadow-xs">
            <button
                type="button"
                aria-label="Save job"
                className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
                <Bookmark size={20} />
            </button>

            <span className="text-label-sm uppercase tracking-wide text-primary font-semibold">
                {categoryName}
            </span>

            <h3
                className="text-headline-md text-on-surface mt-1 font-semibold hover:text-primary cursor-pointer transition-colors"
                onClick={() => router.push(`/jobs/${job._id}`)}
            >
                {job.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-on-surface-variant">
                <span className="flex items-center gap-1.5 text-body-sm">
                    <Clock size={16} />
                    {formatPostedTime(job.publishedAt || job.createdAt)}
                </span>

                <span className="flex items-center gap-1.5 text-body-sm font-medium text-on-surface">
                    <Banknote size={16} />
                    {formatPayLabel(job)}
                </span>

                <span className="flex items-center gap-1.5 text-body-sm capitalize">
                    {job.experienceLevel === "entry" ? (
                        <Star size={16} />
                    ) : job.experienceLevel === "intermediate" ? (
                        <TrendingUp size={16} />
                    ) : (
                        <Award size={16} />
                    )}
                    {job.experienceLevel} Level
                </span>

                {job.paymentVerified && (
                    <span className="flex items-center gap-1.5 text-body-sm text-primary font-medium">
                        <ShieldCheck size={16} />
                        Payment Verified
                    </span>
                )}
            </div>

            <p className="text-body-md text-on-surface-variant mt-4 leading-relaxed line-clamp-3">
                <ReadOnlyOverview content={job.description} tabletWidth="100%" width="100%" clampLines={true} />
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
                <span className="bg-surface-container-high text-on-surface-variant text-label-md px-3 py-1 rounded-full capitalize">
                    {job.type}
                </span>
                <span className="bg-surface-container-high text-on-surface-variant text-label-md px-3 py-1 rounded-full">
                    {job.location || "Remote"}
                </span>
            </div>
        </article>
    );
}

export default JobCard;