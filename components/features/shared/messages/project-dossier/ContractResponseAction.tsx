'use client';

import { useState } from "react";
import { Check, X, AlertCircle, Loader2 } from "lucide-react";
import { IRespondContractDto } from "@/services/contract.service";
import { useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";

interface ContractResponseActionProps {
    contractId: string;
    onRespondContract: (id: string, payload: IRespondContractDto) => Promise<void>;
}

export default function ContractResponseAction({
    contractId,
    onRespondContract,
}: ContractResponseActionProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { me } = useSelector(selectMeSlice);

    const handleAccept = async () => {
        try {
            setIsSubmitting(true);
            setError(null);
            await onRespondContract(contractId, {
                action: "accept",
                userId: String(me?._id),
            });
        } catch (err: any) {
            setError(err?.message || "Failed to accept contract");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            setError("A rejection reason is required.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            await onRespondContract(contractId, {
                action: "reject",
                userId: String(me?._id),
                rejectionReason: rejectionReason.trim(),
            });
            setShowRejectInput(false);
            setRejectionReason("");
        } catch (err: any) {
            setError(err?.message || "Failed to reject contract");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2.5 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between">
                <span className="text-xs text-amber-900 font-bold uppercase tracking-wider">
                    Contract Review Pending
                </span>
                <span className="text-body-xs text-amber-700">
                    Review terms &amp; milestones
                </span>
            </div>

            {error && (
                <div className="flex items-center gap-1.5 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-body-xs">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!showRejectInput ? (
                <div className="flex items-center gap-2 pt-1">
                    <button
                        type="button"
                        onClick={handleAccept}
                        disabled={isSubmitting}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Check size={14} />
                        )}
                        Accept Contract
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowRejectInput(true)}
                        disabled={isSubmitting}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-red-300 bg-white text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <X size={14} /> Reject Contract
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-2 pt-1">
                    <label className="text-xs font-semibold text-gray-700">
                        Reason for Rejection <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Explain why you are declining (e.g., timeline, scope adjustments)..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        disabled={isSubmitting}
                        className="text-body-sm p-2 border border-red-200 rounded-md bg-white resize-none focus:outline-hidden focus:ring-1 focus:ring-red-400"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowRejectInput(false);
                                setError(null);
                            }}
                            disabled={isSubmitting}
                            className="px-3 py-1 text-xs text-gray-600 border border-border rounded-md hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={!rejectionReason.trim() || isSubmitting}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}