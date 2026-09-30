/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { IConversation, IUserRef, IJobRef, IUpdateUserSettingsDto } from "@/services/conversation.service";
import { UserRole } from "@/utils/enums.utils";

import ConversationHeader from "./conversation-list/ConversationHeader";
import ConversationItem from "./conversation-list/ConversationItem";
import ConversationFooter from "./conversation-list/ConversationFooter";

interface ConversationListProps {
    conversations: IConversation[];
    activeId: string;
    onSelect: (id: string) => void;
    currentUserId?: string;
    currentUserRole?: UserRole.CLIENT | UserRole.FREELANCER;
    onUpdateSettings?: (
        conversationId: string,
        settings: Partial<Omit<IUpdateUserSettingsDto, "role">>
    ) => Promise<void>;
    onClose?: () => void;
}

export default function ConversationList({
    conversations,
    activeId,
    onSelect,
    currentUserId,
    currentUserRole,
    onUpdateSettings,
    onClose,
}: ConversationListProps) {
    const [filter, setFilter] = useState("all");
    const [query, setQuery] = useState("");

    const getOtherParticipant = (c: IConversation): IUserRef | null => {
        if (currentUserRole === UserRole.CLIENT) {
            return typeof c.freelancer === "object" ? (c.freelancer as IUserRef) : null;
        }
        if (currentUserRole === UserRole.FREELANCER) {
            return typeof c.client === "object" ? (c.client as IUserRef) : null;
        }
        if (typeof c.client === "object" && c.client._id !== currentUserId) {
            return c.client as IUserRef;
        }
        if (typeof c.freelancer === "object" && c.freelancer._id !== currentUserId) {
            return c.freelancer as IUserRef;
        }
        return null;
    };

    const getUnreadCount = (c: IConversation): number => {
        if (currentUserRole === UserRole.CLIENT) return c.clientUnreadCount || 0;
        if (currentUserRole === UserRole.FREELANCER) return c.freelancerUnreadCount || 0;
        return 0;
    };

    const isPinned = (c: IConversation): boolean => {
        if (currentUserRole === UserRole.CLIENT) return Boolean(c.clientPinned);
        if (currentUserRole === UserRole.FREELANCER) return Boolean(c.freelancerPinned);
        return false;
    };

    const isMuted = (c: IConversation): boolean => {
        if (currentUserRole === UserRole.CLIENT) return Boolean(c.clientMuted);
        if (currentUserRole === UserRole.FREELANCER) return Boolean(c.freelancerMuted);
        return false;
    };

    const isArchived = (c: IConversation): boolean => {
        if (currentUserRole === UserRole.CLIENT) return Boolean(c.clientArchived);
        if (currentUserRole === UserRole.FREELANCER) return Boolean(c.freelancerArchived);
        return false;
    };

    const totalUnread = useMemo(() => {
        return conversations.reduce((acc, c) => acc + getUnreadCount(c), 0);
    }, [conversations, currentUserRole]);

    const visible = useMemo(() => {
        return conversations.filter((c) => {
            const unread = getUnreadCount(c);
            const archived = isArchived(c);

            if (archived && filter !== "archived") return false;

            const matchesFilter =
                filter === "all" ||
                (filter === "unread" && unread > 0) ||
                (filter === "active" && c.status === "active") ||
                (filter === "archived" && archived);

            const q = query.trim().toLowerCase();
            const participant = getOtherParticipant(c);
            const participantName = participant
                ? `${participant.firstName} ${participant.lastName}`.toLowerCase()
                : "";
            const jobTitle =
                typeof c.job === "object" && c.job?.title
                    ? (c.job as IJobRef).title.toLowerCase()
                    : "";

            const matchesQuery =
                !q || participantName.includes(q) || jobTitle.includes(q);

            return matchesFilter && matchesQuery;
        });
    }, [conversations, filter, query, currentUserRole, currentUserId]);

    return (
        <section className="card p-0! flex flex-col h-full overflow-hidden">
            {onClose && (
                <div className="flex items-center justify-between p-3 border-b border-border xl:hidden">
                    <span className="font-medium text-body-md">Conversations</span>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <ConversationHeader
                totalUnread={totalUnread}
                query={query}
                setQuery={setQuery}
                filter={filter}
                setFilter={setFilter}
            />

            <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-1">
                {visible.map((c) => (
                    <ConversationItem
                        key={c._id}
                        conversation={c}
                        active={c._id === activeId}
                        participant={getOtherParticipant(c)}
                        unread={getUnreadCount(c)}
                        pinned={isPinned(c)}
                        muted={isMuted(c)}
                        archived={isArchived(c)}
                        onSelect={onSelect}
                        onUpdateSettings={onUpdateSettings}
                    />
                ))}

                {visible.length === 0 && (
                    <p className="text-body-sm text-on-surface-variant text-center py-10">
                        No conversations found.
                    </p>
                )}
            </div>

            <ConversationFooter />
        </section>
    );
}