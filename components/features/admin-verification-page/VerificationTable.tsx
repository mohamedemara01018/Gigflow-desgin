/* eslint-disable @next/next/no-img-element */
"use client";

import StatusBadge from "./StatusBadge";
import { IVerificationRequest } from "@/services/verification.service";
import { VerificationStatus } from "@/utils/enums.utils";
import { getInitials } from "@/utils/functions.utils";
import { Loader2, Trash2 } from "lucide-react";

interface VerificationTableProps {
    requests: IVerificationRequest[];
    selectedVerificationId?: string;
    onSelectVerification: (req: IVerificationRequest) => void;
    onDelete: (verificationId: string) => void
    deleteLoading: boolean
}

export default function VerificationTable({
    requests,
    selectedVerificationId,
    onSelectVerification,
    onDelete,
    deleteLoading
}: VerificationTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-label-sm uppercase tracking-wide text-on-surface-variant text-left px-5 py-3">
                            User
                        </th>
                        <th className="text-label-sm uppercase tracking-wide text-on-surface-variant text-left px-5 py-3">
                            Document Type
                        </th>
                        <th className="text-label-sm uppercase tracking-wide text-on-surface-variant text-left px-5 py-3">
                            Status
                        </th>
                        <th className="text-label-sm uppercase tracking-wide text-on-surface-variant text-left px-5 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => {
                        const isSelected = req._id === selectedVerificationId;
                        const isDeleted = !(req.status == VerificationStatus.PENDING || req.status == VerificationStatus.IN_REVIEW)
                        return (
                            <tr
                                key={req._id}
                                onClick={() => onSelectVerification(req)}
                                className={`cursor-pointer border-t border-l-4 transition-colors ${isSelected
                                    ? "border-t-outline-variant border-l-primary bg-primary/5"
                                    : "border-t-outline-variant border-l-transparent hover:bg-surface-container-low"
                                    }`}
                            >
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        {req.user.avatar ? (
                                            <img
                                                src={req.user.avatar}
                                                alt={req.user.firstName}
                                                className="w-9 h-9 rounded-full object-cover shrink-0"
                                            />
                                        ) : (
                                            <span className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-label-md font-semibold shrink-0">
                                                {getInitials(req.user.firstName, req.user.lastName)}
                                            </span>
                                        )}
                                        <div>
                                            <p className="text-body-md font-medium text-on-surface">
                                                {req.user.firstName + " " + req.user.lastName}
                                            </p>
                                            <p className="text-body-sm text-on-surface-variant">
                                                {req.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-body-md text-on-surface">
                                    {req.documentType}
                                </td>
                                <td className="px-5 py-3">
                                    <StatusBadge status={req.status} />
                                </td>

                                <td className="px-5 py-3 whitespace-nowrap text-right">
                                    <button
                                        type="button"
                                        onClick={() => onDelete(req._id)}
                                        disabled={!isDeleted}
                                        className={`inline-flex items-center justify-center gap-1.5 w-24 py-1.5 text-body-sm font-medium text-error bg-error/10 hover:bg-error hover:text-on-error rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-error/40 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {deleteLoading ?
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            : <>
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete</span>
                                            </>}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div >
    );
}