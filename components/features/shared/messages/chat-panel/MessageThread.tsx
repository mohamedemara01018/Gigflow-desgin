"use client";

import { useEffect, useRef } from "react";
import { ShieldCheck } from "lucide-react";
import { IConversation, IUserRef } from "@/services/conversation.service";
import { IMessage } from "@/services/message.service";
import { UserRole } from "@/utils/enums.utils";
import MessageItem from "./MessageItem";

interface MessageThreadProps {
    conversation: IConversation;
    messages: IMessage[];
    currentUserId?: string;
    currentUserRole?: UserRole.CLIENT | UserRole.FREELANCER;
    isTyping?: boolean;
    onEditMessage?: (messageId: string, newContent: string) => void | Promise<void>;
    onDeleteMessage?: (messageId: string) => void | Promise<void>;
    onUpdateMessageStatus?: (messageId: string, status: string) => void | Promise<void>;
}

export default function MessageThread({
    conversation,
    messages,
    currentUserId,
    currentUserRole,
    isTyping = false,
    onEditMessage,
    onDeleteMessage,
    onUpdateMessageStatus,
}: MessageThreadProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const contract = conversation.contract;

    const participant =
        currentUserRole === UserRole.CLIENT
            ? typeof conversation.freelancer === "object"
                ? (conversation.freelancer as IUserRef)
                : null
            : typeof conversation.client === "object"
                ? (conversation.client as IUserRef)
                : null;

    const participantName = participant
        ? `${participant.firstName}${participant.lastName ? ` ${participant.lastName}` : ""}`.trim()
        : "User";

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, conversation._id, isTyping]);

    return (
        <div className="flex-1 min-h-0 h-full overflow-y-auto p-5 flex flex-col gap-4 bg-surface-container-low/40">
            {contract && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shrink-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
                                <ShieldCheck size={18} />
                            </span>
                            <div>
                                <p className="text-body-md text-on-surface font-medium">Contract Active</p>
                                <p className="text-label-sm text-on-surface-variant">Work is protected by Escrow</p>
                            </div>
                        </div>
                        <span className="text-label-md bg-primary text-on-primary px-3.5 py-1.5 rounded-full">
                            Active Milestone
                        </span>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 flex-1">
                {messages.map((message) => (
                    <MessageItem
                        key={message._id}
                        message={message}
                        currentUserId={currentUserId}
                        participantName={participantName}
                        onEditMessage={onEditMessage}
                        onDeleteMessage={onDeleteMessage}
                        onUpdateMessageStatus={onUpdateMessageStatus}
                    />
                ))}

                {isTyping && (
                    <div className="flex items-center gap-2 max-w-[80%] self-start shrink-0">
                        <div className="bg-surface-container-high border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-on-surface-variant/60 animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 rounded-full bg-on-surface-variant/60 animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 rounded-full bg-on-surface-variant/60 animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            <div ref={bottomRef} />
        </div>
    );
}