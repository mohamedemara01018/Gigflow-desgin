"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionsCard from "@/components/features/shared/proposal-details/Actionscard";
import AttachmentsCard from "@/components/ui/Attachmentscard";
import BidEconomicsCard from "@/components/features/shared/proposal-details/Bideconomicscard";
import ClientBriefCard from "@/components/features/shared/proposal-details/Clientbriefcard";
import ClientSidebarCard from "@/components/features/shared/proposal-details/Clientsidebarcard";
import CoverLetterPitchCard from "@/components/features/shared/proposal-details/Coverletterpitchcard";
import LifecycleCard from "@/components/features/shared/proposal-details/Lifecyclecard";
import Loading from "@/components/ui/Loading";
import { proposalService, IProposal } from "@/services/proposal.service";
import { attachmentService, IAttachmentItem } from "@/services/attachment.service";
import { AttachmentEntityType, UserRole } from "@/utils/enums.utils";
import { Clock, Eye, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import ClientActionsCard from "@/components/features/shared/proposal-details/ClientActionCard";

export default function ProposalDetailsPage({ proposalId }: { proposalId: string }) {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();

    const [proposal, setProposal] = useState<IProposal | null>(null);
    const [attachments, setAttachments] = useState<IAttachmentItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { me } = useSelector(selectMeSlice);
    const isFreelancer = me?.role === UserRole.FREELANCER;

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    const fetchProposalData = useCallback(async () => {
        if (!proposalId) return;

        try {
            setIsLoading(true);
            setError(null);

            const [proposalRes, attachmentsRes] = await Promise.all([
                proposalService.getProposalById(proposalId),
                attachmentService
                    .getEntityAttachments({
                        entity: AttachmentEntityType.PROPOSAL,
                        entityId: proposalId,
                    })
                    .catch(() => null),
            ]);

            if (proposalRes.data?.proposal) {
                setProposal(proposalRes.data.proposal);
            }

            if (attachmentsRes?.data?.attachments) {
                setAttachments(attachmentsRes.data.attachments);
            }
        } catch (err: any) {
            const message = err.message || "Failed to load proposal details";
            setError(message);
            handleToast(message, "error");
        } finally {
            setIsLoading(false);
        }
    }, [proposalId, handleToast]);

    useEffect(() => {
        fetchProposalData();
    }, [fetchProposalData]);

    if (isLoading) {
        return <Loading />;
    }

    if (error || !proposal) {
        return (
            <div className="wrapper py-12 text-center">
                <p className="text-body-lg text-error mb-4">
                    {error || "Proposal not found"}
                </p>
                <button
                    onClick={() => router.back()}
                    className="text-primary hover:underline inline-flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>
        );
    }

    const jobTitle = proposal.job?.title || "Job Details";
    const statusText = typeof proposal.status === "string" ? proposal.status : "PENDING";
    const formattedSubmittedDate = proposal.createdAt
        ? new Date(proposal.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "N/A";

    const formattedViewedDate = proposal.viewedAt
        ? new Date(proposal.viewedAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : null;

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-primary text-body-md font-medium mb-4 hover:underline cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <h1 className="text-headline-lg text-on-surface mt-2">
                    Proposal Details: {jobTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="text-label-sm text-on-primary bg-primary px-2.5 py-1 rounded uppercase">
                        {statusText}
                    </span>
                    <span className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                        <Clock size={13} />
                        Submitted: {formattedSubmittedDate}
                    </span>
                    {proposal.clientViewed && (
                        <span className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                            <Eye size={13} />
                            Viewed by Client
                            {formattedViewedDate ? `: ${formattedViewedDate}` : ""}
                        </span>
                    )}
                </div>
                <p className="text-label-sm text-on-surface-variant mt-1">
                    ID: {proposal._id}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 mt-6 items-start">
                    <div className="flex flex-col gap-6 min-w-0">
                        {/* <ClientBriefCard job={proposal.job} /> */}
                        <BidEconomicsCard proposal={proposal} />
                        <CoverLetterPitchCard coverLetter={proposal.coverLetter} />
                        <AttachmentsCard attachments={attachments} />
                    </div>

                    <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
                        {isFreelancer ? (
                            <ActionsCard proposal={proposal} refetchProposal={fetchProposalData} />
                        ) : (
                            <ClientActionsCard proposal={proposal} refetchProposal={fetchProposalData} />
                        )}
                        {isFreelancer && <LifecycleCard proposal={proposal} />}
                        {/* <ClientSidebarCard client={proposal.job?.client} /> */}
                    </aside>
                </div>
            </div>
        </main>
    );
}