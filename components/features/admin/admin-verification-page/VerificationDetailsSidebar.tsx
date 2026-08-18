/* eslint-disable @next/next/no-img-element */
"use client";

import BlurredDocumentCard from "@/components/features/admin/admin-verification-page/BlurredDocumentCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SmallLoading from "@/components/ui/SmallLoading";
import { IGetAttachmentsApiResponse } from "@/services/attachment.service";
import { IVerificationRequest } from "@/services/verification.service";
import { VerificationStatus } from "@/utils/enums.utils";
import { formatDateTime, getInitials } from "@/utils/functions.utils";
import { Loader2, ScanEye, ShieldCheck, XCircle, LucideIcon, AlertTriangle, AlertCircle } from "lucide-react";
import { useState } from "react";

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
    // NOTE: this now fires only after the confirm dialog is accepted —
    // it should be the actual rejection submission (e.g. your former
    // handleReview(REJECTED, ...) call), not something that opens its
    // own dialog or does its own validation. That responsibility moved
    // into this component.
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
    disabled?: boolean;
    variant: "primary" | "tertiary" | "error";
}

function ActionButton({ label, icon: Icon, onClick, isLoading, disabled, variant }: ActionButtonProps) {
    const variantClasses = {
        primary: "bg-primary text-on-primary",
        tertiary: "bg-tertiary text-on-tertiary",
        error: "bg-error text-on-error",
    };

    return (
        <button
            disabled={isLoading || disabled}
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

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [reasonError, setReasonError] = useState(false);

    // Reject appears for every status except REJECTED (see renderActionButtons
    // below) — the reason picker's visibility must match that, not the
    // opposite of it.
    const canReject = status !== VerificationStatus.REJECTED;

    const isReasonValid =
        rejectionReason !== "" &&
        (rejectionReason !== "Other" || customRejectionReason.trim() !== "");

    const finalReason =
        rejectionReason === "Other" ? customRejectionReason.trim() : rejectionReason;

    const handleRejectClick = () => {
        if (!isReasonValid) {
            setReasonError(true);
            return;
        }
        setReasonError(false);
        setRejectDialogOpen(true);
    };

    const handleConfirmReject = () => {
        setRejectDialogOpen(false);
        onReject?.();
    };

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
                onClick={handleRejectClick}
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

            {/* Rejection Reason Selector — shown whenever Reject is a valid
                action for the current status (i.e. everything except
                REJECTED), not the inverse. */}
            <section className={`card ${canReject ? 'block' : 'hidden'}`}>
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-error" />
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Rejection Reason
                    </span>
                </div>

                <select
                    value={rejectionReason}
                    onChange={(e) => {
                        onRejectionReasonChange(e.target.value);
                        setReasonError(false);
                    }}
                    className={`w-full bg-surface-container-low rounded-md p-3 text-body-sm text-on-surface border focus:outline-none focus:ring-2 focus:ring-primary/30 ${reasonError ? "border-error" : "border-outline-variant"
                        }`}
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
                        onChange={(e) => {
                            onCustomRejectionReasonChange(e.target.value);
                            setReasonError(false);
                        }}
                        placeholder="Specify custom rejection reason..."
                        className={`w-full mt-3 bg-surface-container-low rounded-md p-3 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 ${reasonError ? "border border-error" : ""
                            }`}
                    />
                )}

                {reasonError && (
                    <p className="text-body-sm text-error mt-2">
                        Select a reason (and specify one if &quot;Other&quot;) before rejecting.
                    </p>
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

            <ConfirmDialog
                open={rejectDialogOpen}
                title="Reject this verification?"
                description={`The applicant will be notified with the reason you provided: "${finalReason}"`}
                confirmLabel="Reject Request"
                tone="danger"
                isLoading={rejectedLoading}
                onConfirm={handleConfirmReject}
                onCancel={() => setRejectDialogOpen(false)}
            />
        </aside >
    );
}