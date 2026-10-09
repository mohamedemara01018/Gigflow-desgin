"use client";

import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";
import UserImage from "@/components/ui/UserImage";
import Pagination from "@/components/ui/Pagination";
import { IProposal } from "@/services/proposal.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import { Eye, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import AdminProposalStatusBadge from "./AdminProposalStatusBadge";

interface IPagination {
    totalProposals: number;
    currentPage: number;
    totalPages: number;
}

interface AdminProposalTableProps {
    proposals: IProposal[];
    loading: boolean;
    pagination: IPagination;
    onSelectProposal: (proposalId: string) => void;
    onPageChange: (page: number) => void;
}

export default function AdminProposalTable({
    proposals,
    loading,
    pagination,
    onSelectProposal,
    onPageChange,
}: AdminProposalTableProps) {
    const TOTAL_COLUMNS = 7;

    return (
        <>
            <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* Header */}
                        <thead className="bg-surface-container-high">
                            <tr className="border-b border-outline-variant">
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Freelancer
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Related Job
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Bid Amount
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Duration
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Submitted
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-outline-variant">
                            {loading ? (
                                <tr>
                                    <td colSpan={TOTAL_COLUMNS}>
                                        <div className="min-h-60 flex items-center justify-center">
                                            <SmallLoading />
                                        </div>
                                    </td>
                                </tr>
                            ) : proposals.length === 0 ? (
                                <tr>
                                    <td colSpan={TOTAL_COLUMNS}>
                                        <EmptyState
                                            size="compact"
                                            title="No proposals found matching your filters."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                proposals.map((proposal) => {
                                    const freelancerObj = proposal.freelancer;
                                    const jobObj = proposal.job;

                                    const freelancerName = freelancerObj
                                        ? `${freelancerObj.firstName ?? ""} ${freelancerObj.lastName ?? ""}`.trim() || "Freelancer"
                                        : "Unknown Freelancer";

                                    const jobClient =
                                        typeof jobObj?.client === "object" && jobObj?.client !== null
                                            ? `${jobObj.client.firstName ?? ""} ${jobObj.client.lastName ?? ""}`.trim()
                                            : "Client";

                                    const submittedDate = proposal.createdAt
                                        ? formatDateTime(proposal.createdAt).date
                                        : "N/A";

                                    const durationStr = proposal.estimatedDuration
                                        ? `${proposal.estimatedDuration.value} ${proposal.estimatedDuration.unit}`
                                        : "N/A";

                                    return (
                                        <tr
                                            key={proposal._id}
                                            className="group hover:bg-surface-container-high transition-colors"
                                        >
                                            {/* Freelancer */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <UserImage
                                                        avatarUrl={freelancerObj?.avatar}
                                                        firstName={freelancerObj?.firstName || ""}
                                                        lastName={freelancerObj?.lastName || ""}
                                                        className="w-8 h-8 rounded-full shrink-0"
                                                    />
                                                    <div className="flex flex-col max-w-[150px]">
                                                        <span className="text-body-sm font-semibold text-on-surface truncate">
                                                            {freelancerName}
                                                        </span>
                                                        <span className="text-label-sm text-on-surface-variant truncate">
                                                            {freelancerObj?.title || freelancerObj?.email || "Freelancer"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Related Job */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col max-w-xs">
                                                    {jobObj ? (
                                                        <>
                                                            <Link
                                                                href={`/jobs/${jobObj._id}`}
                                                                target="_blank"
                                                                className="text-body-sm font-medium text-on-surface hover:text-primary transition-colors hover:underline truncate"
                                                                title={jobObj.title}
                                                            >
                                                                {jobObj.title}
                                                            </Link>
                                                            <span className="text-label-sm text-on-surface-variant truncate">
                                                                By {jobClient} · Budget: {formatCurrency(jobObj.budget || 0)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-body-sm text-on-surface-variant italic">
                                                            Job details unavailable
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Bid Amount */}
                                            <td className="px-5 py-4">
                                                <span className="text-body-md font-semibold text-on-surface">
                                                    {formatCurrency(proposal.bidAmount || 0)}
                                                </span>
                                            </td>

                                            {/* Duration */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                                                    <Clock size={13} />
                                                    <span className="capitalize">{durationStr}</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <AdminProposalStatusBadge status={proposal.status} />
                                            </td>

                                            {/* Submitted Date */}
                                            <td className="px-5 py-4">
                                                <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
                                                    {submittedDate}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onSelectProposal(proposal._id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container-high text-on-surface hover:bg-primary/10 hover:text-primary transition-colors text-label-md font-medium"
                                                        title="View proposal overview"
                                                    >
                                                        <Eye size={14} />
                                                        Overview
                                                    </button>
                                                    <Link
                                                        href={`/proposals/${proposal._id}`}
                                                        className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                                                        title="Open proposal details page"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        pageSize={10}
                        totalItems={pagination.totalProposals}
                        onPageChange={onPageChange}
                        itemLabel="proposals"
                    />
                </div>
            )}
        </>
    );
}
