"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import UserImage from "@/components/ui/UserImage";
import { formatDistanceToNow } from "@/utils/functions.utils";
import { INotification } from "@/services/notification.service";

type BadgeTone = "primary" | "secondary" | "tertiary" | "neutral";

const BADGE_CLASSES: Record<BadgeTone, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
    neutral: "bg-surface-container-high text-on-surface-variant",
};

interface NotificationCardProps {
    item: INotification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function NotificationCard({
    item,
    onMarkRead,
    onDelete,
}: NotificationCardProps) {
    const firstName = item.sender?.firstName || "";
    const lastName = item.sender?.lastName || "";
    console.log(item )
    const senderName =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : "System";

    return (
        <div
            onClick={() => !item.isRead && onMarkRead(item._id)}
            className={`group relative flex gap-4 p-4 rounded-lg transition-all cursor-pointer ${item.isRead
                ? "bg-surface-container-low border border-outline-variant"
                : "bg-primary/10 border-l-4 border-primary"
                }`}
        >
            {/* Avatar Section using UserImage */}
            <UserImage
                avatarUrl={item.sender?.avatar || ""}
                firstName={firstName}
                lastName={lastName}
                className="w-10 h-10 shrink-0"
            />

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    {/* Sender & Metadata Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-body-sm font-semibold text-on-surface">
                            {senderName}
                        </span>

                        {item.sender?.role && (
                            <span
                                className={`text-label-sm px-2 py-0.5 rounded-full capitalize ${BADGE_CLASSES.neutral}`}
                            >
                                {item.sender.role}
                            </span>
                        )}

                        {item.type && (
                            <span
                                className={`text-label-sm px-2 py-0.5 rounded-full font-semibold uppercase ${BADGE_CLASSES.primary}`}
                            >
                                {item.type}
                            </span>
                        )}
                    </div>

                    {/* Timestamp and Delete Action */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            {!item.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                            {formatDistanceToNow(item.createdAt)}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item._id);
                            }}
                            title="Delete Notification"
                            className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <p className="text-body-md font-semibold text-on-surface mt-1.5">
                    {item.title}
                </p>
                <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    {item.message}
                </p>

                {/* Optional Action Link */}
                {item.link && (
                    <div className="flex items-center gap-2 mt-3">
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-label-md text-primary hover:underline"
                        >
                            <ExternalLink size={13} /> View Details
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}