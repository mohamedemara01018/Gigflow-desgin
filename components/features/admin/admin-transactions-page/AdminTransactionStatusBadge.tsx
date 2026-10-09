"use client";

import { TransactionStatus } from "@/utils/enums.utils";
import { CheckCircle2, Clock, Loader2, XCircle, AlertCircle } from "lucide-react";

interface AdminTransactionStatusBadgeProps {
    status: TransactionStatus | string;
}

export default function AdminTransactionStatusBadge({ status }: AdminTransactionStatusBadgeProps) {
    const normalized = (status || "").toLowerCase();

    switch (normalized) {
        case TransactionStatus.COMPLETED:
        case "completed":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <CheckCircle2 size={12} />
                    Completed
                </span>
            );

        case TransactionStatus.PENDING:
        case "pending":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <Clock size={12} />
                    Pending
                </span>
            );

        case TransactionStatus.PROCESSING:
        case "processing":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <Loader2 size={12} className="animate-spin" />
                    Processing
                </span>
            );

        case TransactionStatus.FAILED:
        case "failed":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 text-error border border-error/20 px-2.5 py-1 text-label-sm font-medium capitalize">
                    <XCircle size={12} />
                    Failed
                </span>
            );

        case TransactionStatus.CANCELLED:
        case "cancelled":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant px-2.5 py-1 text-label-sm font-medium capitalize">
                    <XCircle size={12} />
                    Cancelled
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
