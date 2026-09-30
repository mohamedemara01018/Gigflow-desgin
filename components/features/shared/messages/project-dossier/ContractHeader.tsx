'use client';

import { useState } from "react";
import { Edit2, Trash2, Calendar, DollarSign, Check, X } from "lucide-react";
import { IContract, IUpdateContractDto } from "@/services/contract.service";
import { ContractStatus } from "@/utils/enums.utils";

interface ContractHeaderProps {
    contract: IContract;
    isActive: boolean;
    onUpdateContract?: (id: string, payload: IUpdateContractDto) => Promise<void>;
    onDeleteContract?: (id: string) => Promise<void>;
    isFreelancer: boolean;
}

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export default function ContractHeader({
    contract,
    isActive,
    onUpdateContract,
    onDeleteContract,
    isFreelancer,
}: ContractHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");

    const isDraft = contract.status === ContractStatus.DRAFT || (contract.status as string) === "draft";
    const isRejected = contract.status === ContractStatus.REJECTED || (contract.status as string) === "rejected";
    const isEditable = (isDraft || isRejected) && !isFreelancer;

    const handleStartEdit = () => {
        setEditTitle(contract.title || "");
        setEditDescription(contract.description || "");
        setEditStartDate(
            contract.startDate ? new Date(contract.startDate).toISOString().split("T")[0] : ""
        );
        setEditEndDate(
            contract.endDate ? new Date(contract.endDate).toISOString().split("T")[0] : ""
        );
        setIsEditing(true);
    };

    const handleSaveUpdate = async () => {
        if (!onUpdateContract || !editTitle.trim()) return;
        await onUpdateContract(contract._id, {
            title: editTitle.trim(),
            description: editDescription.trim() || undefined,
            startDate: editStartDate ? new Date(editStartDate).toISOString() : undefined,
            endDate: editEndDate ? new Date(editEndDate).toISOString() : undefined,
        });
        setIsEditing(false);
    };

    const getStatusBadge = () => {
        const s = (contract.status || "").toLowerCase();
        if (s === "active") {
            return "bg-green-100 text-green-700 border-green-200";
        }
        if (s === "draft") {
            return "bg-amber-100 text-amber-800 border-amber-200";
        }
        if (s === "rejected") {
            return "bg-red-100 text-red-700 border-red-200";
        }
        if (s === "completed") {
            return "bg-blue-100 text-blue-700 border-blue-200";
        }
        return "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="text-label-md text-on-surface-variant tracking-wider font-semibold text-xs uppercase">
                    CONTRACT
                </p>
                <div className="flex items-center gap-2">
                    <span
                        className={`text-label-sm border px-2.5 py-0.5 rounded-full capitalize text-xs font-semibold ${getStatusBadge()}`}
                    >
                        {contract.status}
                    </span>

                    {isEditable && (
                        <div className="flex items-center gap-1">
                            {onUpdateContract && !isEditing && (
                                <button
                                    onClick={handleStartEdit}
                                    title="Edit Contract Details"
                                    className="p-1 rounded text-gray-500 hover:text-primary hover:bg-gray-100 cursor-pointer"
                                >
                                    <Edit2 size={14} />
                                </button>
                            )}
                            {onDeleteContract && (
                                <button
                                    onClick={() => onDeleteContract(contract._id)}
                                    title="Delete Contract"
                                    className="p-1 rounded text-gray-500 hover:text-red-600 hover:bg-gray-100 cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="flex flex-col gap-3 p-3.5 bg-gray-50 rounded-lg border border-border">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-700">
                            Contract Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="text-body-sm p-2 border border-border rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-700">Description</label>
                        <textarea
                            rows={3}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="text-body-sm p-2 border border-border rounded-md bg-white resize-none focus:outline-hidden focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">Start Date</label>
                            <input
                                type="date"
                                value={editStartDate}
                                onChange={(e) => setEditStartDate(e.target.value)}
                                className="text-body-sm p-1.5 border border-border rounded-md bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">End Date</label>
                            <input
                                type="date"
                                value={editEndDate}
                                onChange={(e) => setEditEndDate(e.target.value)}
                                className="text-body-sm p-1.5 border border-border rounded-md bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-1">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-border rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                            <X size={13} /> Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveUpdate}
                            disabled={!editTitle.trim()}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 font-semibold cursor-pointer disabled:opacity-50"
                        >
                            <Check size={13} /> Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2 border-b border-border pb-3">
                    <div>
                        <h3 className="text-title-md font-semibold text-on-surface">
                            {contract.title}
                        </h3>
                        {contract.description && (
                            <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-3">
                                {contract.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-body-xs text-on-surface-variant pt-1">
                        <div className="flex items-center gap-1 font-medium text-on-surface">
                            <DollarSign size={14} className="text-primary shrink-0" />
                            <span>Total: ${contract.totalAmount?.toLocaleString()}</span>
                        </div>

                        {(contract.startDate || contract.endDate) && (
                            <div className="flex items-center gap-1">
                                <Calendar size={13} className="shrink-0" />
                                <span>
                                    {formatDate(contract.startDate) || "Start"} &ndash;{" "}
                                    {formatDate(contract.endDate) || "End"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}