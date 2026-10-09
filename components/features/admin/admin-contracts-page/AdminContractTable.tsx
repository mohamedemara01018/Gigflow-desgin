"use client";

import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";
import UserImage from "@/components/ui/UserImage";
import Pagination from "@/components/ui/Pagination";
import { IContract } from "@/services/contract.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import { Eye, ExternalLink, FileSignature } from "lucide-react";
import Link from "next/link";
import AdminContractStatusBadge from "./AdminContractStatusBadge";

interface IPagination {
    totalContracts: number;
    currentPage: number;
    totalPages: number;
}

interface AdminContractTableProps {
    contracts: IContract[];
    loading: boolean;
    pagination: IPagination;
    onSelectContract: (contractId: string) => void;
    onPageChange: (page: number) => void;
}

export default function AdminContractTable({
    contracts,
    loading,
    pagination,
    onSelectContract,
    onPageChange,
}: AdminContractTableProps) {
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
                                    Contract
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Client
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Freelancer
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Related Job
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Amount
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
                            ) : contracts.length === 0 ? (
                                <tr>
                                    <td colSpan={TOTAL_COLUMNS}>
                                        <EmptyState
                                            size="compact"
                                            title="No contracts found matching your filters."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                contracts.map((contract) => {
                                    const clientObj =
                                        typeof contract.client === "object" && contract.client !== null
                                            ? contract.client
                                            : null;
                                    const freelancerObj =
                                        typeof contract.freelancer === "object" && contract.freelancer !== null
                                            ? contract.freelancer
                                            : null;
                                    const jobObj =
                                        typeof contract.job === "object" && contract.job !== null
                                            ? contract.job
                                            : null;

                                    const clientName = clientObj
                                        ? `${clientObj.firstName ?? ""} ${clientObj.lastName ?? ""}`.trim() || "Client"
                                        : "Unknown Client";

                                    const freelancerName = freelancerObj
                                        ? `${freelancerObj.firstName ?? ""} ${freelancerObj.lastName ?? ""}`.trim() || "Freelancer"
                                        : "Unknown Freelancer";

                                    const shortId = contract._id ? `#CT-${contract._id.slice(-4).toUpperCase()}` : "#CONTRACT";
                                    const createdDate = contract.createdAt
                                        ? formatDateTime(contract.createdAt).date
                                        : "N/A";

                                    return (
                                        <tr
                                            key={contract._id}
                                            className="group hover:bg-surface-container-high transition-colors"
                                        >
                                            {/* Contract Title & Reference */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col max-w-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => onSelectContract(contract._id)}
                                                        className="text-body-md font-medium text-on-surface hover:text-primary transition-colors text-left truncate font-semibold"
                                                        title={contract.title}
                                                    >
                                                        {contract.title}
                                                    </button>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-body-sm text-on-surface-variant font-mono">
                                                            {shortId}
                                                        </span>
                                                        <span className="text-body-sm text-on-surface-variant capitalize">
                                                            · {contract.type || "Fixed"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Client */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <UserImage
                                                        avatarUrl={clientObj?.avatar}
                                                        firstName={clientObj?.firstName || ""}
                                                        lastName={clientObj?.lastName || ""}
                                                        className="w-8 h-8 rounded-full shrink-0"
                                                    />
                                                    <div className="flex flex-col max-w-[130px]">
                                                        <span className="text-body-sm font-medium text-on-surface truncate">
                                                            {clientName}
                                                        </span>
                                                        {clientObj?.email && (
                                                            <span className="text-label-sm text-on-surface-variant truncate">
                                                                {clientObj.email}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Freelancer */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <UserImage
                                                        avatarUrl={freelancerObj?.avatar}
                                                        firstName={freelancerObj?.firstName || ""}
                                                        lastName={freelancerObj?.lastName || ""}
                                                        className="w-8 h-8 rounded-full shrink-0"
                                                    />
                                                    <div className="flex flex-col max-w-[130px]">
                                                        <span className="text-body-sm font-medium text-on-surface truncate">
                                                            {freelancerName}
                                                        </span>
                                                        {freelancerObj?.email && (
                                                            <span className="text-label-sm text-on-surface-variant truncate">
                                                                {freelancerObj.email}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Related Job */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col max-w-[160px]">
                                                    {jobObj ? (
                                                        <Link
                                                            href={`/jobs/${jobObj._id}`}
                                                            target="_blank"
                                                            className="text-body-sm text-on-surface hover:text-primary transition-colors flex items-center gap-1 truncate"
                                                            title={jobObj.title}
                                                        >
                                                            <span className="truncate">{jobObj.title}</span>
                                                            <ExternalLink size={12} className="shrink-0 text-on-surface-variant" />
                                                        </Link>
                                                    ) : (
                                                        <span className="text-body-sm text-on-surface-variant">
                                                            Direct Contract
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-5 py-4">
                                                <span className="text-body-md font-semibold text-on-surface">
                                                    {formatCurrency(contract.totalAmount || 0)}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <AdminContractStatusBadge status={contract.status} />
                                            </td>

                                            {/* Created Date */}
                                            <td className="px-5 py-4">
                                                <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
                                                    {createdDate}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onSelectContract(contract._id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container-high text-on-surface hover:bg-primary/10 hover:text-primary transition-colors text-label-md font-medium"
                                                        title="View contract overview"
                                                    >
                                                        <Eye size={14} />
                                                        Overview
                                                    </button>
                                                    <Link
                                                        href={`/contracts/${contract._id}`}
                                                        className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                                                        title="Open contract workspace page"
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
                        totalItems={pagination.totalContracts}
                        onPageChange={onPageChange}
                        itemLabel="contracts"
                    />
                </div>
            )}
        </>
    );
}
