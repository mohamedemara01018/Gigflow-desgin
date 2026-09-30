'use client';

import { useState } from "react";
import { Check, X } from "lucide-react";
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
    const { me } = useSelector(selectMeSlice)
    const handleAccept = async () => {
        await onRespondContract(contractId, { action: "accept", userId: String(me?._id) });
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) return;
        await onRespondContract(contractId, {
            action: "reject",
            userId: String(me?._id),
            rejectionReason,
        });
        setShowRejectInput(false);
        setRejectionReason("");
    };

    return (
        <div className="flex flex-col gap-2 p-3 bg-amber-50/50 border border-amber-200 rounded-md">
            <p className="text-xs text-amber-800 font-medium">Contract Response Pending</p>
            {!showRejectInput ? (
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAccept}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
                    >
                        <Check size={14} /> Accept
                    </button>
                    <button
                        onClick={() => setShowRejectInput(true)}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 border border-red-300 text-red-600 rounded text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                        <X size={14} /> Reject
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="text-xs p-1.5 border border-red-200 rounded bg-white"
                    />
                    <div className="flex justify-end gap-1.5">
                        <button
                            onClick={() => setShowRejectInput(false)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={!rejectionReason.trim()}
                            className="px-2 py-0.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            Confirm Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}