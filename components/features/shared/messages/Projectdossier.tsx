/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useState } from "react";
import {
    Calendar,
    PlusCircle,
    CheckCircle2,
    Clock,
    Flag,
    AlertCircle,
    XCircle,
    Send
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
    IRejectMilestoneDto,
} from "@/services/milestone.service";
import { IProposal, proposalService } from "@/services/proposal.service";
import { ContractStatus, ContractType, MilestoneStatus, UserRole } from "@/utils/enums.utils";

import NoContractCard from "./project-dossier/NoContractCard";
import ContractHeader from "./project-dossier/ContractHeader";
import ContractResponseAction from "./project-dossier/ContractResponseAction";
import ContractFinancialSummary from "./project-dossier/ContractFinancialSummary";
import CreateMilestoneModal from "@/components/modals/CreateMilestoneModal";
import { useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";

// Extended IContract interface in case milestones are populated dynamically
export interface IContractWithMilestones extends IContract {
    milestones?: IMilestone[];
}

interface ProjectDossierProps {
    proposal: string;
    activeConversationId: string;
    contract?: IContractWithMilestones | null;
    onCreateContract?: (payload: ICreateContractDto) => Promise<void>;
    onRespondContract?: (id: string, payload: IRespondContractDto) => Promise<void>;
    onUpdateContract?: (id: string, payload: IUpdateContractDto) => Promise<void>;
    onDeleteContract?: (id: string) => Promise<void>;
    onCreateMilestone?: (payload: ICreateMilestoneDto) => Promise<void>;
    onSubmitMilestone?: (id: string) => Promise<void>;
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
    switch (status) {
        case MilestoneStatus.APPROVED:
        case "COMPLETED":
            return {
                label: "Approved",
                colorClass: "bg-green-100 text-green-700",
                icon: <CheckCircle2 size={12} />,
            };
        case MilestoneStatus.SUBMITTED:
            return {
                label: "Submitted",
                colorClass: "bg-purple-100 text-purple-700",
                icon: <Send size={12} />,
            };
        case MilestoneStatus.IN_PROGRESS:
            return {
                label: "In Progress",
                colorClass: "bg-blue-100 text-blue-700",
                icon: <Clock size={12} />,
            };
        case MilestoneStatus.REJECTED:
            return {
                label: "Rejected",
                colorClass: "bg-red-100 text-red-700",
                icon: <XCircle size={12} />,
            };
        case MilestoneStatus.CANCELLED:
            return {
                label: "Cancelled",
                colorClass: "bg-gray-100 text-gray-700",
                icon: <XCircle size={12} />,
            };
        case MilestoneStatus.PENDING:
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
    onRespondContract,
    onUpdateContract,
    onDeleteContract,
    onCreateMilestone,
}: ProjectDossierProps) {
    const [proposalData, setProposalData] = useState<IProposal | null>(null);
    const [isLoadingProposal, setIsLoadingProposal] = useState(false);
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const { me } = useSelector(selectMeSlice);
    const isFreelancer = me?.role == UserRole.FREELANCER;
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

    const isActive = contract.status === ContractStatus.ACTIVE;
    const isPending = contract.status === ContractStatus.DRAFT;
    const isHourly = contract.type === ContractType.HOURLY || contract.type === "hourly";

    // Milestone calculation metrics
    const milestones = contract.milestones || [];
    const totalAllocatedMilestones = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
    const remainingBudget = Math.max(0, contract.totalAmount - totalAllocatedMilestones);

    const completedMilestonesCount = milestones.filter(
        (m) => m.status === MilestoneStatus.APPROVED || m.status === "COMPLETED"
    ).length;

    const progress = milestones.length > 0
        ? Math.round((completedMilestonesCount / milestones.length) * 100)
        : contract.status === ContractStatus.COMPLETED || contract.status === "completed"
            ? 100
            : 0;

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

                {isPending && onRespondContract && isFreelancer ? (
                    <ContractResponseAction
                        contractId={contract._id}
                        onRespondContract={onRespondContract}
                    />
                ) : isPending ? (
                    <div className="flex items-center gap-2.5 p-3.5 border border-amber-200 bg-amber-50/60 rounded-xl text-amber-800 text-body-sm font-medium">
                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                        <span>
                            {isFreelancer
                                ? "Waiting for client response."
                                : "Pending freelancer approval. You'll be notified once accepted or rejected."}
                        </span>
                    </div>
                ) : null}

                {(contract.startDate || contract.endDate) && (
                    <div className="flex flex-col gap-2 border-b border-border pb-3 text-body-sm">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <Calendar size={16} className="shrink-0" />
                            <span>
                                {formatDate(contract.startDate)} – {formatDate(contract.endDate)}
                            </span>
                        </div>
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
                        <p className="text-body-xs text-on-surface-variant">
                            Allocated: ${totalAllocatedMilestones.toLocaleString()} / ${contract.totalAmount.toLocaleString()} (${remainingBudget.toLocaleString()} remaining)
                        </p>
                    </div>
                    {onCreateMilestone && (
                        <button
                            onClick={() => setIsMilestoneModalOpen(true)}
                            disabled={remainingBudget <= 0}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            <PlusCircle size={14} />
                            Create Milestone
                        </button>
                    )}
                </div>

                {/* Milestone Items */}
                {milestones.length === 0 ? (
                    <div className="text-center py-6 text-on-surface-variant text-body-sm">
                        No milestones created yet.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {milestones.map((milestone, idx) => {
                            const badge = getMilestoneBadge(milestone.status);

                            return (
                                <div
                                    key={milestone._id || idx}
                                    className="p-3.5 border border-border rounded-lg bg-surface-container-lowest flex flex-col gap-2"
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
                                        <span className={`text-body-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${badge.colorClass}`}>
                                            {badge.icon}
                                            {badge.label}
                                        </span>
                                    </div>

                                    {milestone.description && (
                                        <p className="text-body-xs text-on-surface-variant">
                                            {milestone.description}
                                        </p>
                                    )}

                                    {milestone.status === MilestoneStatus.REJECTED && milestone.rejectionReason && (
                                        <div className="p-2 bg-red-50 border border-red-200 rounded text-body-xs text-red-700">
                                            <span className="font-semibold">Rejection Reason: </span>
                                            {milestone.rejectionReason}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-body-xs text-on-surface-variant pt-2 border-t border-border/50">
                                        <span className="font-semibold text-on-surface">
                                            ${milestone.amount?.toLocaleString()}
                                        </span>
                                        {milestone.dueDate && (
                                            <span className="flex items-center gap-1">
                                                <Flag size={12} /> Due: {formatDate(milestone.dueDate)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Modal Integration */}
            {onCreateMilestone && (
                <CreateMilestoneModal
                    isOpen={isMilestoneModalOpen}
                    onClose={() => setIsMilestoneModalOpen(false)}
                    contractId={contract._id}
                    contractTotalAmount={contract.totalAmount}
                    existingMilestonesTotal={totalAllocatedMilestones}
                    onCreateMilestone={onCreateMilestone}
                />
            )}
        </div>
    );
}