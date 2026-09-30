/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import { X, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { ICreateContractDto } from "@/services/contract.service";
import { IProposal, proposalService } from "@/services/proposal.service";
import { conversationService, IConversation } from "@/services/conversation.service";
import { ContractType, ProposalStatus } from "@/utils/enums.utils";

interface CreateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposalId?: string;
    activeConversationId?: string;
    onCreateContract?: (payload: ICreateContractDto) => Promise<void>;
}

export default function CreateContractModal({
    isOpen,
    onClose,
    proposalId: initialProposalId,
    activeConversationId,
    onCreateContract,
}: CreateContractModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [resolvedProposalId, setResolvedProposalId] = useState<string>("");
    const [proposalData, setProposalData] = useState<IProposal | null>(null);
    const [conversationData, setConversationData] = useState<IConversation | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                setIsLoadingData(true);
                setError(null);

                let currentProposalId = initialProposalId;
                let fetchedConversation: IConversation | null = null;

                if (activeConversationId) {
                    const convRes = await conversationService.getConversationById(activeConversationId);
                    fetchedConversation = convRes.data?.conversation || convRes.data;
                    setConversationData(fetchedConversation);
                }

                // If proposalId was not provided, look for the accepted proposal for this conversation's job & freelancer
                if (!currentProposalId && fetchedConversation) {
                    const jobId =
                        typeof fetchedConversation.job === "object"
                            ? fetchedConversation.job?._id
                            : fetchedConversation.job;
                    const freelancerId =
                        typeof fetchedConversation.freelancer === "object"
                            ? fetchedConversation.freelancer?._id
                            : fetchedConversation.freelancer;

                    if (jobId && freelancerId) {
                        const proposalsRes = await proposalService.getAllProposals({
                            job: jobId,
                            freelancer: freelancerId,
                            status: ProposalStatus.ACCEPTED,
                        });
                        const proposalsList = proposalsRes.data?.proposals || [];
                        if (proposalsList.length > 0) {
                            currentProposalId = proposalsList[0]._id;
                        }
                    }
                }

                if (currentProposalId) {
                    setResolvedProposalId(currentProposalId);
                    const propRes = await proposalService.getProposalById(currentProposalId);
                    const fetchedProposal = propRes.data?.proposal || propRes.data;
                    setProposalData(fetchedProposal);

                    // If title is not yet entered, provide job title as default hint
                    const jobTitle = typeof fetchedProposal?.job === "object" ? fetchedProposal.job?.title : "";
                    if (jobTitle && !title) {
                        setTitle(jobTitle);
                    }
                }
            } catch (err: any) {
                console.error("Failed to load modal details:", err);
                setError("Failed to load required contract information. Please try again.");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [isOpen, initialProposalId, activeConversationId]);

    const handleClose = () => {
        if (isSubmitting) return;
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setError(null);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Contract title is required.");
            return;
        }

        const effectiveProposalId = resolvedProposalId || initialProposalId;
        if (!effectiveProposalId) {
            setError("No accepted proposal found to attach this contract to.");
            return;
        }

        const jobId = typeof conversationData?.job === "object"
            ? conversationData?.job?._id
            : conversationData?.job || (typeof proposalData?.job === "object" ? proposalData?.job?._id : proposalData?.job);

        const clientId = typeof conversationData?.client === "object"
            ? conversationData?.client?._id
            : conversationData?.client;

        const freelancerId = typeof conversationData?.freelancer === "object"
            ? conversationData?.freelancer?._id
            : conversationData?.freelancer || (typeof proposalData?.freelancer === "object" ? proposalData?.freelancer?._id : proposalData?.freelancer);

        const payload: ICreateContractDto = {
            job: String(jobId || ""),
            client: String(clientId || ""),
            proposal: effectiveProposalId,
            freelancer: String(freelancerId || ""),
            title: title.trim(),
            description: description.trim() ? description.trim() : (null as any),
            totalAmount: proposalData?.bidAmount ?? 0,
            type: ContractType.FIXED,
            startDate: startDate ? new Date(startDate).toISOString() : (null as any),
            endDate: endDate ? new Date(endDate).toISOString() : (null as any),
        };

        try {
            setIsSubmitting(true);
            setError(null);
            if (onCreateContract) {
                await onCreateContract(payload);
            }
            handleClose();
        } catch (err: any) {
            console.error("Contract creation error:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to create contract.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const bidAmount = proposalData?.bidAmount ?? 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/60 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/60 bg-surface-container">
                    <div>
                        <h2 className="text-title-md font-semibold text-on-surface">Create Contract</h2>
                        <p className="text-body-xs text-on-surface-variant mt-0.5">
                            Draft contract terms based on the accepted proposal.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Form */}
                <form id="create-contract-form" onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4 bg-surface-container">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-xs text-error bg-error/10 border border-error/20 rounded-lg">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-body-xs font-semibold text-on-surface">
                            Title <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Full Stack Web Application Development"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting || isLoadingData}
                            className="w-full text-body-sm p-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-surface-container-high"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-body-xs font-semibold text-on-surface">
                            Description <span className="text-on-surface-variant font-normal">(Optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Provide details about expectations, project deliverables, and milestones..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting || isLoadingData}
                            className="w-full text-body-sm p-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none disabled:bg-surface-container-high"
                        />
                    </div>

                    {/* Total Amount (Read-Only) */}
                    <div className="space-y-1.5">
                        <label className="text-body-xs font-semibold text-on-surface">
                            Total Amount
                        </label>
                        <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface">
                            <div className="flex items-center gap-2 text-on-surface font-semibold text-body-md">
                                <DollarSign size={18} className="text-primary" />
                                <span>
                                    {isLoadingData ? "Loading..." : `$${bidAmount.toLocaleString()}`}
                                </span>
                            </div>
                            <span className="text-body-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                                Fixed from Proposal
                            </span>
                        </div>
                        <p className="text-body-xs text-on-surface-variant">
                            Amount is locked to the accepted proposal bid amount.
                        </p>
                    </div>

                    {/* Start Date & End Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-body-xs font-semibold text-on-surface">
                                Start Date <span className="text-on-surface-variant font-normal">(Optional)</span>
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                disabled={isSubmitting || isLoadingData}
                                className="w-full text-body-sm p-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-surface-container-high"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-body-xs font-semibold text-on-surface">
                                End Date <span className="text-on-surface-variant font-normal">(Optional)</span>
                            </label>
                            <input
                                type="date"
                                min={startDate || undefined}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                disabled={isSubmitting || isLoadingData}
                                className="w-full text-body-sm p-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-surface-container-high"
                            />
                        </div>
                    </div>
                </form>

                {/* Modal Footer: Exactly Two Buttons (Cancel & Create) */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/60 bg-surface-container">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-body-sm font-medium border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-contract-form"
                        disabled={isSubmitting || isLoadingData || (!resolvedProposalId && !initialProposalId)}
                        className="inline-flex items-center gap-2 px-5 py-2 text-body-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <span>Create</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}