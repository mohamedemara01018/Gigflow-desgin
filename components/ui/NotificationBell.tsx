/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2, X } from "lucide-react";
import { NotificationType } from "@/utils/enums.utils";
import { notificationService, INotification } from "@/services/notification.service";
import { socket } from "@/utils/socket";
import UserImage from "@/components/ui/UserImage";

export default function NotificationBell() {
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Popup toast state for incoming real-time notifications
    const [toastNotification, setToastNotification] = useState<INotification | null>(null);

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Fetch unread notification count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await notificationService.getUnreadCount();
            setUnreadCount(response?.data?.unreadCount || 0);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    }, []);

    // 2. Fetch recent notifications when dropdown opens
    const fetchRecentNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await notificationService.getMyNotifications({ page: 1, limit: 5 });
            setNotifications(response?.data?.notifications || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        if (!isOpen) {
            fetchRecentNotifications();
            // Hide toast when user explicitly opens the notification panel
            setToastNotification(null);
        }
        setIsOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Helper to display floating popup toast
    const triggerToast = useCallback((notificationData: INotification) => {
        setToastNotification(notificationData);

        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }

        // Auto hide popup after 5 seconds
        toastTimerRef.current = setTimeout(() => {
            setToastNotification(null);
        }, 5000);
    }, []);

    // 3. Attach Socket listeners for real-time notifications
    useEffect(() => {
        fetchUnreadCount();

        const notificationTypes = Object.values(NotificationType);

        const handleIncomingNotification = (payload?: INotification) => {
            fetchUnreadCount();

            if (payload) {
                // Update dropdown list live
                setNotifications((prev) => [payload, ...prev.slice(0, 4)]);
                // Display real-time popup toast
                triggerToast(payload);
            } else {
                fetchRecentNotifications();
            }
        };

        notificationTypes.forEach((type) => {
            socket.on(type, handleIncomingNotification);
        });

        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
            notificationTypes.forEach((type) => {
                socket.off(type, handleIncomingNotification);
            });
        };
    }, [fetchUnreadCount, fetchRecentNotifications, triggerToast]);

    // Handle click on notification (marks read and navigates)
    const handleNotificationClick = async (notification: INotification) => {
        setIsOpen(false);
        setToastNotification(null);

        if (!notification.isRead) {
            try {
                await notificationService.markAsRead(notification._id);
                setUnreadCount((prev) => Math.max(0, prev - 1));
                setNotifications((prev) =>
                    prev.map((item) =>
                        item._id === notification._id ? { ...item, isRead: true } : item
                    )
                );
            } catch (error) {
                console.error("Failed to mark notification as read:", error);
            }
        }

        if (notification.link) {
            router.push(notification.link);
        }
    };

    // Mark all loaded notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setUnreadCount(0);
            setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const formattedCount = unreadCount > 99 ? "99+" : unreadCount;

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Bell Icon Trigger */}
            <button
                onClick={toggleDropdown}
                className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg relative flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label="Notifications"
            >
                <Bell size={22} />

                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-in zoom-in-50">
                        {formattedCount}
                    </span>
                )}
            </button>

            {/* REAL-TIME FLOATING POPUP TOAST */}
            {toastNotification && !isOpen && (
                <div
                    onClick={() => handleNotificationClick(toastNotification)}
                    className="absolute right-0 mt-2 w-80 sm:w-88 z-50 rounded-xl bg-surface p-3.5 border border-primary/20 shadow-2xl flex items-start gap-3 cursor-pointer hover:bg-surface-variant/40 transition-all animate-in fade-in slide-in-from-top-3 duration-200"
                >
                    <UserImage
                        avatarUrl={toastNotification.sender?.avatar || ""}
                        firstName={toastNotification.sender?.firstName || "System"}
                        lastName={toastNotification.sender?.lastName || ""}
                        className="w-10 h-10"
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                            <p className="text-label-md font-semibold text-primary truncate">
                                {toastNotification.title}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setToastNotification(null);
                                }}
                                className="text-on-surface-variant hover:text-on-surface p-0.5 rounded-full"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                            {toastNotification.message}
                        </p>

                        <span className="text-[10px] text-primary font-medium mt-1 inline-block">
                            Click to view →
                        </span>
                    </div>
                </div>
            )}

            {/* NOTIFICATIONS POPOVER DROPDOWN PANEL */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 rounded-xl bg-surface border border-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3.5 border-b border-border bg-surface-variant/30">
                        <div className="flex items-center gap-2">
                            <h3 className="text-body-md font-semibold text-on-surface">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="bg-primary/10 text-primary text-label-sm font-medium px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-label-sm text-primary hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <CheckCheck size={14} />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List Body */}
                    <div className="max-h-95 overflow-y-auto divide-y divide-border/60">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8 text-on-surface-variant gap-2">
                                <Loader2 size={18} className="animate-spin text-primary" />
                                <span className="text-body-sm">Loading notifications...</span>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => handleNotificationClick(item)}
                                    className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-surface-variant/50 ${!item.isRead ? "bg-primary/5" : ""
                                        }`}
                                >
                                    {/* Sender Avatar */}
                                    <UserImage
                                        avatarUrl={item.sender?.avatar || ""}
                                        firstName={item.sender?.firstName || "System"}
                                        lastName={item.sender?.lastName || ""}
                                        className="w-9 h-9"
                                    />

                                    {/* Notification Text Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-label-md font-semibold text-on-surface truncate">
                                                {item.title}
                                            </p>
                                            {!item.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            )}
                                        </div>

                                        <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                                            {item.message}
                                        </p>

                                        <span className="text-[11px] text-outline mt-1.5 block">
                                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-on-surface-variant">
                                <p className="text-body-sm font-medium">No notifications yet</p>
                                <p className="text-label-sm text-outline mt-1">
                                    We&apos;ll notify you when something important arrives.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer - See All Link */}
                    <div className="p-2 border-t border-border bg-surface-variant/20 text-center">
                        <Link
                            href="/notification"
                            onClick={() => setIsOpen(false)}
                            className="text-label-md font-medium text-primary hover:underline block py-1.5"
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}