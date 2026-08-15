"use client";

import { VerificationStatus } from "@/utils/enums.utils";

export const TABS: { id: VerificationStatus; label: string }[] = [
    { id: VerificationStatus.PENDING, label: "Pending" },
    { id: VerificationStatus.IN_REVIEW, label: "In Review" },
    { id: VerificationStatus.APPROVED, label: "Approved" },
    { id: VerificationStatus.REJECTED, label: "Rejected" },
    { id: VerificationStatus.CANCELLED, label: "cancelled" },
];

interface VerificationTabsProps {
    activeTab: VerificationStatus;
    tabCounts: Record<VerificationStatus, number>;
    onTabChange: (status: VerificationStatus) => void;
}

export default function VerificationTabs({
    activeTab,
    tabCounts,
    onTabChange,
}: VerificationTabsProps) {
    return (
        <div className="flex items-center gap-2 p-4 border-b border-outline-variant flex-wrap">
            {TABS.map(({ id, label }) => {
                const isActive = activeTab === id;
                return (
                    <button
                        key={id}
                        onClick={() => onTabChange(id)}
                        className={`flex items-center gap-2 pl-4 pr-3.5 py-2 rounded-full text-body-sm font-medium transition-colors ${isActive
                                ? "bg-primary-container text-white"
                                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                            }`}
                    >
                        {label}
                        {tabCounts[id] > 0 && (
                            <span
                                className={`text-label-sm px-2 py-0.5 rounded-full ${isActive
                                        ? "bg-surface-container-lowest text-on-surface"
                                        : "bg-surface-container-lowest text-on-surface-variant"
                                    }`}
                            >
                                {tabCounts[id]}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}