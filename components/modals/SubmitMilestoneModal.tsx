/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from "react";
import { X, Send, Link as LinkIcon, FileText, AlertCircle, Loader2 } from "lucide-react";
import { IMilestone, ISubmitMilestoneDto } from "@/services/milestone.service";

interface SubmitMilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    milestone: IMilestone | null;
    onSubmitMilestone?: (id: string, payload: ISubmitMilestoneDto) => Promise<void>;
}

export default function SubmitMilestoneModal({
    isOpen,
    onClose,
    milestone,
    onSubmitMilestone,
}: SubmitMilestoneModalProps) {
    const [submissionNotes, setSubmissionNotes] = useState("");
    const [submissionUrl, setSubmissionUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = useCallback(() => {
        setSubmissionNotes("");
        setSubmissionUrl("");
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

        if (!submissionNotes.trim()) {
            setError("Please provide a description of the completed work or deliverables.");
            return;
        }

        if (submissionUrl.trim()) {
            try {
                new URL(submissionUrl.trim());
            } catch {
                setError("Please enter a valid URL (e.g. https://github.com/... or https://figma.com/...)");
                return;
            }
        }

        const payload: ISubmitMilestoneDto = {
            submissionNotes: submissionNotes.trim(),
            submissionUrl: submissionUrl.trim() ? submissionUrl.trim() : undefined,
        };

        try {
            setIsSubmitting(true);
            setError(null);

            if (onSubmitMilestone) {
                await onSubmitMilestone(milestone._id, payload);
            }

            handleClose();
        } catch (err: any) {
            setError(err.message || "Failed to submit milestone deliverables. Please try again.");
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
            aria-labelledby="submit-milestone-title"
        >
            <div
                className="w-full max-w-lg bg-surface-container border border-outline-variant/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-outline-variant/60 bg-surface-container">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Send size={20} />
                        </div>
                        <div>
                            <h2 id="submit-milestone-title" className="text-title-md font-semibold text-on-surface">
                                Submit Deliverables
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

                {/* Milestone Summary Header Banner */}
                <div className="bg-primary/5 px-5 py-3 border-b border-primary/10 flex items-center justify-between">
                    <div>
                        <span className="text-body-xs text-on-surface-variant">Amount to Release:</span>
                        <p className="text-body-md font-bold text-primary">
                            ${milestone.amount?.toLocaleString()}
                        </p>
                    </div>
                    {milestone.dueDate && (
                        <div className="text-right">
                            <span className="text-body-xs text-on-surface-variant">Due Date:</span>
                            <p className="text-body-xs font-semibold text-on-surface">
                                {new Date(milestone.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2.5 text-error text-body-sm">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submission Notes */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-label-md font-medium text-on-surface flex items-center gap-1.5">
                            <FileText size={15} className="text-on-surface-variant" />
                            Work Description & Notes <span className="text-error">*</span>
                        </label>
                        <textarea
                            value={submissionNotes}
                            onChange={(e) => setSubmissionNotes(e.target.value)}
                            placeholder="Describe what you completed, summary of changes, and instructions for client testing/review..."
                            rows={4}
                            className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-hidden focus:border-primary transition-all resize-none"
                            required
                        />
                        <span className="text-label-xs text-on-surface-variant">
                            Be as detailed as possible to help the client verify your deliverables.
                        </span>
                    </div>

                    {/* Deliverable Link */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-label-md font-medium text-on-surface flex items-center gap-1.5">
                            <LinkIcon size={15} className="text-on-surface-variant" />
                            Deliverable / Live Preview URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={submissionUrl}
                            onChange={(e) => setSubmissionUrl(e.target.value)}
                            placeholder="https://github.com/..., https://figma.com/..., or live site link"
                            className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-hidden focus:border-primary transition-all"
                        />
                        <span className="text-label-xs text-on-surface-variant">
                            Optional link to repository, staging environment, Google Drive, Figma, or live preview.
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
                            className="px-5 py-2 bg-primary text-on-primary rounded-xl text-label-lg font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Submit for Review
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
