'use client';

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { IContract, IUpdateContractDto } from "@/services/contract.service";

interface ContractHeaderProps {
    contract: IContract;
    isActive: boolean;
    onUpdateContract?: (id: string, payload: IUpdateContractDto) => Promise<void>;
    onDeleteContract?: (id: string) => Promise<void>;
    isFreelancer: boolean
}

export default function ContractHeader({
    contract,
    isActive,
    onUpdateContract,
    onDeleteContract,
    isFreelancer
}: ContractHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editAmount, setEditAmount] = useState<number>(0);

    const handleStartEdit = () => {
        setEditTitle(contract.title);
        setEditAmount(contract.totalAmount);
        setIsEditing(true);
    };

    const handleSaveUpdate = async () => {
        if (!onUpdateContract) return;
        await onUpdateContract(contract._id, {
            title: editTitle,
            totalAmount: editAmount,
        });
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="text-label-md text-on-surface-variant tracking-wider font-semibold text-xs uppercase">
                    PROJECT DOSSIER
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-label-sm text-primary bg-primary-container px-2 py-0.5 rounded capitalize text-xs font-medium">
                        {contract.status}
                    </span>

                    {!isActive && !isFreelancer && (
                        <div className="flex items-center gap-1">
                            {onUpdateContract && !isEditing && (
                                <button
                                    onClick={handleStartEdit}
                                    title="Edit Contract"
                                    className="p-1 rounded text-gray-500 hover:text-primary hover:bg-gray-100"
                                >
                                    <Edit2 size={14} />
                                </button>
                            )}
                            {onDeleteContract && (
                                <button
                                    onClick={() => onDeleteContract(contract._id)}
                                    title="Delete Contract"
                                    className="p-1 rounded text-gray-500 hover:text-red-600 hover:bg-gray-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-md border border-border">
                    <label className="text-xs font-medium text-gray-600">Contract Title</label>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-body-sm p-1.5 border border-border rounded bg-white"
                    />
                    <label className="text-xs font-medium text-gray-600 mt-1">Total Amount ($)</label>
                    <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                        className="text-body-sm p-1.5 border border-border rounded bg-white"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-2.5 py-1 text-xs border border-border rounded text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveUpdate}
                            className="px-2.5 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 font-medium"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-1 border-b border-border pb-3">
                    <h3 className="text-title-md font-semibold text-on-surface">
                        {contract.title}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant capitalize">
                        Type: {contract.type.toString().toLowerCase()} contract
                    </p>
                </div>
            )}
        </div>
    );
}