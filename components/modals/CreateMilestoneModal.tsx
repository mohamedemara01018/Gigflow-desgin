/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from "react";
import { X, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { ICreateMilestoneDto } from "@/services/milestone.service";

interface CreateMilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    contractId: string;
    contractTotalAmount: number;
    existingMilestonesTotal: number;
    onCreateMilestone?: (payload: ICreateMilestoneDto) => Promise<void>;
}

export default function CreateMilestoneModal({
    isOpen,
    onClose,
    contractId,
    contractTotalAmount,
    existingMilestonesTotal,
    onCreateMilestone,
}: CreateMilestoneModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<string>("");
    const [dueDate, setDueDate] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate remaining budget
    const remainingBudget = Math.max(0, Math.round((contractTotalAmount - existingMilestonesTotal) * 100) / 100);

    const resetForm = useCallback(() => {
        setTitle("");
        setDescription("");
        setAmount("");
        setDueDate("");
        setError(null);
    }, []);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        resetForm();
        onClose();
    }, [isSubmitting, resetForm, onClose]);

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                handleClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Milestone title is required.");
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount greater than 0.");
            return;
        }

        if (Math.round(numAmount * 100) > Math.round(remainingBudget * 100)) {
            setError(
                `Milestone amount ($${numAmount.toLocaleString()}) exceeds the remaining contract budget ($${remainingBudget.toLocaleString()}).`
            );
            return;
        }

        let isoDueDate: string | undefined = undefined;
        if (dueDate) {
            const [year, month, day] = dueDate.split("-").map(Number);
            isoDueDate = new Date(Date.UTC(year, month - 1, day)).toISOString();
        }

        const payload: ICreateMilestoneDto = {
            contract: contractId,
            title: title.trim(),
            description: description.trim() ? description.trim() : undefined,
            amount: Math.round(numAmount * 100) / 100,
            dueDate: isoDueDate,
        };

        try {
            setIsSubmitting(true);
            setError(null);
            if (onCreateMilestone) {
                await onCreateMilestone(payload);
            }
            handleClose();
        } catch (err: any) {
            console.error("Milestone creation error:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to create milestone.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={handleClose}
        >
            <div
                className="bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/60 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/60 bg-surface-container">
                    <div>
                        <h2 className="text-title-md font-semibold text-on-surface">Create Milestone</h2>
                        <p className="text-body-xs text-on-surface-variant mt-0.5">
                            Divide the contract into deliverable stages.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Financial Summary */}
                <div className="bg-surface-container-high/60 px-6 py-3 border-b border-outline-variant/60 grid grid-cols-3 text-center gap-2">
                    <div>
                        <p className="text-body-xs text-on-surface-variant">Contract Total</p>
                        <p className="text-body-sm font-semibold text-on-surface">${contractTotalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-body-xs text-on-surface-variant">Allocated</p>
                        <p className="text-body-sm font-semibold text-primary">${existingMilestonesTotal.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-body-xs text-on-surface-variant">Remaining</p>
                        <p className={`text-body-sm font-semibold ${remainingBudget > 0 ? "text-green-600" : "text-amber-600"}`}>
                            ${remainingBudget.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Modal Form */}
                <form id="create-milestone-form" onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4 bg-surface-container">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-xs text-error bg-error/10 border border-error/20 rounded-lg">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Title Input */}
                    <div className="space-y-1.5">
                        <label className="text-body-xs font-semibold text-on-surface">
                            Title <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Phase 1: Database Architecture & Core APIs"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full text-body-sm p-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-surface-container-high"
                        />
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-1.5">
                        <label className="text-body-xs font-semibold text-on-surface">
                            Description <span className="text-on-surface-variant font-normal">(Optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Describe deliverables and completion criteria for this milestone..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full text-body-sm p-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none disabled:bg-surface-container-high"
                        />
                    </div>

                    {/* Amount & Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-body-xs font-semibold text-on-surface">
                                Amount ($) <span className="text-error">*</span>
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-on-surface-variant">
                                    <DollarSign size={16} />
                                </span>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    max={remainingBudget}
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full text-body-sm pl-8 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-surface-container-high"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-body-xs font-semibold text-on-surface">
                                Due Date <span className="text-on-surface-variant font-normal">(Optional)</span>
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                disabled={isSubmitting}
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
                        form="create-milestone-form"
                        disabled={isSubmitting || remainingBudget <= 0}
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