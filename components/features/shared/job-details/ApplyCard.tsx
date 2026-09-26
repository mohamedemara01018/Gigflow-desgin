"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { IJob } from "@/services/jobs.service";
import BookmarkButton from "@/components/ui/BookmarkButton";

interface ApplyCardProps {
    job: IJob;
}

export default function ApplyCard({ job }: ApplyCardProps) {
    const isJobOpen = job?.status === "open" || job?.status === "ACTIVE";

    const categoryName =
        typeof job?.category === "object" && job.category !== null
            ? job.category.name
            : "relevant field";

    return (
        <section className="card flex flex-col gap-3">
            {isJobOpen ? (
                <Link
                    href={`/freelancer/jobs/${job._id}/apply`}
                    className="w-full bg-primary text-on-primary text-label-md rounded-md py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium"
                >
                    <Send size={16} />
                    Apply Now
                </Link>
            ) : (
                <button
                    disabled
                    className="w-full bg-surface-container-high text-on-surface-variant text-label-md rounded-md py-3 cursor-not-allowed opacity-60 font-medium"
                >
                    Job Closed
                </button>
            )}

            <BookmarkButton
                jobId={job._id}
                variant="button"
                className="w-full py-3 font-medium"
            />

            {job?.proposalsCount !== undefined && (
                <div className="border-t border-outline-variant pt-3 mt-1 flex justify-between items-center text-body-sm text-on-surface-variant">
                    <span>Proposals Submitted:</span>
                    <span className="font-semibold text-on-surface">
                        {job.proposalsCount}
                    </span>
                </div>
            )}

            <p className="text-body-sm text-on-surface-variant text-center mt-1">
                Pro Tip: Highlight your {categoryName} experience in your proposal.
            </p>
        </section>
    );
}