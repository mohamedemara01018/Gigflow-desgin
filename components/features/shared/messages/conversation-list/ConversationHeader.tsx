"use client";

import { ConversationStatus } from "@/utils/enums.utils";
import { Search } from "lucide-react";

interface ConversationHeaderProps {
    totalUnread: number;
    query: string;
    setQuery: (query: string) => void;
    filter: string;
    setFilter: (filter: string) => void;
}

const FILTER_OPTIONS = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: ConversationStatus.ACTIVE, label: "Active" },
    { id: ConversationStatus.ARCHIVED, label: "Archived" },
];

export default function ConversationHeader({
    totalUnread,
    query,
    setQuery,
    filter,
    setFilter,
}: ConversationHeaderProps) {
    return (
        <div className="p-5 pb-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <h1 className="text-headline-md text-on-surface font-semibold">
                        Messages
                    </h1>
                    {totalUnread > 0 && (
                        <span className="text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded-full font-medium">
                            {totalUnread} Unread
                        </span>
                    )}
                </div>

            </div>

            <div className="flex items-center justify-between mt-3 bg-surface-container-low rounded-md px-3 py-2 text-body-sm text-on-surface">
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Connected • Live sync
                </span>
                <span className="text-on-surface-variant">v2.4</span>
            </div>

            <div className="relative mt-3">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search chats, clients, contracts"
                    className="w-full bg-surface-container-highest border border-outline rounded-md pl-9 pr-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {FILTER_OPTIONS.map((f) => {
                    const active = filter === f.id;
                    return (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setFilter(f.id)}
                            className={`text-label-md rounded-full px-3.5 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${active
                                ? "bg-primary text-on-primary font-medium"
                                : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                                }`}
                        >
                            {f.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}