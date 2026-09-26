"use client";

import { CheckCheck, Trash2 } from "lucide-react";

interface NotificationHeaderProps {
    unreadCount: number;
    totalNotifications: number;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
}

export default function NotificationHeader({
    unreadCount,
    totalNotifications,
    onMarkAllAsRead,
    onClearAll,
}: NotificationHeaderProps) {
    return (
        <>
            {/* Header Breadcrumbs & Quick Stats */}
            <div className="flex items-center justify-between flex-wrap gap-3">

                <div className="flex items-center gap-3 text-body-sm">
                    <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {unreadCount} Unread
                    </span>
                    <span className="text-on-surface-variant">{totalNotifications} Total</span>
                </div>
            </div>

            {/* Hero Control Panel */}
            <section className="card p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-headline-lg font-bold text-on-surface">
                            Notifications
                            <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full font-normal">
                                Live Feed
                            </span>
                        </div>
                        <p className="text-body-md text-on-surface-variant mt-2 max-w-130">
                            Real-time updates, active milestones, and security alerts linked directly to your account.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMarkAllAsRead}
                            className="flex items-center gap-2 bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2.5 hover:bg-surface-container-highest transition-colors font-medium"
                        >
                            <CheckCheck size={15} />
                            Mark all as read
                        </button>
                        <button
                            onClick={onClearAll}
                            className="flex items-center gap-2 bg-error-container/50 text-on-error-container text-label-md rounded-md px-4 py-2.5 hover:bg-error-container transition-colors font-medium"
                        >
                            <Trash2 size={15} />
                            Clear all
                        </button>

                    </div>
                </div>
            </section>
        </>
    );
}