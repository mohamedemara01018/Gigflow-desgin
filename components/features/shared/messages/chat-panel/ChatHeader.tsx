"use client";

import { BadgeCheck, FileText, ChevronRight, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { IConversation, IUserRef, IJobRef } from "@/services/conversation.service";
import { UserRole } from "@/utils/enums.utils";
import UserImage from "@/components/ui/UserImage";
import { useSelector } from "react-redux";
import { selectOnlineUsers } from "@/store/slices/socketSlice";

interface ChatHeaderProps {
    conversation: IConversation;
    currentUserRole?: UserRole.CLIENT | UserRole.FREELANCER;
    isTyping?: boolean;
    onToggleSidebar?: () => void;
    onToggleDossier?: () => void;
}

export default function ChatHeader({
    conversation,
    currentUserRole,
    isTyping = false,
    onToggleSidebar,
    onToggleDossier,
}: ChatHeaderProps) {
    const contract = conversation.contract;
    const onlineUsers = useSelector(selectOnlineUsers);

    const participant =
        currentUserRole === UserRole.CLIENT
            ? typeof conversation.freelancer === "object"
                ? (conversation.freelancer as IUserRef)
                : null
            : typeof conversation.client === "object"
                ? (conversation.client as IUserRef)
                : null;

    const participantId = participant?._id ? String(participant._id) : "";
    const isOnline = Boolean(participantId && onlineUsers[participantId]);

    const participantName = participant
        ? `${participant.firstName}${participant.lastName ? ` ${participant.lastName}` : ""}`.trim()
        : "User";

    const jobTitle =
        typeof conversation.job === "object" && conversation.job?.title
            ? (conversation.job as IJobRef).title
            : null;

    return (
        <div className="p-5 pb-3 border-b border-outline-variant bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    {onToggleSidebar && (
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            <PanelLeftOpen size={20} />
                        </button>
                    )}

                    <div className="relative shrink-0">
                        <UserImage
                            firstName={String(participant?.firstName || "")}
                            lastName={String(participant?.lastName || "")}
                            avatarUrl={String(participant?.avatar || "")}
                            className="w-12 h-12"
                        />
                        {/* Live Presence Dot on Avatar */}
                        <span
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                isOnline ? "bg-green-500 shadow-xs shadow-green-500/50" : "bg-gray-300"
                            }`}
                            title={isOnline ? "Online" : "Offline"}
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-headline-md text-on-surface truncate font-semibold">
                                {participantName}
                            </p>
                            <span className="flex items-center gap-1 text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full shrink-0">
                                <BadgeCheck size={12} className="text-primary" />
                                Verified
                            </span>
                        </div>

                        {/* Presence and Activity Subtitle */}
                        {isTyping ? (
                            <p className="text-body-xs text-primary animate-pulse font-medium">
                                typing...
                            </p>
                        ) : (
                            <div className="flex items-center gap-1.5 text-body-xs mt-0.5">
                                <span
                                    className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                                        isOnline ? "bg-green-500 shadow-xs shadow-green-500/50" : "bg-gray-400"
                                    }`}
                                />
                                <span
                                    className={`font-medium ${
                                        isOnline ? "text-green-600 font-semibold" : "text-on-surface-variant"
                                    }`}
                                >
                                    {isOnline ? "Online" : "Offline"}
                                </span>
                                {jobTitle && (
                                    <>
                                        <span className="text-on-surface-variant">•</span>
                                        <span className="text-on-surface-variant truncate">{jobTitle}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {contract && (
                        <button
                            onClick={onToggleDossier}
                            className="flex items-center gap-2 bg-primary-container/15 text-primary text-label-md rounded-md px-3.5 py-2 hover:opacity-90 transition-opacity cursor-pointer font-medium"
                        >
                            <FileText size={15} />
                            Contract
                        </button>
                    )}

                    {onToggleDossier && (
                        <button
                            onClick={onToggleDossier}
                            className="p-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                            aria-label="Toggle dossier panel"
                        >
                            <PanelRightOpen size={20} />
                        </button>
                    )}
                </div>
            </div>

            {contract && (
                <div className="flex items-center justify-between gap-3 mt-3 bg-primary-container/10 rounded-md px-3 py-2 text-body-sm">
                    <span className="text-on-surface truncate">
                        Contract
                        <span className="mx-2 text-on-surface-variant">•</span>
                        <span className="text-primary font-medium capitalize">
                            {typeof contract === "object" ? (contract as any).status || "Draft" : "Draft"}
                        </span>
                    </span>
                    {onToggleDossier && (
                        <button
                            onClick={onToggleDossier}
                            className="flex items-center gap-1 text-label-md text-primary shrink-0 cursor-pointer font-medium"
                        >
                            Details
                            <ChevronRight size={14} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}