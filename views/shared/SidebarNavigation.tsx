/* eslint-disable @next/next/no-img-element */
"use client";

import { MessageSquare, Menu } from "lucide-react";
import { IConversation, IUserRef } from "@/services/conversation.service";
import { UserRole } from "@/utils/enums.utils";
import { useSelector } from "react-redux";
import { selectOnlineUsers } from "@/store/slices/socketSlice";

interface SidebarNavigationProps {
    conversations: IConversation[];
    activeId: string;
    onSelect: (id: string) => void;
    currentUserId?: string;
    currentUserRole?: UserRole.CLIENT | UserRole.FREELANCER;
    onOpenFullList: () => void;
}

export default function SidebarNavigation({
    conversations,
    activeId,
    onSelect,
    currentUserId,
    currentUserRole,
    onOpenFullList,
}: SidebarNavigationProps) {
    const onlineUsers = useSelector(selectOnlineUsers);

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

    return (
        <div className="card p-2! flex flex-col items-center gap-4 h-full border-r border-border">
            <button
                onClick={onOpenFullList}
                className="p-2.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Open Conversation Drawer"
            >
                <Menu size={20} />
            </button>

            <div className="w-full h-[1px] bg-border" />

            <div className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-3 no-scrollbar">
                {conversations.map((c) => {
                    const participant = getOtherParticipant(c);
                    const participantId = participant?._id ? String(participant._id) : "";
                    const isOnline = Boolean(participantId && onlineUsers[participantId]);
                    const unread = getUnreadCount(c);
                    const isActive = c._id === activeId;

                    return (
                        <button
                            key={c._id}
                            onClick={() => onSelect(c._id)}
                            className={`relative p-1.5 rounded-full transition-all ${isActive ? "ring-2 ring-primary" : "hover:bg-surface-container"
                                }`}
                            title={participant ? `${participant.firstName} ${participant.lastName} (${isOnline ? "Online" : "Offline"})` : "Chat"}
                        >
                            <div className="relative">
                                {participant?.avatar ? (
                                    <img
                                        src={participant.avatar}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                                        <MessageSquare size={18} />
                                    </div>
                                )}
                                <span
                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                        isOnline ? "bg-green-500 shadow-xs shadow-green-500/50" : "bg-gray-300"
                                    }`}
                                    title={isOnline ? "Online" : "Offline"}
                                />
                            </div>

                            {unread > 0 && (
                                <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">
                                    {unread > 9 ? "9+" : unread}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}