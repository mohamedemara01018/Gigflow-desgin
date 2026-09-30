/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from "react";
import { X, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { IMilestone, IRejectMilestoneDto } from "@/services/milestone.service";

interface RejectMilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    milestone: IMilestone | null;
    onRejectMilestone?: (id: string, payload: IRejectMilestoneDto) => Promise<void>;
}

export default function RejectMilestoneModal({
    isOpen,
    onClose,
    milestone,
    onRejectMilestone,
}: RejectMilestoneModalProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = useCallback(() => {
        setRejectionReason("");
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

        if (!milestone?._id) return;

        if (!rejectionReason.trim()) {
            setError("Please provide feedback or the reason why changes are needed.");
            return;
        }

        const payload: IRejectMilestoneDto = {
            rejectionReason: rejectionReason.trim(),
        };

        try {
            setIsSubmitting(true);
            setError(null);

            if (onRejectMilestone) {
                await onRejectMilestone(milestone._id, payload);
            }

            handleClose();
        } catch (err: any) {
            setError(err.message || "Failed to submit revision request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !milestone) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-milestone-title"
        >
            <div
                className="w-full max-w-lg bg-surface-container border border-outline-variant/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-outline-variant/60 bg-surface-container">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                            <RotateCcw size={20} />
                        </div>
                        <div>
                            <h2 id="reject-milestone-title" className="text-title-md font-semibold text-on-surface">
                                Request Revisions
                            </h2>
                            <p className="text-body-xs text-on-surface-variant">
                                Milestone #{milestone.order}: {milestone.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Info Notice */}
                <div className="p-4 bg-amber-50/80 border-b border-amber-200/60 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-body-xs text-amber-900 leading-relaxed">
                        Requesting changes will notify the freelancer to make corrections and resubmit their work before payment is released.
                    </p>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2.5 text-error text-body-sm">
                            <AlertTriangle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Rejection Reason */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-label-md font-medium text-on-surface">
                            What needs to be revised? <span className="text-error">*</span>
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Specify exactly what changes, fixes, or additions you would like the freelancer to make..."
                            rows={4}
                            className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-hidden focus:border-amber-600 transition-all resize-none"
                            required
                        />
                        <span className="text-label-xs text-on-surface-variant">
                            Clear and constructive feedback helps the freelancer resolve the issues quickly.
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant mt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-label-lg font-medium text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-amber-600 text-white rounded-xl text-label-lg font-semibold hover:bg-amber-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <RotateCcw size={16} />
                                    Send Revision Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
