"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Send } from "lucide-react";
import { IJob } from "@/services/jobs.service";

interface ApplyCardProps {
    job: IJob;
    onSaveToggle?: (jobId: string, isSaved: boolean) => void;
    isSavedInitially?: boolean;
}

export default function ApplyCard({
    job,
    onSaveToggle,
    isSavedInitially = false,
}: ApplyCardProps) {
    const [isSaved, setIsSaved] = useState(isSavedInitially);

    const handleSaveClick = () => {
        const nextState = !isSaved;
        setIsSaved(nextState);
        if (onSaveToggle && job._id) {
            onSaveToggle(job._id, nextState);
        }
    };

    const isJobOpen = job?.status === "open" || job?.status === "ACTIVE";

    // Extract category title or fallback safely
    const categoryName =
        typeof job?.category === "object" && job.category !== null
            ? job.category.name
            : "relevant field";

    return (
        <section className="card flex flex-col gap-3">
            {isJobOpen ? (
                <Link
                    href={`/jobs/${job._id}/apply`}
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

            <button
                type="button"
                onClick={handleSaveClick}
                className="w-full bg-surface border border-outline-variant text-on-surface text-label-md rounded-md py-3 flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer font-medium"
            >
                <Heart
                    size={16}
                    className={
                        isSaved ? "fill-tertiary text-tertiary" : ""
                    }
                />
                {isSaved ? "Saved Job" : "Save Job"}
            </button>

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