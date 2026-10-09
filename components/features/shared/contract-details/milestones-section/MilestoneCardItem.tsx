"use client";

import { useState } from "react";
import {
    Lock,
    CalendarClock,
    CheckCheck,
    Eye,
    CheckCircle2,
    AlertTriangle,
    Send,
    X,
} from "lucide-react";
import { IContract } from "@/services/contract.service";
import { IMilestone, milestoneService } from "@/services/milestone.service";
import { toastify } from "@/store/slices/toastificationSlice";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

const statusBadgeClass: Record<string, string> = {
    completed: "bg-primary/10 text-primary font-medium",
    in_progress: "bg-primary-container/15 text-primary",
    pending: "bg-surface-container-high text-on-surface-variant",
    cancelled: "bg-error/10 text-error",
};

const numberBadgeClass: Record<string, string> = {
    completed: "bg-primary text-on-primary",
    in_progress: "bg-primary text-on-primary",
    pending: "bg-surface-container-high text-on-surface-variant",
    cancelled: "bg-error/10 text-error",
};

export interface MilestoneCardItemProps {
    milestone: IMilestone;
    contract: IContract;
    isClient: boolean;
    isFreelancer: boolean;
    onSuccess: () => void;
}

export function MilestoneCardItem({
    milestone,
    contract,
    isClient,
    isFreelancer,
    onSuccess,
}: MilestoneCardItemProps) {
    const dispatch: AppDispatch = useDispatch();

    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submissionNotes, setSubmissionNotes] = useState("");
    const [submissionUrl, setSubmissionUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const st = (milestone.status || "pending").toLowerCase();
    const isCompleted = st === "completed";
    const isInProgress = st === "in_progress";

    const hasSubmission = Boolean(
        milestone.submissionNotes || milestone.submissionUrl || milestone.submittedAt
    );

    const dueFormatted = milestone.dueDate
        ? formatDateTime(milestone.dueDate).date
        : "No due date set";

    // Client Approve & Release
    const handleApprove = async () => {
        try {
            setIsApproving(true);
            const res = await milestoneService.approveMilestone(milestone._id);
            dispatch(
                toastify({
                    message: res.message || "Milestone approved and funds released successfully!",
                    type: "success",
                })
            );
            setShowApproveConfirm(false);
            onSuccess();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            dispatch(
                toastify({
                    message: err.message || "Failed to approve milestone",
                    type: "error",
                })
            );
        } finally {
            setIsApproving(false);
        }
    };

    // Client Reject / Request Revision
    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectionReason.trim()) {
            dispatch(
                toastify({
                    message: "Please provide a reason or revision note",
                    type: "error",
                })
            );
            return;
        }

        try {
            setIsRejecting(true);
            const res = await milestoneService.rejectMilestone(milestone._id, {
                rejectionReason: rejectionReason.trim(),
            });
            dispatch(
                toastify({
                    message: res.message || "Milestone revision requested",
                    type: "success",
                })
            );
            setShowRejectModal(false);
            setRejectionReason("");
            onSuccess();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            dispatch(
                toastify({
                    message: err.message || "Failed to request milestone revision",
                    type: "error",
                })
            );
        } finally {
            setIsRejecting(false);
        }
    };

    // Freelancer Submit Work
    const handleSubmitWork = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await milestoneService.submitMilestone(milestone._id, {
                submissionNotes: submissionNotes.trim() || undefined,
                submissionUrl: submissionUrl.trim() || undefined,
            });
            dispatch(
                toastify({
                    message: res.message || "Milestone deliverable submitted successfully!",
                    type: "success",
                })
            );
            setShowSubmitModal(false);
            setSubmissionNotes("");
            setSubmissionUrl("");
            onSuccess();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            dispatch(
                toastify({
                    message: err.message || "Failed to submit milestone work",
                    type: "error",
                })
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <article className="card relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-label-md shrink-0 font-semibold ${numberBadgeClass[st] || numberBadgeClass.pending
                            }`}
                    >
                        {milestone.order || 1}
                    </span>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`text-label-sm rounded px-2 py-0.5 capitalize ${statusBadgeClass[st] || statusBadgeClass.pending
                                    }`}
                            >
                                {st.replace("_", " ")}
                            </span>
                            {hasSubmission && !isCompleted && (
                                <span className="flex items-center gap-1 text-label-sm text-primary bg-primary/10 rounded px-2 py-0.5 font-medium">
                                    Work Submitted
                                </span>
                            )}
                            {isInProgress && (
                                <span className="flex items-center gap-1 text-label-sm text-on-surface-variant bg-surface-container-high rounded px-2 py-0.5">
                                    <Lock size={11} />
                                    Funded in Escrow
                                </span>
                            )}
                        </div>
                        <h3 className="text-body-lg font-semibold text-on-surface mt-1.5">{milestone.title}</h3>
                        {milestone.description && (
                            <p className="text-body-sm text-on-surface-variant mt-1">{milestone.description}</p>
                        )}
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-label-sm text-on-surface-variant">Milestone Value</p>
                    <p className="text-headline-md text-on-surface mt-0.5 font-semibold">
                        {formatCurrency(milestone.amount)}
                    </p>
                    <p className="flex items-center justify-end gap-1 text-label-sm mt-0.5 text-on-surface-variant">
                        <CalendarClock size={12} />
                        {dueFormatted}
                    </p>
                </div>
            </div>

            {/* Submission Section */}
            {hasSubmission && (
                <div className="bg-surface-container-high border border-outline-variant rounded-md p-4 mt-4">
                    <p className="text-body-sm text-on-surface font-medium flex items-center justify-between">
                        <span>Work Submission Deliverables</span>
                        {milestone.submittedAt && (
                            <span className="text-label-sm text-on-surface-variant font-normal">
                                {formatDateTime(milestone.submittedAt).date} at {formatDateTime(milestone.submittedAt).time}
                            </span>
                        )}
                    </p>
                    {milestone.submissionNotes && (
                        <p className="text-body-sm text-on-surface-variant italic mt-1.5">
                            &ldquo;{milestone.submissionNotes}&rdquo;
                        </p>
                    )}
                    {milestone.submissionUrl && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            <a
                                href={milestone.submissionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-label-sm text-primary hover:underline bg-surface-container-high rounded px-2.5 py-1"
                            >
                                <Eye size={12} />
                                View Submission Link: {milestone.submissionUrl}
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* Rejection / Revision Note */}
            {milestone.rejectionReason && (
                <div className="bg-error/10 border border-error/20 rounded-md p-3.5 mt-3 flex items-start gap-2.5">
                    <AlertTriangle size={15} className="text-error shrink-0 mt-0.5" />
                    <div>
                        <p className="text-body-sm text-error font-medium">Revision Requested:</p>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">{milestone.rejectionReason}</p>
                    </div>
                </div>
            )}

            {/* Client Actions: Approve & Release / Request Revision */}
            {isClient && isInProgress && (
                <div className="flex flex-wrap items-center justify-end gap-3 mt-4 pt-3 border-t border-outline-variant/50">
                    <button
                        onClick={() => setShowRejectModal(true)}
                        className="bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        Request Revision
                    </button>
                    <button
                        onClick={() => setShowApproveConfirm(true)}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <CheckCheck size={15} />
                        Approve &amp; Release {formatCurrency(milestone.amount)}
                    </button>
                </div>
            )}

            {/* Freelancer Actions: Submit Work */}
            {isFreelancer && isInProgress && (
                <div className="flex flex-wrap items-center justify-end gap-3 mt-4 pt-3 border-t border-outline-variant/50">
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <Send size={15} />
                        {hasSubmission ? "Update Submitted Deliverables" : "Submit Milestone Work"}
                    </button>
                </div>
            )}

            {/* Completed Milestone Status */}
            {isCompleted && (
                <div className="flex items-center justify-between text-label-md text-primary mt-4 pt-3 border-t border-outline-variant/50">
                    <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 size={16} />
                        Milestone Approved &amp; Funds Released
                    </span>
                    {milestone.approvedAt && (
                        <span className="text-label-sm text-on-surface-variant">
                            {formatDateTime(milestone.approvedAt).date}
                        </span>
                    )}
                </div>
            )}

            {/* Confirmation Dialog for Milestone Approval & Release */}
            <ConfirmDialog
                open={showApproveConfirm}
                title="Approve Milestone & Release Escrow Funds"
                description={`Are you sure you want to approve milestone #${milestone.order || 1}: "${milestone.title}"? This will immediately transfer ${formatCurrency(milestone.amount)} to the freelancer's Stripe Connect account.`}
                confirmLabel="Yes, Approve & Release"
                tone="default"
                isLoading={isApproving}
                onConfirm={handleApprove}
                onCancel={() => setShowApproveConfirm(false)}
            />

            {/* Revision Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-2xl border border-outline-variant">
                        <div className="flex items-center justify-between">
                            <h3 className="text-headline-sm font-semibold text-on-surface">Request Revision</h3>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="text-on-surface-variant hover:text-on-surface"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleReject} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="text-label-sm text-on-surface-variant mb-1 block">
                                    Revision Feedback / Reason:
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain the changes or deliverables requested from the freelancer..."
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-md p-3 text-body-sm text-on-surface outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-4 py-2 text-label-md text-on-surface-variant hover:text-on-surface cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isRejecting}
                                    className="bg-error text-white text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                                >
                                    {isRejecting ? "Submitting..." : "Send Revision Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submit Work Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-xl max-w-md w-full p-6 shadow-2xl border border-outline-variant">
                        <div className="flex items-center justify-between">
                            <h3 className="text-headline-sm font-semibold text-on-surface">Submit Milestone Work</h3>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="text-on-surface-variant hover:text-on-surface"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitWork} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="text-label-sm text-on-surface-variant mb-1 block">
                                    Submission Notes:
                                </label>
                                <textarea
                                    rows={3}
                                    value={submissionNotes}
                                    onChange={(e) => setSubmissionNotes(e.target.value)}
                                    placeholder="Summary of deliverables completed for this milestone..."
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-md p-3 text-body-sm text-on-surface outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-label-sm text-on-surface-variant mb-1 block">
                                    Deliverable URL (GitHub, Figma, Drive, etc.):
                                </label>
                                <input
                                    type="url"
                                    value={submissionUrl}
                                    onChange={(e) => setSubmissionUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-md p-3 text-body-sm text-on-surface outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="px-4 py-2 text-label-md text-on-surface-variant hover:text-on-surface cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary text-on-primary text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Deliverables"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </article>
    );
}