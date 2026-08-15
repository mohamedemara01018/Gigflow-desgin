/* eslint-disable @next/next/no-img-element */
"use client";

import BlurredDocumentCard from "@/components/features/admin-verification-page/BlurredDocumentCard";
import SmallLoading from "@/components/ui/SmallLoading";
import { IGetAttachmentsApiResponse } from "@/services/attachment.service";
import { IVerificationRequest } from "@/services/verification.service";
import { VerificationStatus } from "@/utils/enums.utils";
import { formatDateTime, getInitials } from "@/utils/functions.utils";
import { Loader2, ScanEye, ShieldCheck, XCircle, LucideIcon, AlertTriangle, AlertCircle } from "lucide-react";

// Common rejection reasons predefined for admin convenience
export const REJECTION_REASONS = [
    "Illegible or Blurry Document",
    "Expired Document",
    "Name/Details Mismatch",
    "Incomplete / Missing Pages",
    "Unaccepted Document Type",
    "Suspected Fraudulent Document",
    "Other",
] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number];

interface VerificationDetailsSidebarProps {
    selectedVerification: IVerificationRequest;
    notes: string;
    onNotesChange: (value: string) => void;
    // Rejection Reason state props
    rejectionReason: string;
    onRejectionReasonChange: (reason: string) => void;
    customRejectionReason?: string;
    onCustomRejectionReasonChange?: (reason: string) => void;

    attachmentLoading: boolean;
    attachmentResponse?: IGetAttachmentsApiResponse;
    onApprove?: () => void;
    onReject?: () => void;
    onReview?: () => void;
    approveLoading: boolean;
    rejectedLoading: boolean;
    reviewLoading: boolean;
}

interface ActionButtonProps {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    isLoading: boolean;
    variant: "primary" | "tertiary" | "error";
}

function ActionButton({ label, icon: Icon, onClick, isLoading, variant }: ActionButtonProps) {
    const variantClasses = {
        primary: "bg-primary text-on-primary",
        tertiary: "bg-tertiary text-on-tertiary",
        error: "bg-error text-on-error",
    };

    return (
        <button
            disabled={isLoading}
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 text-label-md rounded-md py-3 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
        >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <>
                    <Icon size={18} />
                    {label}
                </>
            )}
        </button>
    );
}

export default function VerificationDetailsSidebar({
    selectedVerification,
    notes,
    onNotesChange,
    rejectionReason,
    onRejectionReasonChange,
    customRejectionReason = "",
    onCustomRejectionReasonChange,
    attachmentLoading,
    attachmentResponse,
    onApprove,
    onReject,
    onReview,
    approveLoading,
    rejectedLoading,
    reviewLoading,
}: VerificationDetailsSidebarProps) {
    const { user, createdAt, status, rejectionReason: RS } = selectedVerification;
    const fullName = `${user.firstName} ${user.lastName}`.trim();

    const renderActionButtons = () => {
        const reviewBtn = (
            <ActionButton
                key="review"
                label="Review"
                icon={ScanEye}
                onClick={onReview}
                isLoading={reviewLoading}
                variant="tertiary"
            />
        );

        const rejectBtn = (
            <ActionButton
                key="reject"
                label="Reject"
                icon={XCircle}
                onClick={onReject}
                isLoading={rejectedLoading}
                variant="error"
            />
        );

        const approveBtn = (
            <ActionButton
                key="approve"
                label="Approve"
                icon={ShieldCheck}
                onClick={onApprove}
                isLoading={approveLoading}
                variant="primary"
            />
        );

        switch (status) {
            case VerificationStatus.PENDING:
                return [reviewBtn, rejectBtn, approveBtn];
            case VerificationStatus.IN_REVIEW:
                return [rejectBtn, approveBtn];
            case VerificationStatus.APPROVED:
                return [reviewBtn, rejectBtn];
            case VerificationStatus.REJECTED:
                return [reviewBtn, approveBtn];
            default:
                return null;
        }
    };

    return (
        <aside className="flex flex-col gap-6">
            {/* User Info Card */}
            <section className="card space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={fullName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <span className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-label-md font-semibold">
                            {getInitials(user.firstName, user.lastName)}
                        </span>
                    )}
                    <div>
                        <p className="text-body-lg font-semibold text-on-surface">{fullName}</p>
                        <p className="text-body-sm text-on-surface-variant capitalize">{user.role}</p>
                    </div>
                </div>

                {/* Rejection Reason Banner */}
                {RS && status === VerificationStatus.REJECTED && (
                    <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-error text-label-sm font-bold uppercase tracking-wider">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Rejection Reason</span>
                        </div>
                        <p className="text-body-sm text-on-surface font-medium pl-5.5">
                            {RS}
                        </p>
                    </div>
                )}
            </section>

            {/* Submitted Documents Card */}
            <section className="card">
                <div className="flex items-center justify-between">
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Submitted Documents
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                        Uploaded {formatDateTime(createdAt).date}
                    </span>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    {attachmentLoading ? (
                        <SmallLoading />
                    ) : (
                        attachmentResponse?.data.attachments.map((attach) => (
                            <div key={attach._id}>
                                <BlurredDocumentCard attach={attach} />
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Rejection Reason Selector */}
            <section className={`card ${status == VerificationStatus.APPROVED ? 'block' : 'hidden'}`}>
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-error" />
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Rejection Reason
                    </span>
                </div>

                <select
                    value={rejectionReason}
                    onChange={(e) => onRejectionReasonChange(e.target.value)}
                    className="w-full bg-surface-container-low rounded-md p-3 text-body-sm text-on-surface border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="" disabled>
                        Select a reason...
                    </option>
                    {REJECTION_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                            {reason}
                        </option>
                    ))}
                </select>

                {/* Custom text field if 'Other' is selected */}
                {rejectionReason === "Other" && onCustomRejectionReasonChange && (
                    <input
                        type="text"
                        value={customRejectionReason}
                        onChange={(e) => onCustomRejectionReasonChange(e.target.value)}
                        placeholder="Specify custom rejection reason..."
                        className="w-full mt-3 bg-surface-container-low rounded-md p-3 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                    />
                )}
            </section>

            {/* Internal Notes */}
            <section className="card">
                <span className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                    Internal Notes
                </span>
                <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Add observations or notes regarding this review..."
                    rows={4}
                    className="w-full mt-3 bg-surface-container-low rounded-md p-3.5 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
            </section>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">{renderActionButtons()}</div>
        </aside >
    );
}