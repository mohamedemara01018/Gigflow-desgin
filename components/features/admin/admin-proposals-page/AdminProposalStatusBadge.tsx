"use client";

import { ProposalStatus } from "@/utils/enums.utils";
import { CheckCircle2, Clock, XCircle, Star, AlertCircle, ArrowLeftCircle } from "lucide-react";

interface AdminProposalStatusBadgeProps {
    status: ProposalStatus | string;
}

export default function AdminProposalStatusBadge({ status }: AdminProposalStatusBadgeProps) {
    const normalized = (status || "").toLowerCase();

    switch (normalized) {
        case ProposalStatus.PENDING:
        case "pending":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <Clock size={12} />
                    Pending
                </span>
            );

        case ProposalStatus.SHORTLISTED:
        case "shortlisted":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <Star size={12} />
                    Shortlisted
                </span>
            );

        case ProposalStatus.ACCEPTED:
        case "accepted":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <CheckCircle2 size={12} />
                    Accepted
                </span>
            );

        case ProposalStatus.REJECTED:
        case "rejected":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 text-error border border-error/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <XCircle size={12} />
                    Rejected
                </span>
            );

        case ProposalStatus.WITHDRAWN:
        case "withdrawn":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant px-2.5 py-1 text-label-sm font-medium capitalize">
                    <ArrowLeftCircle size={12} />
                    Withdrawn
                </span>
            );

        default:
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant px-2.5 py-1 text-label-sm font-medium capitalize">
                    <AlertCircle size={12} />
                    {status || "Unknown"}
                </span>
            );
    }
}
