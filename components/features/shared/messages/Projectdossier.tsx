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
    Loader2
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
}: ProjectDossierProps) {
    const [proposalData, setProposalData] = useState<IProposal | null>(null);
    const [isLoadingProposal, setIsLoadingProposal] = useState(false);
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [isSendingToFreelancer, setIsSendingToFreelancer] = useState(false);

    // Submission and Rejection modal states
    const [selectedMilestoneForSubmit, setSelectedMilestoneForSubmit] = useState<IMilestone | null>(null);
    const [selectedMilestoneForReject, setSelectedMilestoneForReject] = useState<IMilestone | null>(null);
    const [approvingMilestoneId, setApprovingMilestoneId] = useState<string | null>(null);

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
        : contract.status === ContractStatus.COMPLETED || contract.status === "completed"
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
                {isDraft && isFreelancer && onRespondContract ? (
                    <ContractResponseAction
                        contractId={contract._id}
                        onRespondContract={onRespondContract}
                    />
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
                                        : "Ready for review"}
                            </span>
                        </div>
                        <p className="text-body-xs text-amber-800">
                            Create deliverables/milestones below, then send the contract to the freelancer for review.
                        </p>
                        {onSendContract && (
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