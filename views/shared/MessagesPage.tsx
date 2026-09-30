/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import {
    conversationService,
    IConversation,
    ICreateOrGetConversationDto,
    IUpdateUserSettingsDto,
} from "@/services/conversation.service";
import {
    messageService,
    IMessage,
    IEditMessageDto,
} from "@/services/message.service";
import {
    contractService,
    ICreateContractDto,
    IUpdateContractDto,
    IRespondContractDto,
    IContract,
} from "@/services/contract.service";
import {
    milestoneService,
    IMilestone,
    ICreateMilestoneDto,
    ISubmitMilestoneDto,
    IRejectMilestoneDto,
} from "@/services/milestone.service";
import ChatPanel from "@/components/features/shared/messages/Chatpanel";
import ConversationList from "@/components/features/shared/messages/Conversationlist";
import ProjectDossier, { IContractWithMilestones } from "@/components/features/shared/messages/Projectdossier";
import { ContractStatus, MessageStatus, MessageType, UserRole } from "@/utils/enums.utils";
import { AppDispatch } from "@/store/store";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import Loading from "@/components/ui/Loading";
import { socket } from "@/utils/socket";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SidebarNavigation from "./SidebarNavigation";

const DURATION = 3000;

interface MessagesPageProps {
    recipient?: string;
    job?: string;
    proposal?: string;
}

export default function MessagesPage({
    recipient,
    job,
    proposal,
}: MessagesPageProps) {
    const dispatch: AppDispatch = useDispatch();

    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [activeContract, setActiveContract] = useState<IContractWithMilestones | null>(null);
    const [isLoadingContract, setIsLoadingContract] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingSendMessage, setIsLoadingSendMessage] = useState(false);

    // Responsive drawer/overlay toggles
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDossierOpen, setIsDossierOpen] = useState(false);

    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1279px)");
    const isMobile = useMediaQuery("(max-width: 767px)");

    // Typing Status State
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTypingRef = useRef<boolean>(false);

    const activeConversation = conversations.find((c) => c._id === activeId) ?? null;
    const { me } = useSelector(selectMeSlice);

    const currentUserId = me?._id;
    const currentUserRole = me?.role as UserRole | string | undefined;

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    // 1. Fetch Conversations & Handle Direct Navigation via Props
    const initConversations = useCallback(async () => {
        if (!currentUserId || !currentUserRole) return;

        try {
            setIsLoading(true);

            const listRes = await conversationService.getUserConversations(String(currentUserId));
            let fetchedConversations = listRes.data.conversations || [];

            if (recipient) {
                const payload: ICreateOrGetConversationDto = {
                    client: currentUserRole === UserRole.CLIENT ? currentUserId : recipient,
                    freelancer: currentUserRole === UserRole.FREELANCER ? currentUserId : recipient,
                    job: job,
                };

                const targetRes = await conversationService.createOrGetConversation(payload);
                const targetConv = targetRes.data.conversation;

                const exists = fetchedConversations.some((c) => String(c._id) === String(targetConv._id));
                if (!exists) {
                    fetchedConversations = [targetConv, ...fetchedConversations];
                } else {
                    fetchedConversations = fetchedConversations.map((c) =>
                        String(c._id) === String(targetConv._id) ? { ...c, ...targetConv } : c
                    );
                }

                setActiveId(targetConv._id);
            } else if (fetchedConversations.length > 0) {
                setActiveId(fetchedConversations[0]._id);
            }

            // Deduplicate all conversations by unique _id
            const uniqueMap = new Map<string, IConversation>();
            fetchedConversations.forEach((c) => {
                if (c && c._id) {
                    uniqueMap.set(String(c._id), c);
                }
            });

            setConversations(Array.from(uniqueMap.values()));
        } catch (error: any) {
            handleToast(error.message || "Failed to fetch conversations", "error");
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId, currentUserRole, recipient, job, handleToast]);

    useEffect(() => {
        initConversations();
    }, [initConversations]);

    // Request presence for conversation participants
    useEffect(() => {
        if (!conversations || conversations.length === 0) return;

        const participantIds = Array.from(
            new Set(
                conversations
                    .flatMap((c) => {
                        const clientUid = typeof c.client === "object" ? c.client?._id : c.client;
                        const freelancerUid = typeof c.freelancer === "object" ? c.freelancer?._id : c.freelancer;
                        return [clientUid, freelancerUid];
                    })
                    .filter(Boolean)
            )
        ) as string[];

        if (participantIds.length > 0) {
            socket.emit("check_presence", { userIds: participantIds });
        }
    }, [conversations]);

    // 2. Fetch Messages
    const fetchMessages = useCallback(
        async (conversationId: string) => {
            try {
                const res = await messageService.getConversationMessages(conversationId, {
                    limit: 50,
                });

                const fetchedMessages: IMessage[] = res.data.messages;
                setMessages(fetchedMessages.reverse());

                if (currentUserRole) {
                    await conversationService.resetUnreadCount(conversationId, {
                        role: currentUserRole as UserRole.CLIENT | UserRole.FREELANCER,
                    });

                    setConversations((prev) =>
                        prev.map((c) =>
                            c._id === conversationId
                                ? {
                                    ...c,
                                    ...(currentUserRole === UserRole.CLIENT
                                        ? { clientUnreadCount: 0 }
                                        : { freelancerUnreadCount: 0 }),
                                }
                                : c
                        )
                    );
                }
            } catch (error: any) {
                handleToast(error.message || "Failed to fetch messages", "error");
            }
        },
        [currentUserRole, handleToast]
    );

    // 3. Fetch Contract and Milestones for Active Conversation
    const fetchContract = useCallback(
        async (contractIdOrObj: any) => {
            if (!contractIdOrObj) {
                setActiveContract(null);
                return;
            }

            const contractId = typeof contractIdOrObj === "string" ? contractIdOrObj : contractIdOrObj._id;

            if (!contractId) {
                setActiveContract(null);
                return;
            }

            try {
                setIsLoadingContract(true);
                const [contractRes, milestonesRes] = await Promise.all([
                    contractService.getContractById(contractId),
                    milestoneService.getContractMilestones(contractId).catch(() => ({ data: { milestones: [] } })),
                ]);

                const contractData = contractRes.data.contract;
                const milestonesData = milestonesRes.data?.milestones || [];

                setActiveContract({
                    ...contractData,
                    milestones: milestonesData,
                });
            } catch (error: any) {
                handleToast(error.message || "Failed to fetch contract details", "error");
                setActiveContract(null);
            } finally {
                setIsLoadingContract(false);
            }
        },
        [handleToast]
    );

    useEffect(() => {
        if (activeId) {
            fetchMessages(activeId);
        }
    }, [activeId, fetchMessages]);

    useEffect(() => {
        if (activeConversation?.contract) {
            fetchContract(activeConversation.contract);
        } else {
            setActiveContract(null);
        }
    }, [activeConversation, fetchContract]);

    // 4. Contract Operations
    const handleCreateContract = async (payload: ICreateContractDto) => {
        if (currentUserRole !== UserRole.CLIENT) {
            handleToast("Unauthorized: Only CLIENT can create contracts.", "error");
            return;
        }

        try {
            setIsLoadingContract(true);
            const res = await contractService.createContract(payload);
            const createdContract = res.data.contract;

            setActiveContract({
                ...createdContract,
                milestones: [],
            });

            // Update local conversation reference
            setConversations((prev) =>
                prev.map((c) =>
                    c._id === activeId ? { ...c, contract: createdContract._id } : c
                )
            );

            handleToast("Draft contract created successfully", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to create contract", "error");
            throw error;
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleSendContract = async (id: string) => {
        try {
            setIsLoadingContract(true);
            const res = await contractService.sendContract(id);
            setActiveContract((prev) => ({
                ...(prev || ({} as any)),
                ...res.data.contract,
            }));
            handleToast("Contract sent to freelancer for review", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to send contract", "error");
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleRespondToContract = async (id: string, payload: IRespondContractDto) => {
        try {
            setIsLoadingContract(true);
            const res = await contractService.respondToContract(id, payload);
            const updated = res.data.contract;

            // Re-fetch milestones in case first milestone was activated
            const milestonesRes = await milestoneService.getContractMilestones(id).catch(() => ({ data: { milestones: [] } }));

            setActiveContract({
                ...updated,
                milestones: milestonesRes.data?.milestones || [],
            });

            handleToast(
                payload.action === "accept"
                    ? "Contract accepted! Work is now active."
                    : "Contract declined.",
                "success"
            );
        } catch (error: any) {
            handleToast(error.message || "Failed to respond to contract", "error");
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleUpdateContract = async (id: string, payload: IUpdateContractDto) => {
        if (activeContract?.status === ContractStatus.ACTIVE) {
            handleToast("Action restricted: Cannot modify an active contract.", "error");
            return;
        }

        try {
            setIsLoadingContract(true);
            const res = await contractService.updateContract(id, payload);
            setActiveContract((prev) => ({
                ...(prev || ({} as any)),
                ...res.data.contract,
            }));
            handleToast("Contract updated successfully", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to update contract", "error");
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleDeleteContract = async (id: string) => {
        if (activeContract?.status === ContractStatus.ACTIVE) {
            handleToast("Action restricted: Cannot delete an active contract.", "error");
            return;
        }

        try {
            setIsLoadingContract(true);
            await contractService.deleteContract(id);
            setActiveContract(null);

            setConversations((prev) =>
                prev.map((c) => (c._id === activeId ? { ...c, contract: undefined } : c))
            );

            handleToast("Contract deleted successfully", "info");
        } catch (error: any) {
            handleToast(error.message || "Failed to delete contract", "error");
        } finally {
            setIsLoadingContract(false);
        }
    };

    // 5. Milestone Operations
    const handleCreateMilestone = async (payload: ICreateMilestoneDto) => {
        try {
            setIsLoadingContract(true);
            const res = await milestoneService.createMilestone(payload);
            const newMilestone = res.data.milestone;

            setActiveContract((prev) => {
                if (!prev) return prev;
                const currentMilestones = prev.milestones || [];
                if (currentMilestones.some((m) => String(m._id) === String(newMilestone._id))) {
                    return prev;
                }
                return {
                    ...prev,
                    milestones: [...currentMilestones, newMilestone].sort((a, b) => (a.order || 0) - (b.order || 0)),
                };
            });

            handleToast("Milestone created successfully", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to create milestone", "error");
            throw error;
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleDeleteMilestone = async (id: string) => {
        try {
            setIsLoadingContract(true);
            await milestoneService.deleteMilestone(id);

            setActiveContract((prev) => {
                if (!prev) return prev;
                const filtered = (prev.milestones || []).filter((m) => m._id !== id);
                return {
                    ...prev,
                    milestones: filtered,
                };
            });

            handleToast("Milestone deleted", "info");
        } catch (error: any) {
            handleToast(error.message || "Failed to delete milestone", "error");
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleSubmitMilestone = async (id: string, payload?: ISubmitMilestoneDto) => {
        try {
            setIsLoadingContract(true);
            const res = await milestoneService.submitMilestone(id, payload);
            const updated = res.data.milestone;

            setActiveContract((prev) => {
                if (!prev) return prev;
                const list = prev.milestones || [];
                return {
                    ...prev,
                    milestones: list.map((m) => (m._id === id ? updated : m)),
                };
            });

            handleToast("Milestone deliverables submitted successfully for client review", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to submit milestone work", "error");
            throw error;
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleApproveMilestone = async (id: string) => {
        try {
            setIsLoadingContract(true);
            await milestoneService.approveMilestone(id);

            // Re-fetch contract & milestones to sync activated next milestone and contract status
            if (activeContract?._id) {
                const [contractRes, milestonesRes] = await Promise.all([
                    contractService.getContractById(activeContract._id),
                    milestoneService.getContractMilestones(activeContract._id).catch(() => ({ data: { milestones: [] } })),
                ]);

                setActiveContract({
                    ...contractRes.data.contract,
                    milestones: milestonesRes.data?.milestones || [],
                });
            }

            handleToast("Milestone approved! Payment released.", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to approve milestone", "error");
            throw error;
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleRejectMilestone = async (id: string, payload: IRejectMilestoneDto) => {
        try {
            setIsLoadingContract(true);
            const res = await milestoneService.rejectMilestone(id, payload);
            const updated = res.data.milestone;

            setActiveContract((prev) => {
                if (!prev) return prev;
                const list = prev.milestones || [];
                return {
                    ...prev,
                    milestones: list.map((m) => (m._id === id ? updated : m)),
                };
            });

            handleToast("Revision requested. Freelancer will be notified.", "info");
        } catch (error: any) {
            handleToast(error.message || "Failed to request milestone revision", "error");
            throw error;
        } finally {
            setIsLoadingContract(false);
        }
    };

    // 6. Socket Event Handlers
    useEffect(() => {
        if (!activeId) return;

        setTypingUsers([]);
        socket.emit("join_conversation", { conversationId: activeId });

        const handleNewMessage = (newMessage: IMessage) => {
            const messageConversationId =
                typeof newMessage.conversation === "object"
                    ? (newMessage.conversation as any)._id
                    : newMessage.conversation;

            const senderId =
                typeof newMessage.sender === "object"
                    ? (newMessage.sender as any)._id
                    : newMessage.sender;

            if (senderId === currentUserId) return;

            if (messageConversationId === activeId) {
                setMessages((prev) => {
                    if (prev.some((msg) => msg._id === newMessage._id)) return prev;
                    return [...prev, newMessage];
                });
            }

            setConversations((prev) =>
                prev.map((c) =>
                    c._id === messageConversationId
                        ? {
                            ...c,
                            lastMessage: newMessage as unknown as IConversation["lastMessage"],
                            lastMessageAt: newMessage.createdAt,
                        }
                        : c
                )
            );
        };

        const handleMessageEdited = (updatedMessage: IMessage) => {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
            );
        };

        const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId
                        ? {
                            ...msg,
                            content: "This message was deleted",
                            isDeleted: true,
                            deletedAt: new Date().toISOString(),
                        }
                        : msg
                )
            );
        };

        const handleStatusUpdated = (updatedMessage: IMessage) => {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
            );
        };

        const handleUserTyping = ({
            conversationId: targetRoom,
            userId,
            isTyping,
        }: {
            conversationId: string;
            userId: string;
            isTyping: boolean;
        }) => {
            if (targetRoom !== activeId || userId === currentUserId) return;

            setTypingUsers((prev) => {
                if (isTyping) {
                    return prev.includes(userId) ? prev : [...prev, userId];
                } else {
                    return prev.filter((id) => id !== userId);
                }
            });
        };

        // Realtime Contract Sockets
        const handleContractCreated = (newContract: IContract) => {
            const contractJobId = typeof newContract.job === "object" ? (newContract.job as any)._id : newContract.job;
            const convJobId = typeof activeConversation?.job === "object" ? activeConversation?.job?._id : activeConversation?.job;

            if (contractJobId === convJobId || (newContract as any).conversation === activeId) {
                fetchContract(newContract._id);
            }

            setConversations((prev) =>
                prev.map((c) => {
                    const cJob = typeof c.job === "object" ? c.job?._id : c.job;
                    if (cJob === contractJobId) {
                        return { ...c, contract: newContract._id };
                    }
                    return c;
                })
            );
        };

        const handleContractUpdated = (updatedContract: IContract) => {
            if (activeContract?._id === updatedContract._id) {
                setActiveContract((prev) => ({
                    ...(prev || ({} as any)),
                    ...updatedContract,
                    milestones: prev?.milestones || [],
                }));

                if (updatedContract._id) {
                    milestoneService.getContractMilestones(updatedContract._id).then((mRes) => {
                        setActiveContract((prev) => ({
                            ...(prev || ({} as any)),
                            ...updatedContract,
                            milestones: mRes.data?.milestones || [],
                        }));
                    }).catch(() => {});
                }
            }
        };

        const handleContractDeleted = ({ contractId }: { contractId: string }) => {
            if (activeContract?._id === contractId) {
                setActiveContract(null);
            }
            setConversations((prev) =>
                prev.map((c) => (c._id === activeId ? { ...c, contract: undefined } : c))
            );
        };

        // Realtime Milestone Sockets
        const handleMilestoneCreated = (newMilestone: IMilestone) => {
            const milestoneContractId =
                typeof newMilestone.contract === "object"
                    ? (newMilestone.contract as any)._id
                    : newMilestone.contract;

            if (String(activeContract?._id) === String(milestoneContractId)) {
                setActiveContract((prev) => {
                    if (!prev) return prev;
                    const list = prev.milestones || [];
                    if (list.some((m) => String(m._id) === String(newMilestone._id))) return prev;
                    return {
                        ...prev,
                        milestones: [...list, newMilestone].sort((a, b) => (a.order || 0) - (b.order || 0)),
                    };
                });
            }
        };

        const handleMilestoneUpdated = (updatedMilestone: IMilestone) => {
            const milestoneContractId =
                typeof updatedMilestone.contract === "object"
                    ? (updatedMilestone.contract as any)._id
                    : updatedMilestone.contract;

            if (String(activeContract?._id) === String(milestoneContractId)) {
                setActiveContract((prev) => {
                    if (!prev) return prev;
                    const list = prev.milestones || [];
                    return {
                        ...prev,
                        milestones: list.map((m) => (String(m._id) === String(updatedMilestone._id) ? updatedMilestone : m)),
                    };
                });
            }
        };

        const handleMilestoneDeleted = ({ milestoneId, contractId }: { milestoneId: string; contractId: string }) => {
            if (activeContract?._id === contractId) {
                setActiveContract((prev) => {
                    if (!prev) return prev;
                    const list = prev.milestones || [];
                    return {
                        ...prev,
                        milestones: list.filter((m) => m._id !== milestoneId),
                    };
                });
            }
        };

        socket.on("message:received", handleNewMessage);
        socket.on("message:updated", handleMessageEdited);
        socket.on("message:deleted", handleMessageDeleted);
        socket.on("message:status_updated", handleStatusUpdated);
        socket.on("user_typing", handleUserTyping);

        socket.on("contract:created", handleContractCreated);
        socket.on("contract:sent", handleContractUpdated);
        socket.on("contract:updated", handleContractUpdated);
        socket.on("contract:deleted", handleContractDeleted);

        socket.on("milestone:created", handleMilestoneCreated);
        socket.on("milestone:updated", handleMilestoneUpdated);
        socket.on("milestone:deleted", handleMilestoneDeleted);

        return () => {
            socket.emit("leave_conversation", { conversationId: activeId });
            socket.off("message:received", handleNewMessage);
            socket.off("message:updated", handleMessageEdited);
            socket.off("message:deleted", handleMessageDeleted);
            socket.off("message:status_updated", handleStatusUpdated);
            socket.off("user_typing", handleUserTyping);

            socket.off("contract:created", handleContractCreated);
            socket.off("contract:sent", handleContractUpdated);
            socket.off("contract:updated", handleContractUpdated);
            socket.off("contract:deleted", handleContractDeleted);

            socket.off("milestone:created", handleMilestoneCreated);
            socket.off("milestone:updated", handleMilestoneUpdated);
            socket.off("milestone:deleted", handleMilestoneDeleted);
        };
    }, [activeId, activeContract?._id, activeConversation?.job, currentUserId, fetchContract]);

    const handleStopTyping = useCallback(() => {
        if (isTypingRef.current && activeId && currentUserId) {
            isTypingRef.current = false;
            socket.emit("typing_stop", { conversationId: activeId, userId: currentUserId });
        }
    }, [activeId, currentUserId]);

    const handleInputChange = useCallback(() => {
        if (!activeId || !currentUserId) return;

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            socket.emit("typing_start", { conversationId: activeId, userId: currentUserId });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            handleStopTyping();
        }, 2000);
    }, [activeId, currentUserId, handleStopTyping]);

    const handleSend = async (text: string, files?: File[]) => {
        const hasText = Boolean(text.trim());
        const hasFiles = Boolean(files && files.length > 0);

        if ((!hasText && !hasFiles) || !activeId || !currentUserId) return;

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        handleStopTyping();

        setIsLoadingSendMessage(true);

        try {
            const messageType = hasFiles ? MessageType.FILE : MessageType.TEXT;

            const messageRes = await messageService.sendMessage({
                conversationId: activeId,
                senderId: currentUserId,
                content: text.trim(),
                type: messageType,
                attachments: files,
            });

            const finalMessage = messageRes.data.message;

            setMessages((prev) => [...prev, finalMessage]);

            setConversations((prev: IConversation[]) =>
                prev.map((c): IConversation =>
                    c._id === activeId
                        ? {
                            ...c,
                            lastMessage: finalMessage as unknown as IConversation["lastMessage"],
                            lastMessageAt: finalMessage.createdAt,
                        }
                        : c
                )
            );

            socket.emit("send_message", finalMessage);
        } catch (error: any) {
            handleToast(error.message || "Failed to send message", "error");
        } finally {
            setIsLoadingSendMessage(false);
        }
    };

    const handleEditMessage = async (messageId: string, newContent: string) => {
        if (!newContent.trim() || !currentUserId) return;

        try {
            const payload: IEditMessageDto = {
                content: newContent.trim(),
                senderId: currentUserId,
            };

            const res = await messageService.editMessage(messageId, payload);
            const updatedMessage = res.data.message;

            setMessages((prev) =>
                prev.map((msg) => (msg._id === messageId ? updatedMessage : msg))
            );

            setConversations((prev) =>
                prev.map((c) => {
                    const lastMsgId =
                        typeof c.lastMessage === "object"
                            ? c.lastMessage?._id
                            : c.lastMessage;
                    if (c._id === activeId && lastMsgId === messageId) {
                        return {
                            ...c,
                            lastMessage: updatedMessage as unknown as IConversation["lastMessage"],
                        };
                    }
                    return c;
                })
            );

            socket.emit("edit_message", updatedMessage);
            handleToast("Message updated successfully", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to edit message", "error");
        }
    };

    const handleUpdateMessageStatus = async (messageId: string, status: MessageStatus | string) => {
        try {
            const res = await messageService.updateMessageStatus(messageId, { status });
            const updatedMessage = res.data.message;

            setMessages((prev) =>
                prev.map((msg) => (msg._id === messageId ? updatedMessage : msg))
            );

            socket.emit("update_message_status", updatedMessage);
        } catch (error: any) {
            handleToast(error.message || "Failed to update message status", "error");
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!currentUserId || !activeId) return;

        try {
            await messageService.deleteMessage(messageId, { senderId: currentUserId });

            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId
                        ? {
                            ...msg,
                            content: "This message was deleted",
                            isDeleted: true,
                            deletedAt: new Date().toISOString(),
                        }
                        : msg
                )
            );

            socket.emit("delete_message", { conversationId: activeId, messageId });
            handleToast("Message deleted", "info");
        } catch (error: any) {
            handleToast(error.message || "Failed to delete message", "error");
        }
    };

    const handleUpdateUserSettings = async (
        conversationId: string,
        settings: Partial<Omit<IUpdateUserSettingsDto, "role">>
    ) => {
        if (!currentUserRole) return;

        try {
            const payload: IUpdateUserSettingsDto = {
                role: currentUserRole as UserRole.CLIENT | UserRole.FREELANCER,
                ...settings,
            };

            const res = await conversationService.updateUserSettings(conversationId, payload);
            const updatedConv = res.data.conversation;

            setConversations((prev) =>
                prev.map((c) => (c._id === conversationId ? updatedConv : c))
            );

            handleToast("Settings updated successfully", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to update conversation settings", "error");
        }
    };

    const handleSelectConversation = (id: string) => {
        setActiveId(id);
        if (isMobile || isTablet) {
            setIsSidebarOpen(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <main className="bg-surface py-6">
            <div className="wrapper">
                <div className="grid grid-cols-1 md:grid-cols-[68px_1fr] xl:grid-cols-[320px_minmax(0,1fr)_320px] gap-4 lg:gap-5 h-[calc(100vh-7rem)] min-h-150">
                    {/* Desktop Sidebar */}
                    <div className="hidden xl:block h-full">
                        <ConversationList
                            conversations={conversations}
                            activeId={activeId ?? ""}
                            onSelect={handleSelectConversation}
                            currentUserId={currentUserId}
                            currentUserRole={currentUserRole as UserRole.CLIENT | UserRole.FREELANCER}
                            onUpdateSettings={handleUpdateUserSettings}
                        />
                    </div>

                    {/* Tablet Icon Navigation */}
                    <div className="hidden md:block xl:hidden h-full">
                        <SidebarNavigation
                            conversations={conversations}
                            activeId={activeId ?? ""}
                            onSelect={handleSelectConversation}
                            currentUserId={currentUserId}
                            currentUserRole={currentUserRole as UserRole.CLIENT | UserRole.FREELANCER}
                            onOpenFullList={() => setIsSidebarOpen(true)}
                        />
                    </div>

                    {/* Chat Panel */}
                    <div className="h-full flex flex-col min-w-0">
                        {activeConversation ? (
                            <ChatPanel
                                conversation={activeConversation}
                                messages={messages}
                                onSend={handleSend}
                                onEditMessage={handleEditMessage}
                                onDeleteMessage={handleDeleteMessage}
                                onUpdateMessageStatus={handleUpdateMessageStatus}
                                currentUserId={currentUserId}
                                currentUserRole={currentUserRole as UserRole.CLIENT | UserRole.FREELANCER}
                                isLoadingSendMessage={isLoadingSendMessage}
                                isTyping={typingUsers.length > 0}
                                onInputChange={handleInputChange}
                                onToggleSidebar={() => setIsSidebarOpen(true)}
                                onToggleDossier={() => setIsDossierOpen(true)}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400 border border-border rounded-lg bg-white">
                                No active conversation selected
                            </div>
                        )}
                    </div>

                    {/* Desktop Project Dossier */}
                    <div className="hidden xl:block h-full">
                        <div className="sticky top-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
                            {activeConversation && (
                                isLoadingContract ? (
                                    <div className="flex h-full min-h-75 items-center justify-center border border-border rounded-lg bg-white">
                                        <Loading />
                                    </div>
                                ) : (
                                    <ProjectDossier
                                        proposal={proposal}
                                        activeConversationId={activeId!}
                                        contract={activeContract}
                                        onCreateContract={handleCreateContract}
                                        onSendContract={handleSendContract}
                                        onRespondContract={handleRespondToContract}
                                        onUpdateContract={handleUpdateContract}
                                        onDeleteContract={handleDeleteContract}
                                        onCreateMilestone={handleCreateMilestone}
                                        onDeleteMilestone={handleDeleteMilestone}
                                        onSubmitMilestone={handleSubmitMilestone}
                                        onApproveMilestone={handleApproveMilestone}
                                        onRejectMilestone={handleRejectMilestone}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile / Tablet Drawer Overlay for Conversation List */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex bg-black/50">
                    <div className="w-80 max-w-[85vw] bg-surface h-full shadow-xl">
                        <ConversationList
                            conversations={conversations}
                            activeId={activeId ?? ""}
                            onSelect={handleSelectConversation}
                            currentUserId={currentUserId}
                            currentUserRole={currentUserRole as UserRole.CLIENT | UserRole.FREELANCER}
                            onUpdateSettings={handleUpdateUserSettings}
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </div>
                    <div
                        className="flex-1 h-full"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                </div>
            )}

            {/* Mobile / Tablet Drawer Overlay for Project Dossier */}
            {isDossierOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
                    <div
                        className="flex-1 h-full"
                        onClick={() => setIsDossierOpen(false)}
                    />
                    <div className="w-80 max-w-[85vw] bg-surface h-full shadow-xl p-4 overflow-y-auto">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => setIsDossierOpen(false)}
                                className="text-body-sm font-semibold p-1 cursor-pointer"
                            >
                                Close ✕
                            </button>
                        </div>
                        {activeConversation && (
                            isLoadingContract ? (
                                <div className="flex py-10 justify-center">
                                    <Loading />
                                </div>
                            ) : (
                                <ProjectDossier
                                    proposal={proposal}
                                    activeConversationId={activeId!}
                                    contract={activeContract}
                                    onCreateContract={handleCreateContract}
                                    onSendContract={handleSendContract}
                                    onRespondContract={handleRespondToContract}
                                    onUpdateContract={handleUpdateContract}
                                    onDeleteContract={handleDeleteContract}
                                    onCreateMilestone={handleCreateMilestone}
                                    onDeleteMilestone={handleDeleteMilestone}
                                    onSubmitMilestone={handleSubmitMilestone}
                                    onApproveMilestone={handleApproveMilestone}
                                    onRejectMilestone={handleRejectMilestone}
                                />
                            )
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}