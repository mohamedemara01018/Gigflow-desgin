/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Eye,
    Loader2,
    MapPin,
    Pencil,
    Star,
    Trash2,
} from "lucide-react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ReadOnlyOverview from "@/components/ui/ReadOnlyOverview";
import AttachmentRow from "../../../ui/AttachmentRow";

import {
    attachmentService,
    IAttachmentItem,
} from "@/services/attachment.service";
import { IProposal } from "@/services/proposal.service";
import { AttachmentEntityType, ProposalStatus } from "@/utils/enums.utils";
import {
    calculateNetAmount,
    formatCurrency,
    formatDateTime,
    toRichTextContent,
} from "@/utils/functions.utils";

import {
    deleteProposalCascade,
    formatDuration,
    getClientLocation,
    getClientName,
    getJobTitle,
    PROPOSAL_ROUTES,
    withdrawProposalById,
} from "./Proposalcard";
import { AppDispatch } from "@/store/store";
import { toastify } from "@/store/slices/toastificationSlice";
import EmptyState from "@/components/ui/Emptystate";

const DURATION = 3000;

const accentByStatus: Record<string, string> = {
    [ProposalStatus.PENDING]: "border-l-primary",
    [ProposalStatus.SHORTLISTED]: "border-l-secondary",
    [ProposalStatus.ACCEPTED]: "border-l-primary",
    [ProposalStatus.REJECTED]: "border-l-outline-variant",
    [ProposalStatus.WITHDRAWN]: "border-l-outline-variant",
};

function StatusBadge({ status }: { status: ProposalStatus }) {
    const getConfig = (st: ProposalStatus) => {
        switch (st) {
            case ProposalStatus.PENDING:
                return {
                    label: "PENDING REVIEW",
                    className:
                        "bg-surface-container-high text-on-surface-variant",
                };
            case ProposalStatus.SHORTLISTED:
                return {
                    label: "SHORTLISTED",
                    className:
                        "bg-secondary-container text-on-secondary-container",
                };
            case ProposalStatus.ACCEPTED:
                return {
                    label: "OFFER ACCEPTED",
                    className: "bg-primary text-on-primary",
                };
            case ProposalStatus.WITHDRAWN:
                return {
                    label: "WITHDRAWN",
                    className:
                        "bg-surface-container-high text-on-surface-variant",
                };
            case ProposalStatus.REJECTED:
                return {
                    label: "REJECTED",
                    className: "bg-error-container text-on-error-container",
                };
            default:
                return {
                    label: String(st).toUpperCase(),
                    className:
                        "bg-surface-container-high text-on-surface-variant",
                };
        }
    };

    const { label, className } = getConfig(status);
    return (
        <span
            className={`text-label-sm rounded px-2 py-1 font-medium ${className}`}
        >
            {label}
        </span>
    );
}

export function ActiveProposalCard({
    proposal,
    onWithdrawn,
    onDeleted,
}: {
    proposal: IProposal;
    onWithdrawn: () => void;
    onDeleted: () => void;
}) {
    const dispatch: AppDispatch = useDispatch();
    const status = proposal.status as ProposalStatus;

    const isPending = status === ProposalStatus.PENDING;
    const isShortlisted = status === ProposalStatus.SHORTLISTED;
    const isAccepted = status === ProposalStatus.ACCEPTED;
    const isRejected = status === ProposalStatus.REJECTED;

    const needsAttachments = isPending || isShortlisted || isAccepted;

    // Extract initial attachments if passed inside the proposal object
    const initialAttachments =
        (proposal as IProposal & { attachments?: IAttachmentItem[] })
            .attachments ?? [];

    // Attachments State
    const [attachments, setAttachments] =
        useState<IAttachmentItem[]>(initialAttachments);
    const [loadingAttachments, setLoadingAttachments] = useState(false);

    // Ref to track fetched IDs to avoid redundant duplicate calls
    const fetchedIdRef = useRef<string | null>(null);

    // Sync state if proposal prop changes externally
    useEffect(() => {
        if (initialAttachments.length > 0) {
            setAttachments(initialAttachments);
        }
    }, [proposal._id]);

    // Fetch attachments safely
    useEffect(() => {
        const proposalId = proposal._id;

        // Skip fetch if missing, not needed, or already fetched for this ID
        if (
            !proposalId ||
            !needsAttachments ||
            fetchedIdRef.current === proposalId ||
            initialAttachments.length > 0
        ) {
            return;
        }

        let isMounted = true;

        const fetchProposalAttachments = async () => {
            try {
                setLoadingAttachments(true);
                const res = await attachmentService.getEntityAttachments({
                    entity: AttachmentEntityType.PROPOSAL,
                    entityId: proposalId,
                });

                if (isMounted) {
                    fetchedIdRef.current = proposalId;
                    if (res.data?.attachments) {
                        setAttachments(res.data.attachments);
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    const errorMessage =
                        err?.message || "Failed to fetch proposal attachments.";
                    dispatch(
                        toastify({
                            message: errorMessage,
                            type: "error",
                            duration: DURATION,
                        })
                    );
                }
            } finally {
                if (isMounted) {
                    setLoadingAttachments(false);
                }
            }
        };

        fetchProposalAttachments();

        return () => {
            isMounted = false;
        };
    }, [proposal._id, needsAttachments, dispatch]);

    // Modal & Mutation States
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // ---- Handlers ----
    const handleWithdraw = async () => {
        setWithdrawing(true);
        try {
            await withdrawProposalById(proposal._id);
            setWithdrawDialogOpen(false);
            dispatch(
                toastify({
                    message: "Proposal withdrawn successfully.",
                    type: "success",
                    duration: DURATION,
                })
            );
            onWithdrawn();
        } catch (err: any) {
            const errorMessage =
                err?.message ||
                "Could not withdraw the proposal. Please try again.";
            dispatch(
                toastify({
                    message: errorMessage,
                    type: "error",
                    duration: DURATION,
                })
            );
        } finally {
            setWithdrawing(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProposalCascade(proposal._id);
            setDeleteDialogOpen(false);
            dispatch(
                toastify({
                    message: "Proposal deleted successfully.",
                    type: "success",
                    duration: DURATION,
                })
            );
            onDeleted();
        } catch (err: any) {
            const errorMessage =
                err?.message ||
                "Could not delete the proposal. Please try again.";
            dispatch(
                toastify({
                    message: errorMessage,
                    type: "error",
                    duration: DURATION,
                })
            );
        } finally {
            setDeleting(false);
        }
    };

    // ---- Derived labels ----
    const jobTitle = getJobTitle(proposal);
    const clientName = getClientName(proposal);
    const clientLocation = getClientLocation(proposal);

    const viewHref = PROPOSAL_ROUTES.view(proposal._id);
    const editHref = PROPOSAL_ROUTES.edit(proposal._id);

    const submittedDateLabel = proposal.createdAt
        ? formatDateTime(proposal.createdAt).date
        : "";
    const acceptedDateLabel = formatDateTime(
        proposal.acceptedAt ?? String(proposal.createdAt)
    ).date;
    const declinedDateLabel = formatDateTime(
        proposal.rejectedAt ??
        String(proposal.updatedAt) ??
        proposal.createdAt
    ).date;

    const showWithdraw = isPending;
    const showEdit = isPending || isShortlisted;
    const showDelete = !isAccepted;

    return (
        <>
            <article
                className={`card p-0! border-l-4 ${accentByStatus[status] || "border-l-outline-variant"
                    } overflow-hidden`}
            >
                {isAccepted && (
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-primary-container/10 border-b border-outline-variant">
                        <span className="flex items-center gap-2 text-body-sm text-on-surface">
                            <CheckCircle2
                                size={15}
                                className="text-primary shrink-0"
                            />
                            Proposal accepted by client
                        </span>
                        <span className="flex items-center gap-1 text-label-sm text-primary font-medium shrink-0">
                            Contract Active
                        </span>
                    </div>
                )}

                {isShortlisted && (
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-secondary-container/20 border-b border-outline-variant">
                        <span className="flex items-center gap-2 text-body-sm text-on-surface">
                            <Star
                                size={15}
                                className="text-secondary shrink-0"
                            />
                            You have been shortlisted for this position
                        </span>
                        <span className="flex items-center gap-1 text-label-sm text-tertiary shrink-0">
                            <AlertTriangle size={13} />
                            Action Required
                        </span>
                    </div>
                )}

                <div className="p-5">
                    {/* Header row */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
                            <StatusBadge status={status} />

                            {isPending && (
                                <>
                                    {proposal.clientViewed && (
                                        <span className="flex items-center gap-1 text-primary">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            Viewed by client
                                        </span>
                                    )}
                                    <span>Submitted {submittedDateLabel}</span>
                                </>
                            )}

                            {isShortlisted && (
                                <span>
                                    Shortlisted · Submitted {submittedDateLabel}
                                </span>
                            )}
                            {isAccepted && (
                                <span>Accepted on {acceptedDateLabel}</span>
                            )}
                            {isRejected && (
                                <span>Declined {declinedDateLabel}</span>
                            )}
                        </div>

                        <div className="text-right shrink-0">
                            {isPending && (
                                <>
                                    <p className="text-label-sm text-on-surface-variant">
                                        Your Bid Amount
                                    </p>
                                    <p className="text-headline-md font-semibold text-on-surface">
                                        {formatCurrency(proposal.bidAmount)}
                                    </p>
                                    <p className="text-label-sm text-on-surface-variant">
                                        You&apos;ll Receive: ~
                                        {formatCurrency(
                                            calculateNetAmount(
                                                proposal.bidAmount
                                            )
                                        )}
                                    </p>
                                </>
                            )}
                            {isAccepted && (
                                <>
                                    <p className="text-label-sm text-on-surface-variant">
                                        Agreed Rate
                                    </p>
                                    <p className="text-headline-md font-semibold text-primary">
                                        {formatCurrency(proposal.bidAmount)}
                                    </p>
                                </>
                            )}
                            {isShortlisted && (
                                <>
                                    <p className="text-label-sm text-on-surface-variant">
                                        Your Active Bid
                                    </p>
                                    <p className="text-headline-md font-semibold text-on-surface">
                                        {formatCurrency(proposal.bidAmount)}
                                    </p>
                                </>
                            )}
                            {isRejected && (
                                <p className="text-label-sm text-on-surface-variant">
                                    Original Bid:{" "}
                                    {formatCurrency(proposal.bidAmount)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Title & Client details */}
                    <h3
                        className={`text-headline-md mt-3 ${isRejected
                            ? "text-on-surface-variant line-through"
                            : "text-on-surface"
                            }`}
                    >
                        <Link
                            href={`/jobs/${proposal.job?._id}`}
                            className="hover:underline underline-offset-4"
                        >
                            {jobTitle}
                        </Link>
                    </h3>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        {clientName}
                        {clientLocation && (
                            <span className="inline-flex items-center gap-1 ml-2">
                                <MapPin size={12} />
                                {clientLocation}
                            </span>
                        )}
                    </p>

                    {/* Cover Letter */}
                    {proposal.coverLetter && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                                    Cover Letter
                                </p>
                                <Link
                                    href={viewHref}
                                    className="text-label-sm text-primary hover:underline underline-offset-2"
                                >
                                    Read full proposal →
                                </Link>
                            </div>
                            <ReadOnlyOverview
                                content={toRichTextContent(
                                    proposal.coverLetter
                                )}
                                clampLines
                            />
                        </div>
                    )}

                    {/* Attachments Section */}
                    {loadingAttachments ? (
                        <div className="flex items-center gap-2 mt-4 text-body-sm text-on-surface-variant">
                            <Loader2
                                size={16}
                                className="animate-spin text-primary"
                            />
                            Loading attachments...
                        </div>
                    ) : (
                        attachments.length > 0 && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                                        Submitted Attachments (
                                        {attachments.length}{" "}
                                        {attachments.length === 1
                                            ? "File"
                                            : "Files"}
                                        )
                                    </p>
                                    <p className="text-label-sm text-on-surface-variant">
                                        Encrypted Vault
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                                    {attachments.map((att, idx) => (
                                        <AttachmentRow
                                            key={att._id || `att-${idx}`}
                                            attachment={att}
                                            dense={isAccepted || isShortlisted}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    )}

                    {isRejected && (
                        <div className="mt-4 bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                            <p className="text-body-sm text-on-surface-variant">
                                <span className="text-on-surface font-medium">
                                    Status:
                                </span>{" "}
                                The client moved forward with another freelancer.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-5 py-4 border-t border-outline-variant bg-surface-container-low">
                    {/* Delivery Timeline */}
                    <div className="text-body-sm text-on-surface-variant shrink-0">
                        <span className="flex items-center gap-1.5">
                            <Clock size={13} className="shrink-0" />
                            <span>
                                Delivery Timeline:{" "}
                                <span className="font-medium text-on-surface">
                                    {formatDuration(proposal.estimatedDuration)}
                                </span>
                            </span>
                        </span>
                    </div>

                    {/* Actions Group */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                        {/* Secondary/Destructive Actions Container */}
                        {(showWithdraw || showDelete) && (
                            <div className="flex items-center gap-2 justify-start sm:justify-end">
                                {showWithdraw && (
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawDialogOpen(true)}
                                        className="text-label-md text-error hover:underline underline-offset-2 py-1.5 px-2 cursor-pointer font-medium transition-colors"
                                    >
                                        Withdraw Proposal
                                    </button>
                                )}

                                {showDelete && (
                                    <button
                                        type="button"
                                        onClick={() => setDeleteDialogOpen(true)}
                                        className="flex items-center gap-1.5 text-label-md text-error hover:underline underline-offset-2 py-1.5 px-2 cursor-pointer font-medium transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Primary Route Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {showEdit && (
                                <Link
                                    href={editHref}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer font-medium text-center"
                                >
                                    <Pencil size={14} />
                                    {isShortlisted ? "Edit Terms" : "Edit Bid"}
                                </Link>
                            )}

                            {isAccepted ? (
                                <Link
                                    href={viewHref}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer font-medium text-center"
                                >
                                    <CheckCircle2 size={15} />
                                    View Active Contract
                                </Link>
                            ) : (
                                <Link
                                    href={viewHref}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer font-medium text-center ${isRejected
                                            ? "bg-surface-variant text-on-surface-variant"
                                            : "bg-primary text-on-primary"
                                        }`}
                                >
                                    <Eye size={15} />
                                    View Details
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            <ConfirmDialog
                open={withdrawDialogOpen}
                title="Withdraw Proposal?"
                description="Withdrawing will remove your proposal from the client's review list. The client will no longer see your bid, cover letter, or attachments. This action cannot be undone."
                confirmLabel="Withdraw Proposal"
                tone="danger"
                isLoading={withdrawing}
                onConfirm={handleWithdraw}
                onCancel={() => setWithdrawDialogOpen(false)}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Proposal?"
                description="This permanently deletes your proposal along with its cover letter and submitted attachments. This action cannot be undone."
                confirmLabel="Delete Proposal"
                tone="danger"
                isLoading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialogOpen(false)}
            />
        </>
    );
}