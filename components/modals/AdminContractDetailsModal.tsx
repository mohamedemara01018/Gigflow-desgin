"use client";

import React from "react";
import Link from "next/link";
import {
    X,
    ExternalLink,
    Calendar,
    DollarSign,
    Briefcase,
    Building2,
    UserCheck,
    FileSignature,
    CheckCircle2,
    Layers,
    Clock,
    AlertCircle,
} from "lucide-react";
import SmallLoading from "@/components/ui/SmallLoading";
import UserImage from "@/components/ui/UserImage";
import { IContract } from "@/services/contract.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import AdminContractStatusBadge from "../features/admin/admin-contracts-page/AdminContractStatusBadge";

interface AdminContractDetailsModalProps {
    contract: IContract | null;
    loading: boolean;
    onClose: () => void;
}

export default function AdminContractDetailsModal({
    contract,
    loading,
    onClose,
}: AdminContractDetailsModalProps) {
    if (!contract && !loading) return null;

    const clientObj =
        typeof contract?.client === "object" && contract.client !== null
            ? contract.client
            : null;
    const freelancerObj =
        typeof contract?.freelancer === "object" && contract.freelancer !== null
            ? contract.freelancer
            : null;
    const jobObj =
        typeof contract?.job === "object" && contract.job !== null
            ? contract.job
            : null;

    const clientName = clientObj
        ? `${clientObj.firstName ?? ""} ${clientObj.lastName ?? ""}`.trim() || "Client"
        : "Unknown Client";

    const freelancerName = freelancerObj
        ? `${freelancerObj.firstName ?? ""} ${freelancerObj.lastName ?? ""}`.trim() || "Freelancer"
        : "Unknown Freelancer";

    const milestones = contract?.milestones || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-[320px] max-w-3xl space-y-4 relative w-full overflow-hidden my-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <div className="flex items-center gap-2">
                        <FileSignature size={20} className="text-primary" />
                        <h3 className="text-title-medium font-semibold text-on-surface">
                            Contract Details
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

                {loading || !contract ? (
                    <div className="min-h-60 flex items-center justify-center p-8">
                        <SmallLoading />
                    </div>
                ) : (
                    <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
                        {/* Overview Banner */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-title-medium font-bold text-on-surface">
                                        {contract.title}
                                    </h4>
                                    <AdminContractStatusBadge status={contract.status} />
                                </div>
                                <p className="text-body-sm text-on-surface-variant font-mono">
                                    ID: {contract._id} · {contract.type?.toUpperCase() || "FIXED"}
                                </p>
                            </div>
                            <div className="text-left sm:text-right bg-surface-container-high px-4 py-2 rounded-md border border-outline-variant shrink-0">
                                <span className="text-label-sm text-on-surface-variant block">
                                    Total Amount
                                </span>
                                <span className="text-headline-sm font-bold text-primary">
                                    {formatCurrency(contract.totalAmount || 0)}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        {contract.description && (
                            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-1.5">
                                <span className="text-label-md font-semibold text-on-surface-variant">
                                    Contract Scope & Terms
                                </span>
                                <p className="text-body-md text-on-surface whitespace-pre-line">
                                    {contract.description}
                                </p>
                            </div>
                        )}

                        {/* Participants Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Client Card */}
                            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                                        Client
                                    </span>
                                    {clientObj?._id && (
                                        <Link
                                            href={`/profile/${clientObj._id}`}
                                            className="text-label-sm text-primary hover:underline flex items-center gap-1"
                                        >
                                            View Profile
                                            <ExternalLink size={12} />
                                        </Link>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <UserImage
                                        avatarUrl={clientObj?.avatar}
                                        firstName={clientObj?.firstName || ""}
                                        lastName={clientObj?.lastName || ""}
                                        className="w-11 h-11 rounded-full shrink-0"
                                    />
                                    <div>
                                        <p className="text-body-md font-semibold text-on-surface">
                                            {clientName}
                                        </p>
                                        <p className="text-body-sm text-on-surface-variant">
                                            {clientObj?.email || "No email"}
                                        </p>
                                        {(clientObj?.country || clientObj?.city) && (
                                            <p className="text-label-sm text-on-surface-variant mt-0.5">
                                                {[clientObj.city, clientObj.country].filter(Boolean).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Freelancer Card */}
                            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                                        Freelancer
                                    </span>
                                    {freelancerObj?._id && (
                                        <Link
                                            href={`/profile/${freelancerObj._id}`}
                                            className="text-label-sm text-primary hover:underline flex items-center gap-1"
                                        >
                                            View Profile
                                            <ExternalLink size={12} />
                                        </Link>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <UserImage
                                        avatarUrl={freelancerObj?.avatar}
                                        firstName={freelancerObj?.firstName || ""}
                                        lastName={freelancerObj?.lastName || ""}
                                        className="w-11 h-11 rounded-full shrink-0"
                                    />
                                    <div>
                                        <p className="text-body-md font-semibold text-on-surface">
                                            {freelancerName}
                                        </p>
                                        <p className="text-body-sm text-on-surface-variant">
                                            {freelancerObj?.email || "No email"}
                                        </p>
                                        {(freelancerObj?.country || freelancerObj?.city) && (
                                            <p className="text-label-sm text-on-surface-variant mt-0.5">
                                                {[freelancerObj.city, freelancerObj.country].filter(Boolean).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Association */}
                        {jobObj && (
                            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-md bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                        <Briefcase size={18} />
                                    </div>
                                    <div>
                                        <span className="text-label-sm text-on-surface-variant block">
                                            Originating Job
                                        </span>
                                        <span className="text-body-md font-medium text-on-surface">
                                            {jobObj.title}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={`/jobs/${jobObj._id}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container-high text-on-surface hover:text-primary text-body-sm font-medium transition-colors"
                                >
                                    Open Job
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        )}

                        {/* Milestones List */}
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-label-md font-semibold text-on-surface flex items-center gap-1.5">
                                    <Layers size={16} className="text-primary" />
                                    Milestones Breakdown ({milestones.length})
                                </span>
                            </div>

                            {milestones.length === 0 ? (
                                <p className="text-body-sm text-on-surface-variant italic py-2">
                                    No milestones created for this contract yet.
                                </p>
                            ) : (
                                <div className="divide-y divide-outline-variant/40">
                                    {milestones.map((ms, idx) => (
                                        <div
                                            key={ms._id || idx}
                                            className="py-2.5 flex items-center justify-between gap-3 flex-wrap"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-bold flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <p className="text-body-md font-medium text-on-surface">
                                                        {ms.title}
                                                    </p>
                                                    {ms.description && (
                                                        <p className="text-body-sm text-on-surface-variant line-clamp-1">
                                                            {ms.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-body-sm font-semibold text-on-surface">
                                                    {formatCurrency(ms.amount)}
                                                </span>
                                                <span className="text-label-sm px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant capitalize">
                                                    {ms.status || "Pending"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Lifecycle & Dates */}
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant grid grid-cols-2 sm:grid-cols-3 gap-3 text-body-sm">
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Created</span>
                                <span className="text-on-surface font-medium">
                                    {contract.createdAt ? formatDateTime(contract.createdAt).date : "N/A"}
                                </span>
                            </div>
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Freelancer Accepted</span>
                                <span className="text-on-surface font-medium">
                                    {contract.freelancerAcceptedAt
                                        ? formatDateTime(contract.freelancerAcceptedAt).date
                                        : "Pending"}
                                </span>
                            </div>
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Completed</span>
                                <span className="text-on-surface font-medium">
                                    {contract.completedAt
                                        ? formatDateTime(contract.completedAt).date
                                        : "In Progress"}
                                </span>
                            </div>
                        </div>

                        {/* Rejection / Cancellation Reason if any */}
                        {(contract.rejectionReason || contract.cancellationReason) && (
                            <div className="bg-error-container/20 p-3 rounded-lg border border-error/20 flex items-start gap-2.5 text-body-sm text-on-surface">
                                <AlertCircle size={16} className="text-error shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-error">
                                        {contract.rejectionReason ? "Rejection Reason:" : "Cancellation Reason:"}
                                    </span>
                                    <p className="mt-0.5">
                                        {contract.rejectionReason || contract.cancellationReason}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Footer Link */}
                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                            <span className="text-label-sm text-on-surface-variant">
                                Direct contract workspace
                            </span>
                            <Link
                                href={`/contracts/${contract._id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors text-body-sm font-medium"
                            >
                                Open Contract Page
                                <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
