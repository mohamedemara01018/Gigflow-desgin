"use client";

import Link from "next/link";
import { Send, CheckCircle2, FileEdit } from "lucide-react";
import { IJob } from "@/services/jobs.service";
import { IProposal } from "@/services/proposal.service";
import { ProposalStatus } from "@/utils/enums.utils";
import BookmarkButton from "@/components/ui/BookmarkButton";

interface ApplyCardProps {
    job: IJob;
    isApplied?: boolean;
    proposal?: IProposal | null;
}

export default function ApplyCard({
    job,
    isApplied = false,
    proposal,
}: ApplyCardProps) {
    const isJobOpen = job?.status === "open" || job?.status === "ACTIVE";
    const isPending = proposal?.status === ProposalStatus.PENDING;

    const categoryName =
        typeof job?.category === "object" && job.category !== null
            ? job.category.name
            : "relevant field";

    return (
        <section className="card flex flex-col gap-3">
            {/* Display Applied State / Action CTA */}
            {isApplied ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2 w-full bg-success/15 text-success rounded-md py-2.5 px-3 text-label-md font-medium border border-success/20">
                        <CheckCircle2 size={18} />
                        <span className="capitalize">
                            Proposal {proposal?.status || "Submitted"}
                        </span>
                    </div>

                    {/* Render Edit button strictly if the proposal is pending and job is open */}
                    {isPending && isJobOpen && proposal?._id && (
                        <Link
                            href={`/freelancer/proposals/${proposal._id}/update`}
                            className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-md rounded-md py-2.5 flex items-center justify-center gap-2 transition-colors font-medium border border-outline-variant"
                        >
                            <FileEdit size={16} />
                            Edit Proposal
                        </Link>
                    )}
                </div>
            ) : isJobOpen ? (
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