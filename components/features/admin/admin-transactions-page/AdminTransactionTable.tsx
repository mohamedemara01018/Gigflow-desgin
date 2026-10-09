"use client";

import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";
import Pagination from "@/components/ui/Pagination";
import { ITransaction } from "@/services/transaction.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import { Eye, ArrowDownLeft, ArrowUpRight, FileSignature } from "lucide-react";
import AdminTransactionStatusBadge from "./AdminTransactionStatusBadge";
import AdminTransactionTypeBadge from "./AdminTransactionTypeBadge";

interface IPagination {
    total: number;
    page: number;
    totalPages: number;
}

interface AdminTransactionTableProps {
    transactions: ITransaction[];
    loading: boolean;
    pagination: IPagination;
    onSelectTransaction: (transactionId: string) => void;
    onPageChange: (page: number) => void;
}

export default function AdminTransactionTable({
    transactions,
    loading,
    pagination,
    onSelectTransaction,
    onPageChange,
}: AdminTransactionTableProps) {
    const TOTAL_COLUMNS = 8;

    return (
        <>
            <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* Header */}
                        <thead className="bg-surface-container-high">
                            <tr className="border-b border-outline-variant">
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Transaction ID
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Type
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Amount
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Parties
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Contract / Milestone
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Date
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
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={TOTAL_COLUMNS}>
                                        <EmptyState
                                            size="compact"
                                            title="No transactions found matching your filters."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => {
                                    const clientObj =
                                        typeof tx.client === "object" && tx.client !== null
                                            ? tx.client
                                            : null;
                                    const freelancerObj =
                                        typeof tx.freelancer === "object" && tx.freelancer !== null
                                            ? tx.freelancer
                                            : null;
                                    const contractObj =
                                        typeof tx.contract === "object" && tx.contract !== null
                                            ? tx.contract
                                            : null;
                                    const milestoneObj =
                                        typeof tx.milestone === "object" && tx.milestone !== null
                                            ? tx.milestone
                                            : null;

                                    const clientName = clientObj
                                        ? `${clientObj.firstName ?? ""} ${clientObj.lastName ?? ""}`.trim()
                                        : null;

                                    const freelancerName = freelancerObj
                                        ? `${freelancerObj.firstName ?? ""} ${freelancerObj.lastName ?? ""}`.trim()
                                        : null;

                                    const shortId = tx._id ? `#TX-${tx._id.slice(-6).toUpperCase()}` : "#TX";
                                    const createdDate = tx.createdAt
                                        ? formatDateTime(tx.createdAt).date
                                        : "N/A";

                                    const isCredit = (tx.direction || "").toLowerCase() === "credit";
                                    const currencyCode = (tx.currency || "USD").toUpperCase();

                                    return (
                                        <tr
                                            key={tx._id}
                                            className="group hover:bg-surface-container-high transition-colors"
                                        >
                                            {/* Transaction ID */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <button
                                                        type="button"
                                                        onClick={() => onSelectTransaction(tx._id)}
                                                        className="text-body-sm font-mono font-bold text-on-surface hover:text-primary transition-colors text-left"
                                                        title={tx._id}
                                                    >
                                                        {shortId}
                                                    </button>
                                                    {tx.stripePaymentIntentId && (
                                                        <span className="text-label-sm text-on-surface-variant font-mono truncate max-w-[120px]">
                                                            {tx.stripePaymentIntentId.slice(0, 14)}...
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-5 py-4">
                                                <AdminTransactionTypeBadge type={tx.type} />
                                            </td>

                                            {/* Amount & Direction */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    {isCredit ? (
                                                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center text-body-md font-bold">
                                                            <ArrowDownLeft size={14} className="mr-0.5" />
                                                            +{formatCurrency(tx.amount || 0)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-on-surface flex items-center text-body-md font-bold">
                                                            <ArrowUpRight size={14} className="mr-0.5 text-on-surface-variant" />
                                                            {formatCurrency(tx.amount || 0)}
                                                        </span>
                                                    )}
                                                    <span className="text-label-sm text-on-surface-variant font-mono">
                                                        {currencyCode}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Parties */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col text-body-sm">
                                                    {clientName && (
                                                        <span className="text-on-surface font-medium truncate max-w-[140px]">
                                                            Client: {clientName}
                                                        </span>
                                                    )}
                                                    {freelancerName && (
                                                        <span className="text-on-surface-variant truncate max-w-[140px]">
                                                            Freelancer: {freelancerName}
                                                        </span>
                                                    )}
                                                    {!clientName && !freelancerName && (
                                                        <span className="text-on-surface-variant italic">
                                                            Platform Operation
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Contract / Milestone */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col max-w-[160px]">
                                                    {contractObj ? (
                                                        <span
                                                            className="text-body-sm font-medium text-on-surface truncate"
                                                            title={contractObj.title}
                                                        >
                                                            {contractObj.title}
                                                        </span>
                                                    ) : (
                                                        <span className="text-body-sm text-on-surface-variant">
                                                            Direct / System
                                                        </span>
                                                    )}
                                                    {milestoneObj && (
                                                        <span className="text-label-sm text-on-surface-variant truncate">
                                                            Milestone: {milestoneObj.title}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <AdminTransactionStatusBadge status={tx.status} />
                                            </td>

                                            {/* Date */}
                                            <td className="px-5 py-4">
                                                <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
                                                    {createdDate}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectTransaction(tx._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container-high text-on-surface hover:bg-primary/10 hover:text-primary transition-colors text-label-md font-medium cursor-pointer"
                                                    title="View transaction overview"
                                                >
                                                    <Eye size={14} />
                                                    Overview
                                                </button>
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
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        pageSize={10}
                        totalItems={pagination.total}
                        onPageChange={onPageChange}
                        itemLabel="transactions"
                    />
                </div>
            )}
        </>
    );
}
