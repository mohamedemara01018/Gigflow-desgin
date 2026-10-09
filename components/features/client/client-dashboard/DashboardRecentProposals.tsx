"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileText, User } from "lucide-react";
import { IProposal } from "@/services/proposal.service";
import EmptyState from "@/components/ui/Emptystate";
import UserImage from "@/components/ui/UserImage";
import { formatCurrency, formatDistanceToNow } from "@/utils/functions.utils";
import { ProposalStatus } from "@/utils/enums.utils";

interface DashboardRecentProposalsProps {
    proposals: IProposal[];
    isLoading?: boolean;
}

const STATUS_BADGE: Record<string, string> = {
    [ProposalStatus.PENDING]: "bg-secondary/15 text-secondary",
    [ProposalStatus.SHORTLISTED]: "bg-tertiary/15 text-tertiary",
    [ProposalStatus.ACCEPTED]: "bg-primary/10 text-primary",
    [ProposalStatus.REJECTED]: "bg-error/10 text-error",
    [ProposalStatus.WITHDRAWN]: "bg-surface-container-high text-on-surface-variant",
};

function DashboardProposalRow({ proposal }: { proposal: IProposal }) {
    const freelancerObj =
        typeof proposal.freelancer === "object" && proposal.freelancer !== null
            ? proposal.freelancer
            : null;

    const firstName = freelancerObj?.firstName || "";
    const lastName = freelancerObj?.lastName || "";
    const freelancerName =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : "Candidate";

    const avatarUrl = freelancerObj?.avatar || "";
    const freelancerTitle = freelancerObj?.title || "Freelancer";

    const jobObj =
        typeof proposal.job === "object" && proposal.job !== null
            ? proposal.job
            : null;

    const jobTitle = jobObj?.title || "Project Job";
    const jobId = jobObj?._id || (typeof proposal.job === "string" ? proposal.job : "");

    const submittedTimeAgo = proposal.createdAt
        ? formatDistanceToNow(proposal.createdAt, { addSuffix: true })
        : "Recently";

    const durationText = proposal.estimatedDuration
        ? `${proposal.estimatedDuration.value} ${proposal.estimatedDuration.unit}`
        : "Flexible";

    const statusKey = (proposal.status || ProposalStatus.PENDING).toLowerCase();
    const badgeClass = STATUS_BADGE[statusKey] || "bg-surface-container-high text-on-surface-variant";

    const targetProposalUrl = jobId ? `/client/proposals/job/${jobId}` : `/proposals/${proposal._id}`;

    return (
        <div className="border border-outline-variant rounded-lg p-4 bg-surface-container-low hover:border-outline transition-colors">
            {/* Header: Freelancer + Status */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <UserImage
                        avatarUrl={avatarUrl}
                        firstName={firstName}
                        lastName={lastName}
                        className="w-10 h-10 shrink-0 ring-1 ring-outline-variant"
                    />
                    <div className="min-w-0">
                        <p className="text-body-md font-semibold text-on-surface truncate">
                            {freelancerName}
                        </p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                            {freelancerTitle}
                        </p>
                    </div>
                </div>

                <span className={`text-label-sm px-2.5 py-0.5 rounded-full font-semibold uppercase shrink-0 ${badgeClass}`}>
                    {proposal.status?.replace("_", " ") || "PENDING"}
                </span>
            </div>

            {/* Job Title & Bid Info */}
            <div className="mt-3">
                <p className="text-body-sm font-medium text-on-surface line-clamp-1">
                    Job: {jobTitle}
                </p>
                <div className="flex items-center justify-between text-body-sm mt-1.5 pt-2 border-t border-outline-variant/30">
                    <span className="text-on-surface-variant">Bid Amount:</span>
                    <span className="font-bold text-on-surface">{formatCurrency(proposal.bidAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm mt-1">
                    <span className="text-on-surface-variant">Est. Duration:</span>
                    <span className="font-medium text-on-surface">{durationText}</span>
                </div>
            </div>

            {/* Footer with Timestamp & View Button */}
            <div className="flex items-center justify-between flex-wrap gap-2 mt-3.5 pt-2.5 border-t border-outline-variant/40">
                <span className="flex items-center gap-1 text-label-sm text-on-surface-variant">
                    <Clock size={12} />
                    {submittedTimeAgo}
                </span>

                <Link
                    href={targetProposalUrl}
                    className="inline-flex items-center gap-1 text-label-md text-primary font-medium hover:underline"
                >
                    View Proposal
                    <ArrowRight size={13} />
                </Link>
            </div>
        </div>
    );
}

export default function DashboardRecentProposals({
    proposals,
    isLoading = false,
}: DashboardRecentProposalsProps) {
    return (
        <section className="card p-5!">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-outline-variant/50">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-headline-md font-bold text-on-surface">Recent Proposals</h2>
                    <span className="text-label-sm bg-surface-container-high text-on-surface-variant font-semibold px-2.5 py-0.5 rounded-full">
                        {proposals.length} Total
                    </span>
                </div>

                <Link
                    href="/client/jobs"
                    className="inline-flex items-center gap-1.5 text-label-md text-primary hover:underline font-semibold"
                >
                    View All Proposals
                    <ArrowRight size={14} />
                </Link>
            </div>

            <div className="flex flex-col gap-3.5 mt-4">
                {isLoading ? (
                    <div className="py-8 text-center text-body-md text-on-surface-variant">
                        Loading recent proposals…
                    </div>
                ) : proposals.length === 0 ? (
                    <EmptyState
                        title="No proposals received"
                        description="Proposals submitted by candidates on your open jobs will appear here."
                        size="compact"
                    />
                ) : (
                    proposals.slice(0, 5).map((proposal) => (
                        <DashboardProposalRow key={proposal._id} proposal={proposal} />
                    ))
                )}
            </div>
        </section>
    );
}
