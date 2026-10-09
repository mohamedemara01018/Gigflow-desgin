"use client";

import React from "react";
import Link from "next/link";
import {
    X,
    ExternalLink,
    Calendar,
    DollarSign,
    Briefcase,
    Clock,
    User,
    FileText,
    CheckCircle2,
    Eye,
} from "lucide-react";
import SmallLoading from "@/components/ui/SmallLoading";
import UserImage from "@/components/ui/UserImage";
import { IProposal } from "@/services/proposal.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import AdminProposalStatusBadge from "../features/admin/admin-proposals-page/AdminProposalStatusBadge";

interface AdminProposalDetailsModalProps {
    proposal: IProposal | null;
    loading: boolean;
    onClose: () => void;
}

export default function AdminProposalDetailsModal({
    proposal,
    loading,
    onClose,
}: AdminProposalDetailsModalProps) {
    if (!proposal && !loading) return null;

    const freelancer = proposal?.freelancer;
    const job = proposal?.job;

    const freelancerName = freelancer
        ? `${freelancer.firstName ?? ""} ${freelancer.lastName ?? ""}`.trim() || "Freelancer"
        : "Unknown Freelancer";

    const jobClient =
        typeof job?.client === "object" && job?.client !== null
            ? `${job.client.firstName ?? ""} ${job.client.lastName ?? ""}`.trim()
            : "Client";

    const durationStr = proposal?.estimatedDuration
        ? `${proposal.estimatedDuration.value} ${proposal.estimatedDuration.unit}`
        : "Not specified";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-[320px] max-w-3xl space-y-4 relative w-full overflow-hidden my-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-primary" />
                        <h3 className="text-title-medium font-semibold text-on-surface">
                            Proposal Overview
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading || !proposal ? (
                    <div className="min-h-60 flex items-center justify-center p-8">
                        <SmallLoading />
                    </div>
                ) : (
                    <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
                        {/* Top Summary */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-title-medium font-bold text-on-surface">
                                        Proposal by {freelancerName}
                                    </h4>
                                    <AdminProposalStatusBadge status={proposal.status} />
                                </div>
                                <p className="text-body-sm text-on-surface-variant font-mono">
                                    ID: {proposal._id}
                                </p>
                            </div>
                            <div className="text-left sm:text-right bg-surface-container-high px-4 py-2 rounded-md border border-outline-variant shrink-0">
                                <span className="text-label-sm text-on-surface-variant block">
                                    Bid Amount
                                </span>
                                <span className="text-headline-sm font-bold text-primary">
                                    {formatCurrency(proposal.bidAmount || 0)}
                                </span>
                            </div>
                        </div>

                        {/* Freelancer Profile Card */}
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                                    Freelancer Profile
                                </span>
                                {freelancer?._id && (
                                    <Link
                                        href={`/profile/${freelancer._id}`}
                                        className="text-label-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        View Full Profile
                                        <ExternalLink size={12} />
                                    </Link>
                                )}
                            </div>
                            <div className="flex items-start gap-3.5">
                                <UserImage
                                    avatarUrl={freelancer?.avatar}
                                    firstName={freelancer?.firstName || ""}
                                    lastName={freelancer?.lastName || ""}
                                    className="w-12 h-12 rounded-full shrink-0"
                                />
                                <div className="space-y-1">
                                    <p className="text-body-md font-semibold text-on-surface">
                                        {freelancerName}
                                    </p>
                                    <p className="text-body-sm text-on-surface-variant font-medium">
                                        {freelancer?.title || "Freelancer"}
                                    </p>
                                    <p className="text-label-sm text-on-surface-variant">
                                        {freelancer?.email}
                                    </p>
                                    {freelancer?.bio && (
                                        <p className="text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                            {freelancer.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Job Information */}
                        {job && (
                            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                                        Target Job Posting
                                    </span>
                                    <Link
                                        href={`/jobs/${job._id}`}
                                        target="_blank"
                                        className="text-label-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        Open Job Listing
                                        <ExternalLink size={12} />
                                    </Link>
                                </div>
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-body-md font-semibold text-on-surface">
                                            {job.title}
                                        </p>
                                        <p className="text-body-sm text-on-surface-variant">
                                            Posted by {jobClient} · Type: {job.type || "Fixed"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-label-sm text-on-surface-variant block">
                                            Job Budget
                                        </span>
                                        <span className="text-body-md font-semibold text-on-surface">
                                            {formatCurrency(job.budget || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bid Details & Duration */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant">
                                <span className="text-label-sm text-on-surface-variant block">
                                    Estimated Delivery
                                </span>
                                <span className="text-body-md font-semibold text-on-surface capitalize mt-1 block">
                                    {durationStr}
                                </span>
                            </div>
                            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant">
                                <span className="text-label-sm text-on-surface-variant block">
                                    Client Viewed
                                </span>
                                <span className="text-body-md font-semibold text-on-surface mt-1 block">
                                    {proposal.clientViewed ? "Yes" : "No"}
                                </span>
                            </div>
                            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant">
                                <span className="text-label-sm text-on-surface-variant block">
                                    Submitted Date
                                </span>
                                <span className="text-body-md font-semibold text-on-surface mt-1 block">
                                    {proposal.createdAt ? formatDateTime(proposal.createdAt).date : "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-2">
                            <span className="text-label-md font-semibold text-on-surface-variant">
                                Cover Letter / Pitch
                            </span>
                            <div className="text-body-md text-on-surface whitespace-pre-line bg-surface-container p-3.5 rounded-md border border-outline-variant/60 max-h-56 overflow-y-auto">
                                {proposal.coverLetter || "No cover letter provided."}
                            </div>
                        </div>

                        {/* Footer Link */}
                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                            <span className="text-label-sm text-on-surface-variant">
                                Direct proposal review workspace
                            </span>
                            <Link
                                href={`/proposals/${proposal._id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors text-body-sm font-medium"
                            >
                                Open Proposal Page
                                <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
