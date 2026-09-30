"use client";

import { useState } from "react";
import {
    ImageIcon,
    FileText,
    ExternalLink,
    Pencil,
    Trash2,
    Check,
    X,
    MoreVertical,
} from "lucide-react";
import { IMessage } from "@/services/message.service";
import { formatBytes } from "@/utils/functions.utils";

interface MessageItemProps {
    message: IMessage;
    currentUserId?: string;
    participantName: string;
    onEditMessage?: (messageId: string, newContent: string) => void | Promise<void>;
    onDeleteMessage?: (messageId: string) => void | Promise<void>;
    onUpdateMessageStatus?: (
        messageId: string,
        status: string
    ) => void | Promise<void>;
}

export default function MessageItem({
    message,
    currentUserId,
    participantName,
    onEditMessage,
    onDeleteMessage,
    onUpdateMessageStatus,
}: MessageItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content || "");
    const [showMenu, setShowMenu] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const senderId =
        typeof message.sender === "object" ? message.sender._id : message.sender;
    const mine = senderId === currentUserId;

    const senderName =
        typeof message.sender === "object"
            ? `${message.sender.firstName}${message.sender.lastName ? ` ${message.sender.lastName}` : ""
                }`.trim()
            : mine
                ? "You"
                : participantName;

    const timeDisplay = new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const handleSaveEdit = async () => {
        if (!editContent.trim() || !onEditMessage) return;
        try {
            setIsSubmitting(true);
            await onEditMessage(message._id, editContent.trim());
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to edit message:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!onDeleteMessage) return;
        try {
            setIsSubmitting(true);
            await onDeleteMessage(message._id);
        } catch (err) {
            console.error("Failed to delete message:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`group flex flex-col ${mine ? "items-end" : "items-start"}`}>
            <p className="text-label-sm text-on-surface-variant mb-1 flex items-center gap-1">
                {mine ? (
                    <>
                        {timeDisplay}
                        <span className="text-on-surface font-medium ml-1">
                            {senderName}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-on-surface font-medium mr-1">
                            {senderName}
                        </span>
                        {timeDisplay}
                    </>
                )}
            </p>

            <div className="relative flex items-center gap-1 max-w-[80%]">
                {/* Actions Context Menu Trigger for Sent Messages */}
                {mine && !isEditing && (onEditMessage || onDeleteMessage) && (
                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            type="button"
                            aria-label="Message options"
                            onClick={() => setShowMenu((prev) => !prev)}
                            className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant"
                        >
                            <MoreVertical size={14} />
                        </button>

                        {showMenu && (
                            <div
                                onClick={() => setShowMenu(false)}
                                className="absolute right-0 bottom-full mb-1 w-28 bg-surface-container-lowest border border-outline rounded-md shadow-lg py-1 z-20 text-body-sm"
                            >
                                {onEditMessage && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setEditContent(message.content || "");
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low flex items-center gap-2 text-on-surface"
                                    >
                                        <Pencil size={12} /> Edit
                                    </button>
                                )}
                                {onDeleteMessage && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                        className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low flex items-center gap-2 text-error"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div
                    className={`w-full rounded-2xl px-4 py-3 text-body-md shadow-sm ${mine
                            ? "bg-primary text-on-primary rounded-tr-none"
                            : "bg-surface-container-lowest border border-outline-variant text-on-surface rounded-tl-none"
                        }`}
                >
                    {isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 text-body-sm rounded bg-surface-container-lowest text-on-surface border border-outline focus:outline-none resize-none"
                                rows={2}
                            />
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSubmitting}
                                    className="p-1 rounded hover:bg-on-primary/20 text-on-primary"
                                >
                                    <X size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    disabled={isSubmitting || !editContent.trim()}
                                    className="p-1 rounded hover:bg-on-primary/20 text-on-primary"
                                >
                                    <Check size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {message.content && (
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {message.content}
                                </p>
                            )}

                            {message.attachments?.map((attachment, i) => {
                                const isPdf =
                                    attachment.originalName?.endsWith(".pdf") ||
                                    attachment.mimeType?.includes("pdf");

                                return (
                                    <a
                                        key={i}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 text-body-sm mt-2 p-2 rounded-lg transition-opacity hover:opacity-85 cursor-pointer ${mine
                                                ? "bg-on-primary/10 text-on-primary"
                                                : "bg-surface-container-high text-on-surface"
                                            }`}
                                    >
                                        {isPdf ? (
                                            <FileText size={16} className="shrink-0" />
                                        ) : (
                                            <ImageIcon size={16} className="shrink-0" />
                                        )}

                                        <span className="truncate flex-1 font-medium underline underline-offset-2">
                                            {attachment.originalName || "Attachment"}
                                        </span>

                                        {attachment.size && (
                                            <span className="opacity-75 text-xs shrink-0">
                                                {formatBytes(attachment.size)}
                                            </span>
                                        )}

                                        <ExternalLink
                                            size={14}
                                            className="shrink-0 opacity-70"
                                        />
                                    </a>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}