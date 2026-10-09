"use client";

import { TransactionType } from "@/utils/enums.utils";
import { ArrowDownLeft, ArrowUpRight, Percent, RefreshCw, DollarSign } from "lucide-react";

interface AdminTransactionTypeBadgeProps {
    type: TransactionType | string;
}

export default function AdminTransactionTypeBadge({ type }: AdminTransactionTypeBadgeProps) {
    const normalized = (type || "").toLowerCase();

    switch (normalized) {
        case TransactionType.CLIENT_PAYMENT:
        case "client_payment":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 text-label-sm font-medium">
                    <ArrowDownLeft size={12} />
                    Client Payment
                </span>
            );

        case TransactionType.PLATFORM_FEE:
        case "platform_fee":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2.5 py-1 text-label-sm font-medium">
                    <Percent size={12} />
                    Platform Fee
                </span>
            );

        case TransactionType.FREELANCER_PAYOUT:
        case "freelancer_payout":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-label-sm font-medium">
                    <ArrowUpRight size={12} />
                    Freelancer Payout
                </span>
            );

        case TransactionType.REFUND:
        case "refund":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 text-label-sm font-medium">
                    <RefreshCw size={12} />
                    Refund
                </span>
            );

        case TransactionType.PARTIAL_REFUND:
        case "partial_refund":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 text-label-sm font-medium">
                    <RefreshCw size={12} />
                    Partial Refund
                </span>
            );

        default:
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant px-2.5 py-1 text-label-sm font-medium capitalize">
                    <DollarSign size={12} />
                    {type ? type.replace(/_/g, " ") : "Transaction"}
                </span>
            );
    }
}
