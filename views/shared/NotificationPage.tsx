/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { IGetNotificationsParams, INotification, notificationService } from "@/services/notification.service";
import NotificationHeader from "@/components/features/public/notification/NotificationHeader";
import NotificationFilters from "@/components/features/public/notification/NotificationFilters";
import NotificationCard from "@/components/features/public/notification/NotificationCard";
import Pagination from "@/components/ui/Pagination";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { NotificationType } from "@/utils/enums.utils";
import { socket } from "@/utils/socket";

export default function NotificationPage() {
    const dispatch: AppDispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("all");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );


    // Fetch Notifications from Server
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: IGetNotificationsParams = {
                page,
                limit,
            };

            if (activeTab === "unread") {
                params.isRead = false;
            }


            const res = await notificationService.getMyNotifications(params);
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
            setTotalNotifications(res.data.totalNotifications);
            setTotalPages(res.data.totalPages);
        } catch (err: any) {
            const errorMessage = err?.message || "Failed to fetch saved jobs.";
            handleToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    }, [activeTab, page, limit]);

    useEffect(() => {
        fetchNotifications();
        const notificationTypes = Object.values(NotificationType);


        // Attach listeners for all notification types
        notificationTypes.forEach((type) => {
            socket.on(type, fetchNotifications);
        });

        // Cleanup socket listeners & timers on unmount
        return () => {

            notificationTypes.forEach((type) => {
                socket.off(type, fetchNotifications);
            });
        };
    }, [fetchNotifications]);

    // Action Handlers
    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err: any) {
            const errorMessage = err?.message || "Failed to fetch saved jobs.";
            handleToast(errorMessage, "error");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err: any) {
            console.error("Failed to mark all as read", err);
            const errorMessage = err?.message || "Failed to mark all as read.";
            handleToast(errorMessage, "error");
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            setTotalNotifications((prev) => Math.max(0, prev - 1));
        } catch (err: any) {
            const errorMessage = err?.message || "Failed to delete notification.";
            handleToast(errorMessage, "error");
        }
    };

    const handleClearAll = async () => {
        try {
            await notificationService.clearAllNotifications();
            setNotifications([]);
            setTotalNotifications(0);
            setUnreadCount(0);
        } catch (err: any) {
            console.error("Failed to clear notifications", err);
            const errorMessage = err?.message || "Failed to clear notifications.";
            handleToast(errorMessage, "error");
        }
    };

    // Client-side Filtering & Sorting
    const filteredNotifications = notifications
        .filter((n) => {
            const q = query.toLowerCase();
            return (
                n.title.toLowerCase().includes(q) ||
                n.message.toLowerCase().includes(q) ||
                (n.sender && `${n.sender.firstName} ${n.sender.lastName}`.toLowerCase().includes(q))
            );
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
            <NotificationHeader
                unreadCount={unreadCount}
                totalNotifications={totalNotifications}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearAll={handleClearAll}
            />

            <section className="card p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                <NotificationFilters
                    activeTab={activeTab}
                    onTabChange={(tabId) => {
                        setActiveTab(tabId);
                        setPage(1);
                    }}
                    unreadCount={unreadCount}
                    query={query}
                    onQueryChange={(q) => {
                        setQuery(q);
                        setPage(1);
                    }}
                    sortOrder={sortOrder}
                    onSortChange={setSortOrder}
                />

                {/* Notifications Feed */}
                <div className="mt-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-on-surface-variant gap-2">
                            <Loader2 className="animate-spin" size={20} /> Loading notifications...
                        </div>
                    ) : error ? (
                        <div className="py-8 text-center text-error bg-error/10 rounded-md">
                            {error}
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="py-16 text-center text-on-surface-variant">
                            No notifications found.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filteredNotifications.map((item) => (
                                <NotificationCard
                                    key={item._id}
                                    item={item}
                                    onMarkRead={handleMarkAsRead}
                                    onDelete={handleDeleteNotification}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={limit}
                    totalItems={totalNotifications}
                    onPageChange={setPage}
                    isLoading={loading}
                    itemLabel="notifications"
                />
            </section>
        </div>
    );
}