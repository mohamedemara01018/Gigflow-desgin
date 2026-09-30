/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import { X, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { ICreateContractDto } from "@/services/contract.service";
import { IProposal, proposalService } from "@/services/proposal.service";
import { conversationService, IConversation } from "@/services/conversation.service";
import { ContractType } from "@/utils/enums.utils";

interface CreateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposalId: string;
    activeConversationId: string;
    onCreateContract?: (payload: ICreateContractDto) => Promise<void>;
}

export default function CreateContractModal({
    isOpen,
    onClose,
    proposalId,
    activeConversationId,
    onCreateContract,
}: CreateContractModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalAmount, setTotalAmount] = useState<number>(0);

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

                const [propRes, convRes] = await Promise.all([
                    proposalId ? proposalService.getProposalById(proposalId) : null,
                    activeConversationId ? conversationService.getConversationById(activeConversationId) : null,
                ]);

                if (propRes) {
                    const fetchedProposal = propRes.data?.proposal || propRes.data;
                    setProposalData(fetchedProposal);
                    setTotalAmount(fetchedProposal?.bidAmount ?? 0);
                }
                if (convRes) {
                    setConversationData(convRes.data?.conversation || convRes.data);
                }
            } catch (err: any) {
                console.error("Failed to load modal details:", err);
                setError("Failed to load required contract information. Please try again.");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [isOpen, proposalId, activeConversationId]);

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setTotalAmount(0);
        setError(null);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Contract title is required.");
            return;
        }

        const jobId = typeof conversationData?.job === "object"
            ? conversationData?.job?._id
            : conversationData?.job;

        const clientId = typeof conversationData?.client === "object"
            ? conversationData?.client?._id
            : conversationData?.client;

        const freelancerId = typeof conversationData?.freelancer === "object"
            ? conversationData?.freelancer?._id
            : conversationData?.freelancer;

        const payload: ICreateContractDto = {
            job: String(jobId || ""),
            client: String(clientId || ""),
            proposal: proposalId || "",
            freelancer: String(freelancerId || ""),
            title: title.trim(),
            description: description.trim() || undefined,
            totalAmount: totalAmount,
            type: ContractType.FIXED,
            startDate: startDate ? new Date(startDate).toISOString() : undefined,
            endDate: endDate ? new Date(endDate).toISOString() : undefined,
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

    return (
        <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-surface-container rounded-xl shadow-xl border border-border w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <h2 className="text-title-md font-semibold text-on-surface">Create Draft Contract</h2>
                        <p className="text-body-xs text-on-surface-variant mt-0.5">
                            Set contract details and total amount.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Form */}
                <form id="create-contract-form" onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-body-xs font-semibold text-on-surface">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Full Stack Development Contract"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting || isLoadingData}
                            className="w-full text-body-sm p-2.5 border border-border rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-gray-50"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-body-xs font-semibold text-on-surface">
                            Description <span className="text-on-surface-variant font-normal">(Optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Provide details about terms, expectations, or deliverables..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting || isLoadingData}
                            className="w-full text-body-sm p-2.5 border border-border rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none disabled:bg-gray-50"
                        />
                    </div>

                    {/* Total Amount */}
                    <div className="space-y-1.5">
                        <label className="text-body-xs font-semibold text-on-surface">
                            Total Amount
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3 text-gray-500">
                                <DollarSign size={16} />
                            </span>
                            <input
                                type="number"
                                value={isLoadingData ? "" : totalAmount}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setTotalAmount(isNaN(val) ? 0 : val);
                                }}
                                className="w-full text-body-sm pl-8 pr-3 py-2.5 border border-border rounded-lg bg-white text-on-surface font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-gray-50"
                                min={1}
                                step={1}
                                placeholder={isLoadingData ? "Loading..." : "0.00"}
                                disabled={isLoadingData || isSubmitting}
                            />
                        </div>
                        <p className="text-body-xs text-on-surface-variant">
                            Initial value loaded from the accepted proposal bid amount.
                        </p>
                    </div>

                    {/* Dates */}
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
                                className="w-full text-body-sm p-2.5 border border-border rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-gray-50"
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
                                className="w-full text-body-sm p-2.5 border border-border rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface-container-lowest">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-body-sm font-medium border border-border rounded-lg text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-contract-form"
                        disabled={isSubmitting || isLoadingData}
                        className="inline-flex items-center gap-2 px-4 py-2 text-body-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
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