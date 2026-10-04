'use client';

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { ContactSupportStatus } from "@/utils/enums.utils";
import { STATUS_LABELS, statusBadgeClass } from "./support.types";

interface StatusDropdownProps {
    ticketId: string;
    currentStatus: ContactSupportStatus | string;
    onStatusChange: (id: string, newStatus: ContactSupportStatus) => Promise<void>;
}

export function StatusDropdown({ ticketId, currentStatus, onStatusChange }: StatusDropdownProps) {
    const [updating, setUpdating] = useState(false);

    const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextStatus = e.target.value as ContactSupportStatus;
        if (nextStatus === currentStatus) return;
        setUpdating(true);
        try {
            await onStatusChange(ticketId, nextStatus);
        } finally {
            setUpdating(false);
        }
    };

    const statusKey = (currentStatus as ContactSupportStatus) in STATUS_LABELS
        ? (currentStatus as ContactSupportStatus)
        : ContactSupportStatus.NEW;

    return (
        <div className="relative inline-flex items-center">
            {updating ? (
                <div className="flex items-center gap-1.5 text-label-sm rounded-full px-2.5 py-1 bg-surface-container-high text-on-surface-variant">
                    <Loader2 size={12} className="animate-spin" />
                    Updating...
                </div>
            ) : (
                <div className="relative">
                    <select
                        value={statusKey}
                        onChange={handleSelect}
                        className={`appearance-none text-label-sm font-medium rounded-full pl-3 pr-7 py-1 cursor-pointer outline-none border border-transparent hover:border-outline-variant transition-colors ${statusBadgeClass[statusKey]}`}
                    >
                        {Object.values(ContactSupportStatus).map((st) => (
                            <option key={st} value={st} className="bg-surface-container-lowest text-on-surface">
                                {STATUS_LABELS[st]}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
                </div>
            )}
        </div>
    );
}