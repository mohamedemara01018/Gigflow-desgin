"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    MessageSquare,
    CheckCircle2,
    XCircle,
    Star,
    Loader2,
} from "lucide-react";
import { proposalService, IProposal } from "@/services/proposal.service";
import { conversationService } from "@/services/conversation.service";
import { ProposalStatus } from "@/utils/enums.utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

interface ClientActionsCardProps {
    proposal?: IProposal | null;
    refetchProposal?: () => void;
}

export default function ClientActionsCard({
    proposal,
    refetchProposal,
}: ClientActionsCardProps) {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpeningChat, setIsOpeningChat] = useState(false);

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    if (!proposal) return null;

    const statusStr = (proposal.status || "PENDING").toString().toUpperCase();
    const isAccepted = statusStr === ProposalStatus.ACCEPTED || statusStr === "ACCEPTED";
    const isRejected = statusStr === ProposalStatus.REJECTED || statusStr === "REJECTED";
    const isWithdrawn = statusStr === ProposalStatus.WITHDRAWN || statusStr === "WITHDRAWN";
    const isShortlisted = statusStr === ProposalStatus.SHORTLISTED || statusStr === "SHORTLISTED";

    const updateStatus = async (status: ProposalStatus, successMessage: string) => {
        if (!proposal._id || isUpdating) return;

        try {
            setIsUpdating(true);
            await proposalService.updateProposalStatus(proposal._id, { status });
            handleToast(successMessage, "success");
            if (refetchProposal) refetchProposal();
        } catch (err: any) {
            handleToast(err.message || "Failed to update proposal status.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMessageFreelancer = async () => {
        if (!proposal._id || isOpeningChat) return;

        try {
            setIsOpeningChat(true);
            const res = await conversationService.createOrGetConversation({
                proposalId: proposal._id,
            });
            const conv = res.data?.conversation;
            if (conv?._id) {
                router.push(`/messages?id=${conv._id}`);
            } else {
                throw new Error("Conversation ID not returned");
            }
        } catch (err: any) {
            handleToast(err.message || "Failed to open conversation.", "error");
        } finally {
            setIsOpeningChat(false);
        }
    };

    const handleHireFreelancer = async () => {
        await updateStatus(ProposalStatus.ACCEPTED, "Proposal accepted and offer sent!");
    };

    return (
        <section className="card p-4!">
            <div className="flex flex-col gap-2">
                {/* Message Freelancer Button */}
                {!isWithdrawn && (
                    <button
                        onClick={handleMessageFreelancer}
                        disabled={isOpeningChat || isUpdating}
                        className="flex items-center justify-center gap-2 bg-primary text-on-primary text-label-md font-semibold rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                        {isOpeningChat ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Opening chat...
                            </>
                        ) : (
                            <>
                                <MessageSquare size={15} />
                                Message Freelancer
                            </>
                        )}
                    </button>
                )}

                {/* Hire / Send Offer button changes status to ACCEPTED */}
                {!isAccepted && !isWithdrawn && (
                    <button
                        onClick={handleHireFreelancer}
                        disabled={isUpdating || isOpeningChat}
                        className="flex items-center justify-center gap-2 bg-surface-variant text-on-surface-variant font-semibold text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                        {isUpdating ? (
                            <Loader2 size={15} className="animate-spin text-primary" />
                        ) : (
                            <CheckCircle2 size={15} className="text-primary" />
                        )}
                        Hire / Send Offer
                    </button>
                )}

                {/* Shortlist Action */}
                {!isAccepted && !isWithdrawn && !isRejected && (
                    <button
                        onClick={() =>
                            updateStatus(
                                isShortlisted ? ProposalStatus.PENDING : ProposalStatus.SHORTLISTED,
                                isShortlisted ? "Removed from shortlist." : "Proposal shortlisted!"
                            )
                        }
                        disabled={isUpdating || isOpeningChat}
                        className={`flex items-center justify-center gap-2 text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 ${isShortlisted
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-surface-variant text-on-surface-variant"
                            }`}
                    >
                        {isUpdating ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <Star size={15} className={isShortlisted ? "fill-current" : ""} />
                        )}
                        {isShortlisted ? "Shortlisted" : "Shortlist Proposal"}
                    </button>
                )}

                {/* Decline Action */}
                {!isAccepted && !isWithdrawn && !isRejected && (
                    <button
                        onClick={() =>
                            updateStatus(
                                ProposalStatus.REJECTED,
                                "Proposal has been declined."
                            )
                        }
                        disabled={isUpdating || isOpeningChat}
                        className="flex items-center justify-center gap-2 bg-error-container/40 text-error text-label-md rounded-md px-4 py-2.5 hover:bg-error-container/60 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isUpdating ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <XCircle size={15} />
                        )}
                        Decline Proposal
                    </button>
                )}

                {/* Withdrawn Notice */}
                {isWithdrawn && (
                    <div className="p-3 bg-surface-container-highest rounded-md text-center text-body-sm text-on-surface-variant">
                        This proposal was withdrawn by the freelancer.
                    </div>
                )}
            </div>
        </section>
    );
}