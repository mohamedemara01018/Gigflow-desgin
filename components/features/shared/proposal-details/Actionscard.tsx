"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { XCircle, PenLine, MessageSquare, Loader2, Trash2, Clock } from "lucide-react";
import { proposalService, IProposal } from "@/services/proposal.service";
import { ProposalStatus } from "@/utils/enums.utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

interface ActionsCardProps {
    proposal?: IProposal | null;
    refetchProposal?: () => void;
}

export default function ActionsCard({ proposal, refetchProposal }: ActionsCardProps) {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    if (!proposal) return null;

    const isWithdrawn = proposal.status === ProposalStatus.WITHDRAWN || proposal.status === "WITHDRAWN";
    const isRejected = proposal.status === ProposalStatus.REJECTED || proposal.status === "REJECTED";
    const isAccepted = proposal.status === ProposalStatus.ACCEPTED || proposal.status === "ACCEPTED";

    const handleWithdraw = async () => {
        if (!proposal._id || isUpdating) return;

        try {
            setIsUpdating(true);
            await proposalService.updateProposalStatus(proposal._id, {
                status: ProposalStatus.WITHDRAWN,
            });
            handleToast("Proposal withdrawn successfully.", "success");
            if (refetchProposal) refetchProposal();
        } catch (err: any) {
            handleToast(err.message || "Failed to withdraw proposal.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!proposal._id || isUpdating) return;

        try {
            setIsUpdating(true);
            await proposalService.deleteProposal(proposal._id);
            handleToast("Proposal deleted successfully.", "success");
            router.push("/freelancer/proposals");
        } catch (err: any) {
            handleToast(err.message || "Failed to delete proposal.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMessageClient = () => {
        const clientId = typeof proposal.job?.client === "object" ? proposal.job.client?._id : proposal.job?.client;
        if (clientId) {
            router.push(`/messages?recipient=${clientId}`);
        } else {
            handleToast("Client details unavailable.", "error");
        }
    };

    const handleReviseBid = () => {
        router.push(`/freelancer/proposals/${proposal._id}/update`);
    };

    return (
        <section className="card p-4!">
            <div className="flex flex-col gap-2">
                {/* Message Client button (hidden when proposal is ACCEPTED) */}
                {!isAccepted && (
                    <button
                        onClick={handleMessageClient}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                        <MessageSquare size={15} />
                        Message Client
                    </button>
                )}

                {/* Status Notice when Proposal is ACCEPTED */}
                {isAccepted && (
                    <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-primary-container/30 border border-primary/20 rounded-md">
                        <Clock size={20} className="text-primary animate-pulse" />
                        <p className="text-body-md font-medium text-on-surface">
                            Proposal Accepted!
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                            Please wait... The client will text you soon.
                        </p>
                    </div>
                )}

                {!isWithdrawn && !isRejected && !isAccepted && (
                    <button
                        onClick={handleReviseBid}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                        <PenLine size={15} />
                        Revise Bid
                    </button>
                )}

                {!isWithdrawn && !isRejected && !isAccepted && (
                    <button
                        onClick={handleWithdraw}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                        {isUpdating ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <XCircle size={15} />
                        )}
                        Withdraw Proposal
                    </button>
                )}

                {(isWithdrawn || isRejected) && (
                    <button
                        onClick={handleDelete}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 bg-error-container text-on-error-container text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                        {isUpdating ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <Trash2 size={15} />
                        )}
                        Delete Proposal
                    </button>
                )}
            </div>
        </section>
    );
}