"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { NotificationType } from "@/utils/enums.utils";
import { notificationService, INotification } from "@/services/notification.service";
import { socket } from "@/utils/socket";

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [toastNotification, setToastNotification] = useState<INotification | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Fetch unread count
    const fetchInitialCount = useCallback(async () => {
        try {
            const response = await notificationService.getUnreadCount();
            setUnreadCount(response?.data?.unreadCount || 0);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    }, []);

    // 2. Display popover toast under the bell for 2 seconds
    const triggerToast = useCallback((notificationData?: INotification) => {
        if (notificationData) {
            setToastNotification(notificationData);
        } else {
            // Fallback preview if socket payload doesn't include notification details
            setToastNotification({
                title: "New Notification",
                message: "You have received a new notification.",
            } as INotification);
        }

        // Clear existing timer if another notification arrives quickly
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Auto hide after 2000ms (2 seconds)
        timerRef.current = setTimeout(() => {
            setToastNotification(null);
        }, 5000);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchInitialCount();

        const notificationTypes = Object.values(NotificationType);

        // Socket listener callback
        const handleIncomingNotification = (payload?: INotification) => {
            fetchInitialCount();
            triggerToast(payload);
        };

        // Attach listeners for all notification types
        notificationTypes.forEach((type) => {
            socket.on(type, handleIncomingNotification);
        });

        // Cleanup socket listeners & timers on unmount
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            notificationTypes.forEach((type) => {
                socket.off(type, handleIncomingNotification);
            });
        };
    }, [fetchInitialCount, triggerToast]);

    const formattedCount = unreadCount > 99 ? "99+" : unreadCount;

    return (
        <div className="relative inline-block">
            <Link
                href="/notification"
                className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg relative inline-flex items-center justify-center"
                aria-label="Notifications"
            >
                <Bell size={22} />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                        {formattedCount}
                    </span>
                )}
            </Link>

            {/* Notification Toast Popover under the Bell (Appears for 2 seconds) */}
            {toastNotification && (
                <div className="absolute right-0 mt-2 w-72 z-50 rounded-lg bg-surface p-3 shadow-xl border border-border animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
                    <p className="text-xs font-semibold text-primary truncate">
                        {toastNotification.title}
                    </p>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                        {toastNotification.message}
                    </p>
                </div>
            )}
        </div>
    );
}