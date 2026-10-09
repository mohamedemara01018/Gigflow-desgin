/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { conversationService } from "@/services/conversation.service";

interface MessagesNavLinkProps {
    userId?: string;
    href: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}

export default function MessagesNavLink({
    userId,
    href,
    label,
    isActive,
    onClick,
}: MessagesNavLinkProps) {
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const fetchUnreadMessagesCount = useCallback(async () => {
        if (!userId) return;

        try {
            const res = await conversationService.getUserConversations(userId, {
                limit: 50,
            });

            if (res.data?.conversations) {
                // Sum unread messages across all active conversations based on participant role
                const totalUnread = res.data.conversations.reduce((acc, conv) => {
                    const isClient = conv.client?._id === userId;
                    const count = isClient
                        ? conv.clientUnreadCount || 0
                        : conv.freelancerUnreadCount || 0;
                    return acc + count;
                }, 0);

                setUnreadCount(totalUnread);
            }
        } catch {
            // Non-blocking error: keep count at 0 if fetch fails
        }
    }, [userId]);

    useEffect(() => {
        fetchUnreadMessagesCount();

        // Optional polling interval to keep badge updated in real-time
        const interval = setInterval(fetchUnreadMessagesCount, 15000);
        return () => clearInterval(interval);
    }, [fetchUnreadMessagesCount]);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative flex items-center gap-1.5 text-body-md font-medium transition-colors duration-200 ${isActive
                    ? "text-primary font-semibold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
        >
            <span>{label}</span>

            {/* Unread Message Counter Badge */}
            {unreadCount > 0 && (
                <span className="flex items-center justify-center bg-primary text-on-primary text-[10px] font-bold h-4 min-w-4 px-1 rounded-full animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </Link>
    );
}