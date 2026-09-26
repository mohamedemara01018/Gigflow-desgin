"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Trash2, RotateCcw, ArchiveX, AlertTriangle, MapPin } from "lucide-react";
import type { IProposal } from "@/services/proposal.service";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import { deleteProposalCascade, formatDuration, getClientLocation, getClientName, getJobTitle, PROPOSAL_ROUTES } from "./Proposalcard";


interface WithdrawnProposalCardProps {
    proposal: IProposal;
    /** Optional parent callback after a successful delete. */
    onDeleted?: () => void;
}

/**
 * Isolated card for withdrawn proposals — read-only summary with
 * "View Details" and permanent "Delete" (cleanup) actions.
 * Fully self-contained: handles its own delete + removal.
 */
export default function WithdrawnProposalCard({ proposal, onDeleted }: WithdrawnProposalCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    if (isDeleted) return null;

    const withdrawnDateLabel = formatDateTime(
        proposal.withdrawnAt ?? proposal.updatedAt ?? proposal.createdAt ?? new Date()
    ).date;
    const submittedDateLabel = proposal.createdAt ? formatDateTime(proposal.createdAt).date : "";
    const clientLocation = getClientLocation(proposal);

    const handleDelete = async () => {
        setActionError(null);
        setDeleting(true);
        try {
            await deleteProposalCascade(proposal._id);
            setIsDeleted(true);
            onDeleted?.();
        } catch (err) {
            setActionError(
                err instanceof Error ? err.message : "Could not delete the proposal. Please try again."
            );
            setDeleteDialogOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <article className="card !p-0 border-l-4 border-l-outline-variant overflow-hidden">
                <div className="p-5">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
                            <span className="text-label-sm rounded px-2 py-1 font-medium bg-surface-container-high text-on-surface-variant">
                                WITHDRAWN
                            </span>
                            <span className="flex items-center gap-1">
                                <RotateCcw size={13} />
                                Withdrawn {withdrawnDateLabel}
                            </span>
                        </div>

                        <div className="text-right shrink-0">
                            <p className="text-label-sm text-on-surface-variant">Original Bid</p>
                            <p className="text-headline-md font-semibold text-on-surface-variant line-through">
                                {formatCurrency(proposal.bidAmount)}
                            </p>
                            <p className="text-label-sm text-on-surface-variant">
                                Est. {formatDuration(proposal.estimatedDuration)}
                            </p>
                        </div>
                    </div>

                    {/* Title & client */}
                    <h3 className="text-headline-md mt-3 text-on-surface-variant line-through">
                        <Link href={PROPOSAL_ROUTES.view(proposal._id)} className="hover:underline underline-offset-4">
                            {getJobTitle(proposal)}
                        </Link>
                    </h3>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        {getClientName(proposal)}
                        {clientLocation && (
                            <span className="inline-flex items-center gap-1 ml-2">
                                <MapPin size={12} />
                                {clientLocation}
                            </span>
                        )}
                        {submittedDateLabel && <span className="ml-2">· Submitted {submittedDateLabel}</span>}
                    </p>

                    {/* Info box */}
                    <div className="mt-4 flex items-start gap-3 bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                        <ArchiveX size={16} className="text-on-surface-variant shrink-0 mt-0.5" />
                        <p className="text-body-sm text-on-surface-variant">
                            This proposal is no longer visible to the client. Deleting it permanently removes your
                            cover letter and submitted attachments.
                        </p>
                    </div>

                    {actionError && (
                        <p className="flex items-center gap-1.5 text-label-sm text-error mt-3">
                            <AlertTriangle size={13} className="shrink-0" />
                            {actionError}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-outline-variant bg-surface-container-low">
                    <span className="text-body-sm text-on-surface-variant">
                        Withdrawn on {withdrawnDateLabel}
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => setDeleteDialogOpen(true)}
                            className="flex items-center gap-1.5 text-label-md text-error hover:underline underline-offset-2 px-2 cursor-pointer font-medium"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                        <Link
                            href={PROPOSAL_ROUTES.view(proposal._id)}
                            className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer font-medium"
                        >
                            <Eye size={15} />
                            View Details
                        </Link>
                    </div>
                </div>
            </article>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Proposal?"
                description="This permanently deletes your withdrawn proposal along with its cover letter and submitted attachments. This action cannot be undone."
                confirmLabel="Delete Proposal"
                tone="danger"
                isLoading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialogOpen(false)}
            />
        </>
    );
}