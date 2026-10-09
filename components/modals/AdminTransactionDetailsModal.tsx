"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    X,
    ExternalLink,
    DollarSign,
    Receipt,
    UserCheck,
    FileSignature,
    CheckCircle2,
    Clock,
    AlertCircle,
    Copy,
    Check,
    CreditCard,
    ArrowDownLeft,
    ArrowUpRight,
} from "lucide-react";
import SmallLoading from "@/components/ui/SmallLoading";
import { ITransaction } from "@/services/transaction.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import AdminTransactionStatusBadge from "../features/admin/admin-transactions-page/AdminTransactionStatusBadge";
import AdminTransactionTypeBadge from "../features/admin/admin-transactions-page/AdminTransactionTypeBadge";

interface AdminTransactionDetailsModalProps {
    transaction: ITransaction | null;
    loading: boolean;
    onClose: () => void;
}

export default function AdminTransactionDetailsModal({
    transaction,
    loading,
    onClose,
}: AdminTransactionDetailsModalProps) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    if (!transaction && !loading) return null;

    const handleCopy = (key: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const clientObj =
        typeof transaction?.client === "object" && transaction.client !== null
            ? transaction.client
            : null;
    const freelancerObj =
        typeof transaction?.freelancer === "object" && transaction.freelancer !== null
            ? transaction.freelancer
            : null;
    const contractObj =
        typeof transaction?.contract === "object" && transaction.contract !== null
            ? transaction.contract
            : null;
    const milestoneObj =
        typeof transaction?.milestone === "object" && transaction.milestone !== null
            ? transaction.milestone
            : null;
    const paymentObj =
        typeof transaction?.payment === "object" && transaction.payment !== null
            ? transaction.payment
            : null;

    const clientName = clientObj
        ? `${clientObj.firstName ?? ""} ${clientObj.lastName ?? ""}`.trim()
        : null;

    const freelancerName = freelancerObj
        ? `${freelancerObj.firstName ?? ""} ${freelancerObj.lastName ?? ""}`.trim()
        : null;

    const isCredit = (transaction?.direction || "").toLowerCase() === "credit";
    const currencyCode = (transaction?.currency || "USD").toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-[320px] max-w-2xl space-y-4 relative w-full overflow-hidden my-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <div className="flex items-center gap-2">
                        <Receipt size={20} className="text-primary" />
                        <h3 className="text-title-medium font-semibold text-on-surface">
                            Transaction Overview
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

                {loading || !transaction ? (
                    <div className="min-h-60 flex items-center justify-center p-8">
                        <SmallLoading />
                    </div>
                ) : (
                    <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
                        {/* Overview Banner */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <AdminTransactionTypeBadge type={transaction.type} />
                                    <AdminTransactionStatusBadge status={transaction.status} />
                                </div>
                                <div className="flex items-center gap-1 text-body-sm text-on-surface-variant font-mono mt-1">
                                    <span>ID: {transaction._id}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy("id", transaction._id)}
                                        className="p-1 hover:text-primary transition-colors cursor-pointer"
                                        title="Copy transaction ID"
                                    >
                                        {copiedKey === "id" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                    </button>
                                </div>
                            </div>
                            <div className="text-left sm:text-right bg-surface-container-high px-4 py-2 rounded-md border border-outline-variant shrink-0">
                                <span className="text-label-sm text-on-surface-variant block">
                                    Gross Amount
                                </span>
                                <div className="flex items-center gap-1.5 justify-start sm:justify-end">
                                    {isCredit ? (
                                        <span className="text-headline-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                                            <ArrowDownLeft size={16} className="mr-0.5" />
                                            +{formatCurrency(transaction.amount || 0)}
                                        </span>
                                    ) : (
                                        <span className="text-headline-sm font-bold text-on-surface flex items-center">
                                            <ArrowUpRight size={16} className="mr-0.5 text-on-surface-variant" />
                                            {formatCurrency(transaction.amount || 0)}
                                        </span>
                                    )}
                                    <span className="text-label-md text-on-surface-variant font-mono">
                                        {currencyCode}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {transaction.description && (
                            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant text-body-sm text-on-surface">
                                <span className="text-label-sm font-semibold text-on-surface-variant block mb-1">
                                    Description
                                </span>
                                <p>{transaction.description}</p>
                            </div>
                        )}

                        {/* Parties Involved */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant space-y-1">
                                <span className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                                    Client
                                </span>
                                {clientName ? (
                                    <>
                                        <p className="text-body-md font-semibold text-on-surface">
                                            {clientName}
                                        </p>
                                        <p className="text-body-sm text-on-surface-variant">
                                            {clientObj?.email}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-body-sm text-on-surface-variant italic">
                                        Not applicable
                                    </p>
                                )}
                            </div>

                            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant space-y-1">
                                <span className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                                    Freelancer
                                </span>
                                {freelancerName ? (
                                    <>
                                        <p className="text-body-md font-semibold text-on-surface">
                                            {freelancerName}
                                        </p>
                                        <p className="text-body-sm text-on-surface-variant">
                                            {freelancerObj?.email}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-body-sm text-on-surface-variant italic">
                                        Not applicable
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Contract & Milestone Association */}
                        {(contractObj || milestoneObj) && (
                            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-3">
                                <span className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                                    Associated Contract & Milestone
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm">
                                    {contractObj && (
                                        <div>
                                            <span className="text-label-sm text-on-surface-variant block">
                                                Contract
                                            </span>
                                            <Link
                                                href={`/contracts/${contractObj._id}`}
                                                className="text-primary hover:underline font-medium flex items-center gap-1 mt-0.5"
                                            >
                                                {contractObj.title}
                                                <ExternalLink size={12} />
                                            </Link>
                                        </div>
                                    )}
                                    {milestoneObj && (
                                        <div>
                                            <span className="text-label-sm text-on-surface-variant block">
                                                Milestone
                                            </span>
                                            <p className="font-medium text-on-surface mt-0.5">
                                                {milestoneObj.title} ({formatCurrency(milestoneObj.amount || 0)})
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Payment & Stripe Reference Audit */}
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-3">
                            <span className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                                <CreditCard size={14} />
                                Processor & Audit References
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm font-mono">
                                {transaction.stripePaymentIntentId && (
                                    <div className="bg-surface-container p-2.5 rounded border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block font-sans">
                                            Stripe Payment Intent
                                        </span>
                                        <div className="flex items-center justify-between gap-1 mt-0.5">
                                            <span className="truncate text-on-surface">
                                                {transaction.stripePaymentIntentId}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy("pi", transaction.stripePaymentIntentId!)}
                                                className="p-1 hover:text-primary transition-colors cursor-pointer"
                                            >
                                                {copiedKey === "pi" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {transaction.stripeTransferId && (
                                    <div className="bg-surface-container p-2.5 rounded border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block font-sans">
                                            Stripe Transfer ID
                                        </span>
                                        <div className="flex items-center justify-between gap-1 mt-0.5">
                                            <span className="truncate text-on-surface">
                                                {transaction.stripeTransferId}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy("tr", transaction.stripeTransferId!)}
                                                className="p-1 hover:text-primary transition-colors cursor-pointer"
                                            >
                                                {copiedKey === "tr" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {transaction.stripeRefundId && (
                                    <div className="bg-surface-container p-2.5 rounded border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block font-sans">
                                            Stripe Refund ID
                                        </span>
                                        <div className="flex items-center justify-between gap-1 mt-0.5">
                                            <span className="truncate text-on-surface">
                                                {transaction.stripeRefundId}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy("rf", transaction.stripeRefundId!)}
                                                className="p-1 hover:text-primary transition-colors cursor-pointer"
                                            >
                                                {copiedKey === "rf" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {paymentObj && (
                                    <div className="bg-surface-container p-2.5 rounded border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block font-sans">
                                            Internal Payment Record
                                        </span>
                                        <span className="text-on-surface">
                                            {paymentObj._id} ({paymentObj.method || "card"})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant grid grid-cols-2 sm:grid-cols-3 gap-3 text-body-sm">
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Initiated</span>
                                <span className="text-on-surface font-medium">
                                    {transaction.createdAt
                                        ? `${formatDateTime(transaction.createdAt).date} ${formatDateTime(transaction.createdAt).time}`
                                        : "N/A"}
                                </span>
                            </div>
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Completed</span>
                                <span className="text-on-surface font-medium">
                                    {transaction.completedAt
                                        ? `${formatDateTime(transaction.completedAt).date} ${formatDateTime(transaction.completedAt).time}`
                                        : "Pending"}
                                </span>
                            </div>
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Direction</span>
                                <span className="text-on-surface font-medium capitalize">
                                    {transaction.direction || "Debit"}
                                </span>
                            </div>
                        </div>

                        {/* Failure Reason */}
                        {transaction.failureReason && (
                            <div className="bg-error-container/20 p-3 rounded-lg border border-error/20 flex items-start gap-2.5 text-body-sm text-on-surface">
                                <AlertCircle size={16} className="text-error shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-error">
                                        Failure Reason:
                                    </span>
                                    <p className="mt-0.5 font-mono text-body-sm">
                                        {transaction.failureReason}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
