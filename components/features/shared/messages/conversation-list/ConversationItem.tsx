/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { Pin, Volume2, VolumeX, Archive, MoreVertical } from "lucide-react";
import {
    IConversation,
    IUserRef,
    IJobRef,
    IUpdateUserSettingsDto,
} from "@/services/conversation.service";
import UserImage from "@/components/ui/UserImage";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { selectOnlineUsers } from "@/store/slices/socketSlice";
import { UserRole } from "@/utils/enums.utils";
import { IProposal, proposalService } from "@/services/proposal.service";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

interface ConversationItemProps {
    conversation: IConversation;
    active: boolean;
    participant: IUserRef | null;
    unread: number;
    pinned: boolean;
    muted?: boolean;
    archived?: boolean;
    onSelect: (id: string) => void;
    onUpdateSettings?: (
        conversationId: string,
        settings: Partial<Omit<IUpdateUserSettingsDto, "role">>
    ) => Promise<void>;
}

export default function ConversationItem({
    conversation: c,
    active,
    participant,
    unread,
    pinned,
    muted = false,
    archived = false,
    onSelect,
    onUpdateSettings,
}: ConversationItemProps) {
    const dispatch: AppDispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();
    const { me } = useSelector(selectMeSlice);
    const onlineUsers = useSelector(selectOnlineUsers);

    const [proposal, setProposal] = useState<IProposal | null>(null);
    const [isLoadingProposal, setIsLoadingProposal] = useState<boolean>(false);

    const participantId = participant?._id ? String(participant._id) : "";
    const isOnline = Boolean(participantId && onlineUsers[participantId]);

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    const participantName = participant
        ? `${participant.firstName} ${participant.lastName}`.trim()
        : "Unknown User";

    const jobTitle =
        typeof c.job === "object" && c.job?.title
            ? (c.job as IJobRef).title
            : "Direct Conversation";

    const lastMessageText =
        typeof c.lastMessage === "object" && c.lastMessage?.content
            ? c.lastMessage.content
            : "No messages yet";

    const timeDisplay = c.lastMessageAt
        ? new Date(c.lastMessageAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    const handleSettingToggle = async (
        e: React.MouseEvent,
        key: "pinned" | "muted" | "archived",
        currentValue: boolean
    ) => {
        e.stopPropagation();
        if (!onUpdateSettings) return;
        await onUpdateSettings(c._id, { [key]: !currentValue });
        setShowMenu(false);
    };



    const clientUid = typeof c.client === "object" ? c.client?._id : c.client;
    const freelancerUid = typeof c.freelancer === "object" ? c.freelancer?._id : c.freelancer;
    const recipientId = me?.role === UserRole.FREELANCER ? clientUid : freelancerUid;
    const jobId = typeof c?.job === "object" ? c.job?._id : c?.job;

    const getProposalOfJob = useCallback(async () => {
        // Extract job and freelancer IDs safely
        const effectiveJobId = typeof c?.job === "object" ? c.job?._id : c?.job;
        const effectiveFreelancerId = typeof c?.freelancer === "object" ? c.freelancer?._id : c?.freelancer;

        if (!effectiveJobId || !effectiveFreelancerId) return;

        try {
            setIsLoadingProposal(true);

            const res = await proposalService.getAllProposals({
                job: effectiveJobId,
                freelancer: effectiveFreelancerId,
            });

            // Assuming response structure contains an array of proposals
            const proposals = res.data?.proposals || res.data || [];
            if (proposals.length > 0) {
                setProposal(proposals[0]);
            } else {
                setProposal(null);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            handleToast(error.message || "Failed to fetch proposal details", "error");
            setProposal(null);
        } finally {
            setIsLoadingProposal(false);
        }
    }, [c, handleToast]);

    useEffect(() => {
        getProposalOfJob();
    }, [getProposalOfJob]);

    return (
        <div
            onClick={() => {
                const queryParts: string[] = [];
                if (recipientId) queryParts.push(`recipient=${recipientId}`);
                if (jobId) queryParts.push(`job=${jobId}`);
                if (proposal?._id) queryParts.push(`proposal=${proposal._id}`);
                const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
                router.replace(`/messages${queryString}`);
                onSelect(c._id);
            }}
            className={`group relative text-left rounded-md p-3 transition-colors cursor-pointer ${active ? "bg-primary-container/10" : "hover:bg-surface-container-low"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                    <UserImage
                        firstName={participant?.firstName || ""}
                        lastName={participant?.lastName || ""}
                        avatarUrl={participant?.avatar || ""}
                        className="w-11 h-11"
                    />
                    <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            isOnline ? "bg-green-500 shadow-xs shadow-green-500/50" : "bg-gray-300"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <p className="text-body-md text-on-surface font-medium truncate">
                                {participantName}
                            </p>
                            <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                    isOnline ? "bg-green-500" : "bg-gray-300"
                                }`}
                                title={isOnline ? "Online" : "Offline"}
                            />
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {muted && <VolumeX size={12} className="text-on-surface-variant shrink-0" />}
                            {pinned && <Pin size={12} className="text-primary fill-primary shrink-0" />}
                            <span className="text-label-sm text-on-surface-variant">
                                {timeDisplay}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-body-sm text-on-surface-variant truncate">
                            {jobTitle}
                        </p>
                        {unread > 0 && (
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-on-primary text-label-sm shrink-0 font-medium">
                                {unread}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-body-sm text-on-surface-variant truncate">
                    {lastMessageText}
                </p>

                <div className="flex items-center gap-1.5 shrink-0">
                    {c.status && (
                        <span className="text-label-sm bg-surface-container-high text-on-surface-variant rounded-full px-2.5 py-0.5 capitalize">
                            {c.status}
                        </span>
                    )}

                    {/* Settings Action Button */}
                    {onUpdateSettings && (
                        <div className="relative">
                            <button
                                type="button"
                                aria-label="Conversation options"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu((prev) => !prev);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-container-high transition-opacity text-on-surface-variant"
                            >
                                <MoreVertical size={14} />
                            </button>

                            {showMenu && (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0  top-full mb-1 w-36 bg-surface-container-lowest border border-outline rounded-md shadow-lg py-1 z-20 text-body-sm"
                                >
                                    <button
                                        onClick={(e) => handleSettingToggle(e, "pinned", pinned)}
                                        className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low flex items-center gap-2 text-on-surface cursor-pointer"
                                    >
                                        <Pin size={14} /> {pinned ? "Unpin" : "Pin"}
                                    </button>
                                    <button
                                        onClick={(e) => handleSettingToggle(e, "muted", muted)}
                                        className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low flex items-center gap-2 text-on-surface cursor-pointer"
                                    >
                                        {muted ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                        {muted ? "Unmute" : "Mute"}
                                    </button>
                                    <button
                                        onClick={(e) => handleSettingToggle(e, "archived", archived)}
                                        className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low flex items-center gap-2 text-on-surface cursor-pointer"
                                    >
                                        <Archive size={14} /> {archived ? "Unarchive" : "Archive"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}