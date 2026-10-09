"use client";

import { ContractStatus } from "@/utils/enums.utils";
import { CheckCircle2, Clock, AlertTriangle, XCircle, PauseCircle, ShieldAlert } from "lucide-react";

interface AdminContractStatusBadgeProps {
    status: ContractStatus | string;
}

export default function AdminContractStatusBadge({ status }: AdminContractStatusBadgeProps) {
    const normalized = (status || "").toLowerCase();

    switch (normalized) {
        case ContractStatus.ACTIVE:
        case "active":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                </span>
            );

        case ContractStatus.COMPLETED:
        case "completed":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <CheckCircle2 size={12} />
                    Completed
                </span>
            );

        case ContractStatus.DRAFT:
        case "draft":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant px-2.5 py-1 text-label-sm font-medium capitalize">
                    <Clock size={12} />
                    Draft
                </span>
            );

        case ContractStatus.PAUSED:
        case "paused":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <PauseCircle size={12} />
                    Paused
                </span>
            );

        case ContractStatus.CANCELLED:
        case "cancelled":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 text-error border border-error/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <XCircle size={12} />
                    Cancelled
                </span>
            );

        case ContractStatus.REJECTED:
        case "rejected":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 text-error border border-error/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <XCircle size={12} />
                    Rejected
                </span>
            );

        case ContractStatus.DISPUTED:
        case "disputed":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <ShieldAlert size={12} />
                    Disputed
                </span>
            );

        default:
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant px-2.5 py-1 text-label-sm font-medium capitalize">
                    <AlertTriangle size={12} />
                    {status || "Unknown"}
                </span>
            );
    }
}
