"use client";

import { BadgeCheck, FileText, ChevronRight, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { IConversation, IUserRef, IJobRef } from "@/services/conversation.service";
import { UserRole } from "@/utils/enums.utils";
import UserImage from "@/components/ui/UserImage";

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

    const jobTitle =
        typeof conversation.job === "object" && conversation.job?.title
            ? (conversation.job as IJobRef).title
            : null;

    return (
        <div className="p-5 pb-3 border-b border-outline-variant">
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
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-headline-md text-on-surface truncate font-semibold">
                                {participantName}
                            </p>
                            <span className="flex items-center gap-1 text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full shrink-0">
                                <BadgeCheck size={12} className="text-primary" />
                                Verified
                            </span>
                        </div>
                        {isTyping ? (
                            <p className="text-body-sm text-primary animate-pulse font-medium">
                                typing...
                            </p>
                        ) : (
                            <p className="text-body-sm text-on-surface-variant truncate">
                                {jobTitle || "Direct Message"}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {contract && (
                        <button className="flex items-center gap-2 bg-primary-container/15 text-primary text-label-md rounded-md px-3.5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
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
                        <span className="text-primary font-medium">In Progress</span>
                    </span>
                    <button className="flex items-center gap-1 text-label-md text-primary shrink-0 cursor-pointer">
                        Details
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}