/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useState } from "react";
import {
    PlusCircle,
    CheckCircle2,
    Clock,
    Flag,
    AlertCircle,
    XCircle,
    Send,
    Trash2,
    ExternalLink,
    Check,
    RotateCcw,
    FileText,
    Loader2,
    Star
} from "lucide-react";

import {
    IContract,
    ICreateContractDto,
    IUpdateContractDto,
    IRespondContractDto,
} from "@/services/contract.service";
import {
    IMilestone,
    ICreateMilestoneDto,
    ISubmitMilestoneDto,
    IRejectMilestoneDto,
} from "@/services/milestone.service";
import { IProposal, proposalService } from "@/services/proposal.service";
import { IReview, reviewService } from "@/services/review.service";
import { ContractStatus, ContractType, MilestoneStatus, UserRole } from "@/utils/enums.utils";

import NoContractCard from "./project-dossier/NoContractCard";
import ContractHeader from "./project-dossier/ContractHeader";
import ContractResponseAction from "./project-dossier/ContractResponseAction";
import ContractFinancialSummary from "./project-dossier/ContractFinancialSummary";
import CreateMilestoneModal from "@/components/modals/CreateMilestoneModal";
import SubmitMilestoneModal from "@/components/modals/SubmitMilestoneModal";
import RejectMilestoneModal from "@/components/modals/RejectMilestoneModal";
import { useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";

export interface IContractWithMilestones extends IContract {
    milestones?: IMilestone[];
}

interface ProjectDossierProps {
    proposal?: string;
    activeConversationId: string;
    contract?: IContractWithMilestones | null;
    onCreateContract?: (payload: ICreateContractDto) => Promise<void>;
    onSendContract?: (id: string) => Promise<void>;
    onRespondContract?: (id: string, payload: IRespondContractDto) => Promise<void>;
    onUpdateContract?: (id: string, payload: IUpdateContractDto) => Promise<void>;
    onDeleteContract?: (id: string) => Promise<void>;
    onCreateMilestone?: (payload: ICreateMilestoneDto) => Promise<void>;
    onDeleteMilestone?: (id: string) => Promise<void>;
    onSubmitMilestone?: (id: string, payload?: ISubmitMilestoneDto) => Promise<void>;
    onApproveMilestone?: (id: string) => Promise<void>;
    onRejectMilestone?: (id: string, payload: IRejectMilestoneDto) => Promise<void>;
    onDeleteConversation?: (id: string) => Promise<void>;
}

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getMilestoneBadge = (status: MilestoneStatus | string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
        case "approved":
        case "completed":
            return {
                label: "Approved & Paid",
                colorClass: "bg-green-100 text-green-700",
                icon: <CheckCircle2 size={12} />,
            };
        case "submitted":
            return {
                label: "Submitted (Under Review)",
                colorClass: "bg-purple-100 text-purple-700",
                icon: <Send size={12} />,
            };
        case "in_progress":
            return {
                label: "In Progress",
                colorClass: "bg-blue-100 text-blue-700",
                icon: <Clock size={12} />,
            };
        case "rejected":
            return {
                label: "Revision Requested",
                colorClass: "bg-red-100 text-red-700",
                icon: <XCircle size={12} />,
            };
        case "cancelled":
            return {
                label: "Cancelled",
                colorClass: "bg-gray-100 text-gray-700",
                icon: <XCircle size={12} />,
            };
        case "pending":
        default:
            return {
                label: "Pending",
                colorClass: "bg-amber-100 text-amber-800",
                icon: <AlertCircle size={12} />,
            };
    }
};

export default function ProjectDossier({
    proposal: proposalId,
    activeConversationId,
    contract,
    onCreateContract,
    onSendContract,
    onRespondContract,
    onUpdateContract,
    onDeleteContract,
    onCreateMilestone,
    onDeleteMilestone,
    onSubmitMilestone,
    onApproveMilestone,
    onRejectMilestone,
    onDeleteConversation,
}: ProjectDossierProps) {
    const [proposalData, setProposalData] = useState<IProposal | null>(null);
    const [isLoadingProposal, setIsLoadingProposal] = useState(false);
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [isSendingToFreelancer, setIsSendingToFreelancer] = useState(false);

    // Submission and Rejection modal states
    const [selectedMilestoneForSubmit, setSelectedMilestoneForSubmit] = useState<IMilestone | null>(null);
    const [selectedMilestoneForReject, setSelectedMilestoneForReject] = useState<IMilestone | null>(null);
    const [approvingMilestoneId, setApprovingMilestoneId] = useState<string | null>(null);

    // Reviews state
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [userRating, setUserRating] = useState<number>(5);
    const [userHoverRating, setUserHoverRating] = useState<number>(0);
    const [userComment, setUserComment] = useState<string>("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

    // Deleting conversation state
    const [isDeletingConversation, setIsDeletingConversation] = useState(false);

    const { me } = useSelector(selectMeSlice);
    const isFreelancer = me?.role === UserRole.FREELANCER;
    const isClient = me?.role === UserRole.CLIENT;

    const getProposalOfContract = useCallback(async () => {
        if (!proposalId) return;
        try {
            setIsLoadingProposal(true);
            const res = await proposalService.getProposalById(proposalId);
            setProposalData(res.data.proposal);
        } catch (error) {
            console.error("Failed to fetch proposal details:", error);
        } finally {
            setIsLoadingProposal(false);
        }
    }, [proposalId]);

    useEffect(() => {
        getProposalOfContract();
    }, [getProposalOfContract]);

    const isCompleted = contract?.status === ContractStatus.COMPLETED || (contract?.status as string) === "completed";

    const fetchReviews = useCallback(async () => {
        if (!contract?._id || !isCompleted) return;
        try {
            setIsLoadingReviews(true);
            const res = await reviewService.getContractReviews(contract._id);
            setReviews(res.data?.reviews || []);
        } catch (err) {
            console.error("Failed to load reviews:", err);
        } finally {
            setIsLoadingReviews(false);
        }
    }, [contract?._id, isCompleted]);

    useEffect(() => {
        if (isCompleted && contract?._id) {
            fetchReviews();
        }
    }, [isCompleted, contract?._id, fetchReviews]);

    if (!contract) {
        return (
            <NoContractCard
                activeConversationId={activeConversationId}
                proposalId={proposalId}
                onCreateContract={onCreateContract}
            />
        );
    }

    const isActive = contract.status === ContractStatus.ACTIVE || (contract.status as string) === "active";
    const isDraft = contract.status === ContractStatus.DRAFT || (contract.status as string) === "draft";
    const isRejected = contract.status === ContractStatus.REJECTED || (contract.status as string) === "rejected";
    const isHourly = contract.type === ContractType.HOURLY || contract.type === "hourly";

    // Milestone metrics
    const milestones = contract.milestones || [];
    const totalAllocatedMilestones = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
    const remainingBudget = Math.max(0, Math.round((contract.totalAmount - totalAllocatedMilestones) * 100) / 100);

    const completedMilestonesCount = milestones.filter(
        (m) => (m.status || "").toLowerCase() === "approved" || (m.status || "").toLowerCase() === "completed"
    ).length;

    const progress = milestones.length > 0
        ? Math.round((completedMilestonesCount / milestones.length) * 100)
        : isCompleted
            ? 100
            : 0;

    const handleSendToFreelancer = async () => {
        if (!onSendContract || !contract._id) return;
        try {
            setIsSendingToFreelancer(true);
            await onSendContract(contract._id);
        } finally {
            setIsSendingToFreelancer(false);
        }
    };

    const handleApprove = async (milestoneId: string) => {
        if (!onApproveMilestone) return;
        try {
            setApprovingMilestoneId(milestoneId);
            await onApproveMilestone(milestoneId);
        } finally {
            setApprovingMilestoneId(null);
        }
    };

    const handleSubmitReview = async () => {
        if (!contract._id) return;
        if (!userRating || userRating < 1 || userRating > 5) {
            setReviewError("Please select a rating between 1 and 5 stars.");
            return;
        }
        if (!userComment.trim()) {
            setReviewError("Please write a comment for your review.");
            return;
        }

        try {
            setIsSubmittingReview(true);
            setReviewError(null);
            await reviewService.createReview({
                contractId: contract._id,
                rating: userRating,
                comment: userComment.trim(),
            });
            setUserComment("");
            await fetchReviews();
        } catch (err: any) {
            setReviewError(err?.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleDeleteConversationClick = async () => {
        if (!onDeleteConversation || !activeConversationId) return;
        if (!window.confirm("Are you sure you want to delete this conversation? This will remove it from your inbox.")) return;
        try {
            setIsDeletingConversation(true);
            await onDeleteConversation(activeConversationId);
        } finally {
            setIsDeletingConversation(false);
        }
    };

    // Determine current user's review and other reviews
    const myReview = reviews.find((r) => {
        const reviewerId = typeof r.reviewer === "object" ? r.reviewer?._id : r.reviewer;
        return String(reviewerId) === String(me?._id);
    });

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto pr-0.5">
            {/* Main Contract Section */}
            <section className="card p-5! flex flex-col gap-4 border border-border rounded-lg bg-white">
                <ContractHeader
                    isFreelancer={isFreelancer}
                    contract={contract}
                    isActive={isActive}
                    onUpdateContract={onUpdateContract}
                    onDeleteContract={onDeleteContract}
                />

                {/* Freelancer Review Actions */}
                {isDraft && isFreelancer ? (
                    contract.sentToFreelancer && onRespondContract ? (
                        <ContractResponseAction
                            contractId={contract._id}
                            onRespondContract={onRespondContract}
                        />
                    ) : (
                        <div className="p-3.5 border border-amber-200 bg-amber-50/60 rounded-xl flex items-center gap-2 text-body-xs text-amber-800">
                            <Clock size={15} className="text-amber-600 shrink-0" />
                            <span>Client is currently drafting contract terms and milestones.</span>
                        </div>
                    )
                ) : null}

                {/* Client Draft Actions & "Send to Freelancer" */}
                {isDraft && isClient && (
                    <div className="flex flex-col gap-2.5 p-3.5 border border-amber-200 bg-amber-50/60 rounded-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                                Draft Contract
                            </span>
                            <span className="text-body-xs text-amber-700">
                                {milestones.length === 0
                                    ? "Add milestones below"
                                    : remainingBudget > 0
                                        ? `$${remainingBudget.toLocaleString()} unallocated`
                                        : contract.sentToFreelancer
                                            ? "Sent to freelancer"
                                            : "Ready for review"}
                            </span>
                        </div>
                        <p className="text-body-xs text-amber-800">
                            {contract.sentToFreelancer
                                ? "Contract has been sent to the freelancer for review and acceptance."
                                : "Create deliverables/milestones below, then send the contract to the freelancer for review."}
                        </p>
                        {!contract.sentToFreelancer && milestones.length > 0 && onSendContract && (
                            <button
                                type="button"
                                onClick={handleSendToFreelancer}
                                disabled={isSendingToFreelancer}
                                className="inline-flex items-center justify-center gap-2 py-2 px-3 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isSendingToFreelancer ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Send size={14} />
                                )}
                                Send to Freelancer
                            </button>
                        )}
                        {!contract.sentToFreelancer && milestones.length === 0 && (
                            <span className="text-body-xs font-medium text-amber-800">
                                ⚠️ Add at least one milestone below before sending the contract.
                            </span>
                        )}
                        {contract.sentToFreelancer && (
                            <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-200">
                                <CheckCircle2 size={13} />
                                <span>Sent to freelancer {contract.sentAt ? `on ${formatDate(contract.sentAt)}` : ""}. Waiting for response.</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Contract Completed Banner */}
                {isCompleted && (
                    <div className="p-3.5 border border-green-200 bg-green-50/80 rounded-xl flex items-center justify-between text-body-xs text-green-800">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                            <div>
                                <p className="font-semibold text-green-900">Contract Completed</p>
                                <p className="text-[11px] text-green-700">All milestones have been delivered and released.</p>
                            </div>
                        </div>
                        {contract.completedAt && (
                            <span className="text-green-700 text-xs font-medium">
                                {formatDate(contract.completedAt)}
                            </span>
                        )}
                    </div>
                )}

                {/* Rejection Notice */}
                {isRejected && (
                    <div className="p-3.5 border border-red-200 bg-red-50 rounded-xl flex flex-col gap-1.5 text-body-xs text-red-800">
                        <div className="flex items-center gap-1.5 font-semibold text-red-900">
                            <XCircle size={15} />
                            <span>Contract Rejected by Freelancer</span>
                        </div>
                        {contract.rejectionReason && (
                            <p className="italic bg-white/70 p-2 rounded border border-red-100 text-red-900">
                                &ldquo;{contract.rejectionReason}&rdquo;
                            </p>
                        )}
                        {isClient && (
                            <p className="text-red-700 mt-1">
                                You can edit the contract or milestone terms above and re-send.
                            </p>
                        )}
                    </div>
                )}

                {/* Overall Completion Bar */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-body-sm">
                        <span className="text-on-surface-variant">Overall Completion</span>
                        <span className="font-medium text-on-surface">{progress}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <ContractFinancialSummary contract={contract} isHourly={isHourly} />
            </section>

            {/* Reviews Section for Completed Contracts */}
            {isCompleted && (
                <section className="card p-5! flex flex-col gap-4 border border-border rounded-lg bg-white">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                        <h3 className="text-body-md font-semibold text-on-surface flex items-center gap-1.5">
                            <Star size={16} className="text-amber-500 fill-amber-500" />
                            Client &amp; Freelancer Reviews
                        </h3>
                    </div>

                    {isLoadingReviews ? (
                        <div className="flex py-4 justify-center">
                            <Loader2 size={18} className="animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {/* User's Own Review */}
                            {myReview ? (
                                <div className="p-3.5 bg-amber-50/40 border border-amber-200/70 rounded-xl flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                                            Your Review
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={13}
                                                    className={star <= myReview.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-body-xs text-on-surface whitespace-pre-line leading-relaxed">
                                        {myReview.comment}
                                    </p>
                                    <span className="text-[11px] text-on-surface-variant">
                                        Submitted on {formatDate(myReview.createdAt)}
                                    </span>
                                </div>
                            ) : (
                                /* Review Submission Form */
                                <div className="p-3.5 border border-purple-200 bg-purple-50/30 rounded-xl flex flex-col gap-3">
                                    <div>
                                        <h4 className="text-body-sm font-semibold text-purple-950">
                                            Rate your experience with the {isClient ? "Freelancer" : "Client"}
                                        </h4>
                                        <p className="text-body-xs text-on-surface-variant mt-0.5">
                                            Share feedback about your collaboration on this project.
                                        </p>
                                    </div>

                                    {reviewError && (
                                        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-body-xs flex items-center gap-1.5">
                                            <AlertCircle size={13} className="shrink-0" />
                                            <span>{reviewError}</span>
                                        </div>
                                    )}

                                    {/* Star Rating Picker */}
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const activeStars = userHoverRating || userRating;
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setUserHoverRating(star)}
                                                    onMouseLeave={() => setUserHoverRating(0)}
                                                    onClick={() => setUserRating(star)}
                                                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                                >
                                                    <Star
                                                        size={20}
                                                        className={star <= activeStars ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                                                    />
                                                </button>
                                            );
                                        })}
                                        <span className="text-xs font-semibold text-on-surface ml-1.5">
                                            {userHoverRating || userRating} / 5
                                        </span>
                                    </div>

                                    <textarea
                                        rows={3}
                                        placeholder={`How was working with the ${isClient ? "freelancer" : "client"}? Mention communication, quality, timeliness...`}
                                        value={userComment}
                                        onChange={(e) => setUserComment(e.target.value)}
                                        disabled={isSubmittingReview}
                                        className="text-body-xs p-2.5 border border-border rounded-lg bg-white resize-none focus:outline-hidden focus:ring-1 focus:ring-primary"
                                    />

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSubmitReview}
                                            disabled={isSubmittingReview || !userComment.trim()}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {isSubmittingReview ? (
                                                <Loader2 size={13} className="animate-spin" />
                                            ) : (
                                                <Send size={13} />
                                            )}
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Other Reviews on this Contract */}
                            {reviews
                                .filter((r) => {
                                    const reviewerId = typeof r.reviewer === "object" ? r.reviewer?._id : r.reviewer;
                                    return String(reviewerId) !== String(me?._id);
                                })
                                .map((rev) => (
                                    <div key={rev._id} className="p-3 bg-white border border-border rounded-xl flex flex-col gap-1.5 shadow-2xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-body-xs font-semibold text-on-surface">
                                                {rev.reviewer?.firstName} {rev.reviewer?.lastName} ({rev.reviewer?.role || "Review"})
                                            </span>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={11}
                                                        className={s <= rev.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-body-xs text-on-surface whitespace-pre-line leading-relaxed">
                                            {rev.comment}
                                        </p>
                                        <span className="text-[10px] text-on-surface-variant">
                                            {formatDate(rev.createdAt)}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </section>
            )}

            {/* Milestones Section */}
            <section className="card p-5! flex flex-col gap-4 border border-border rounded-lg bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                        <h3 className="text-body-md font-semibold text-on-surface">Milestones</h3>
                        <p className="text-body-xs text-on-surface-variant mt-0.5">
                            Allocated: ${totalAllocatedMilestones.toLocaleString()} / ${contract.totalAmount.toLocaleString()} ({remainingBudget > 0 ? `$${remainingBudget.toLocaleString()} remaining` : "Fully allocated"})
                        </p>
                    </div>

                    {/* Create Milestone button (Shown only to Client while DRAFT/REJECTED and budget remains) */}
                    {isClient && (isDraft || isRejected) && onCreateMilestone && remainingBudget > 0 && (
                        <button
                            onClick={() => setIsMilestoneModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            <PlusCircle size={14} />
                            Create Milestone
                        </button>
                    )}
                </div>

                {/* Milestone Items List */}
                {milestones.length === 0 ? (
                    <div className="text-center py-6 text-on-surface-variant text-body-sm">
                        No milestones created yet.
                        {isClient && isDraft && (
                            <div className="mt-2">
                                <button
                                    onClick={() => setIsMilestoneModalOpen(true)}
                                    className="text-primary font-semibold text-xs hover:underline cursor-pointer"
                                >
                                    + Add the first milestone
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {milestones.map((milestone, idx) => {
                            const badge = getMilestoneBadge(milestone.status);
                            const mStatus = (milestone.status || "").toLowerCase();
                            const isCurrentApproving = approvingMilestoneId === milestone._id;

                            const canFreelancerSubmit =
                                isActive &&
                                isFreelancer &&
                                (mStatus === "in_progress" || mStatus === "rejected");

                            const canClientReview =
                                isActive &&
                                isClient &&
                                mStatus === "submitted";

                            return (
                                <div
                                    key={milestone._id || idx}
                                    className={`p-3.5 border rounded-xl flex flex-col gap-2.5 transition-all ${
                                        mStatus === "submitted"
                                            ? "border-purple-200 bg-purple-50/30 shadow-xs"
                                            : mStatus === "in_progress"
                                                ? "border-blue-200 bg-blue-50/20"
                                                : mStatus === "approved"
                                                    ? "border-green-200 bg-green-50/20"
                                                    : "border-border bg-surface-container-lowest"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-body-xs font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-xs">
                                                #{milestone.order ?? idx + 1}
                                            </span>
                                            <h4 className="text-body-sm font-semibold text-on-surface">
                                                {milestone.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-body-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${badge.colorClass}`}>
                                                {badge.icon}
                                                {badge.label}
                                            </span>
                                            {isClient && (isDraft || isRejected) && onDeleteMilestone && (
                                                <button
                                                    onClick={() => onDeleteMilestone(milestone._id)}
                                                    title="Delete Milestone"
                                                    className="text-gray-400 hover:text-red-600 p-0.5 rounded cursor-pointer transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {milestone.description && (
                                        <p className="text-body-xs text-on-surface-variant">
                                            {milestone.description}
                                        </p>
                                    )}

                                    {/* Submission Deliverables Box (Shown when submitted or approved) */}
                                    {(milestone.submissionNotes || milestone.submissionUrl) && (
                                        <div className="p-3 bg-white border border-purple-100 rounded-lg flex flex-col gap-2 shadow-2xs">
                                            <div className="flex items-center justify-between text-body-xs font-semibold text-purple-900 border-b border-purple-50 pb-1.5">
                                                <span className="flex items-center gap-1.5">
                                                    <FileText size={13} className="text-purple-600" />
                                                    Deliverables Submitted
                                                </span>
                                                {milestone.submittedAt && (
                                                    <span className="text-[11px] text-on-surface-variant font-normal">
                                                        {formatDate(milestone.submittedAt)}
                                                    </span>
                                                )}
                                            </div>
                                            {milestone.submissionNotes && (
                                                <p className="text-body-xs text-on-surface leading-relaxed whitespace-pre-line">
                                                    {milestone.submissionNotes}
                                                </p>
                                            )}
                                            {milestone.submissionUrl && (
                                                <div className="pt-1">
                                                    <a
                                                        href={milestone.submissionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                                    >
                                                        <ExternalLink size={12} />
                                                        View Deliverable Link
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Revision Requested Feedback Box */}
                                    {mStatus === "rejected" && milestone.rejectionReason && (
                                        <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg flex flex-col gap-1 text-body-xs text-red-800">
                                            <span className="font-semibold flex items-center gap-1 text-red-900">
                                                <RotateCcw size={12} /> Client Requested Revisions:
                                            </span>
                                            <p className="italic text-red-950">
                                                &ldquo;{milestone.rejectionReason}&rdquo;
                                            </p>
                                        </div>
                                    )}

                                    {/* Financial & Due Date Info */}
                                    <div className="flex items-center justify-between text-body-xs text-on-surface-variant pt-2 border-t border-border/50">
                                        <span className="font-semibold text-on-surface text-body-sm">
                                            ${milestone.amount?.toLocaleString()}
                                        </span>
                                        {milestone.dueDate && (
                                            <span className="flex items-center gap-1">
                                                <Flag size={12} /> Due: {formatDate(milestone.dueDate)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {/* 1. Freelancer: Submit / Resubmit Work */}
                                    {canFreelancerSubmit && (
                                        <div className="pt-2 border-t border-border/50 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedMilestoneForSubmit(milestone)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                                            >
                                                <Send size={13} />
                                                {mStatus === "rejected" ? "Resubmit Work" : "Submit Deliverables"}
                                            </button>
                                        </div>
                                    )}

                                    {/* 2. Client: Review Submitted Deliverables (Approve & Release or Request Changes) */}
                                    {canClientReview && (
                                        <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedMilestoneForReject(milestone)}
                                                disabled={isCurrentApproving}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer disabled:opacity-50"
                                            >
                                                <RotateCcw size={13} />
                                                Request Changes
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleApprove(milestone._id)}
                                                disabled={isCurrentApproving}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                                            >
                                                {isCurrentApproving ? (
                                                    <Loader2 size={13} className="animate-spin" />
                                                ) : (
                                                    <Check size={13} />
                                                )}
                                                Approve & Release (${milestone.amount?.toLocaleString()})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Freelancer Conversation Deletion (Allowed ONLY when contract is completed) */}
            {isFreelancer && isCompleted && onDeleteConversation && (
                <section className="card p-4! border border-border rounded-lg bg-white flex flex-col gap-2">
                    <span className="text-xs font-semibold text-on-surface">Conversation Archival</span>
                    <p className="text-body-xs text-on-surface-variant">
                        This contract is completed. You can delete this conversation from your active messages inbox.
                    </p>
                    <button
                        type="button"
                        onClick={handleDeleteConversationClick}
                        disabled={isDeletingConversation}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50 mt-1"
                    >
                        {isDeletingConversation ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Trash2 size={14} />
                        )}
                        Delete Conversation
                    </button>
                </section>
            )}

            {/* Modal: Create Milestone */}
            {isClient && onCreateMilestone && (
                <CreateMilestoneModal
                    isOpen={isMilestoneModalOpen}
                    onClose={() => setIsMilestoneModalOpen(false)}
                    contractId={contract._id}
                    contractTotalAmount={contract.totalAmount}
                    existingMilestonesTotal={totalAllocatedMilestones}
                    onCreateMilestone={onCreateMilestone}
                />
            )}

            {/* Modal: Submit Milestone Work (Freelancer) */}
            <SubmitMilestoneModal
                isOpen={Boolean(selectedMilestoneForSubmit)}
                onClose={() => setSelectedMilestoneForSubmit(null)}
                milestone={selectedMilestoneForSubmit}
                onSubmitMilestone={onSubmitMilestone}
            />

            {/* Modal: Reject Milestone / Request Revision (Client) */}
            <RejectMilestoneModal
                isOpen={Boolean(selectedMilestoneForReject)}
                onClose={() => setSelectedMilestoneForReject(null)}
                milestone={selectedMilestoneForReject}
                onRejectMilestone={onRejectMilestone}
            />
        </div>
    );
}