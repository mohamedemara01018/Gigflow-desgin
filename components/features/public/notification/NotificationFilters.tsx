"use client";

import { ChevronDown, Search } from "lucide-react";
import { NotificationEntityType } from "@/utils/enums.utils";

export interface ITabOption {
    id: string;
    label: string;
    type?: NotificationEntityType;
}

export const TABS: ITabOption[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    // { id: "proposals", label: "Proposals", type: NotificationEntityType.PROPOSAL },
    // { id: "contracts", label: "Contracts & Milestones", type: NotificationEntityType.CONTRACT },
    // { id: "payments", label: "Payments & Escrow", type: NotificationEntityType.PAYMENT },
];

interface NotificationFiltersProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    unreadCount: number;
    query: string;
    onQueryChange: (query: string) => void;
    sortOrder: "newest" | "oldest";
    onSortChange: (sort: "newest" | "oldest") => void;
}

export default function NotificationFilters({
    activeTab,
    onTabChange,
    unreadCount,
    query,
    onQueryChange,
    sortOrder,
    onSortChange,
}: NotificationFiltersProps) {
    return (
        <>
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap border-b border-outline-variant pb-4">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-1.5 text-body-sm px-4 py-2 rounded-full transition-colors font-medium ${isActive
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                                }`}
                        >
                            {tab.label}
                            {tab.id === "unread" && unreadCount > 0 && (
                                <span
                                    className={`text-label-sm px-2 py-0.5 rounded-full ${isActive
                                        ? "bg-on-primary/20 text-on-primary"
                                        : "bg-primary/20 text-primary"
                                        }`}
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search Bar & Order Filter */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
                <div className="relative flex-1 min-w-55">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search notifications..."
                        className="w-full bg-surface-container-low rounded-md pl-9 pr-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
                <div className="relative">
                    <select
                        value={sortOrder}
                        onChange={(e) => onSortChange(e.target.value as "newest" | "oldest")}
                        className="appearance-none bg-surface-container-low rounded-md pl-3 pr-8 py-2.5 text-body-sm text-on-surface outline-none cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                    <ChevronDown
                        size={14}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                    />
                </div>
            </div>
        </>
    );
}