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
    IContract,
    ICreateContractDto,
    IUpdateContractDto,
    IRespondContractDto,
} from "@/services/contract.service";
import ChatPanel from "@/components/features/shared/messages/Chatpanel";
import ConversationList from "@/components/features/shared/messages/Conversationlist";
import ProjectDossier from "@/components/features/shared/messages/Projectdossier";
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
    proposal?: string
}

export default function MessagesPage({
    recipient,
    job,
    proposal
}: MessagesPageProps) {
    const dispatch: AppDispatch = useDispatch();

    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [activeContract, setActiveContract] = useState<IContract | null>(null);
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
        if (!currentUserId) return;

        try {
            setIsLoading(true);

            const listRes = await conversationService.getUserConversations(String(currentUserId));
            let fetchedConversations = listRes.data.conversations;

            if (recipient) {
                const payload: ICreateOrGetConversationDto = {
                    client: currentUserRole === UserRole.CLIENT ? currentUserId : recipient,
                    freelancer: currentUserRole === UserRole.FREELANCER ? currentUserId : recipient,
                    job: job,
                };

                const targetRes = await conversationService.createOrGetConversation(payload);
                const targetConv = targetRes.data.conversation;

                const exists = fetchedConversations.some((c) => c._id === targetConv._id);
                if (!exists) {
                    fetchedConversations = [targetConv, ...fetchedConversations];
                }

                setActiveId(targetConv._id);
            } else if (fetchedConversations.length > 0) {
                setActiveId(fetchedConversations[0]._id);
            }

            setConversations(fetchedConversations);
        } catch (error: any) {
            handleToast(error.message || "Failed to fetch conversations", "error");
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId, currentUserRole, recipient, job, handleToast]);

    useEffect(() => {
        initConversations();
    }, [initConversations]);

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

    // 3. Fetch Contract for Active Conversation
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
                const res = await contractService.getContractById(contractId);
                setActiveContract(res.data.contract);
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

    // 4. Contract Operations (With Role and Active Status Checks)
    const handleCreateContract = async (payload: ICreateContractDto) => {
        if (currentUserRole !== UserRole.CLIENT) {
            handleToast("Unauthorized: Only CLIENT can create contracts.", "error");
            return;
        }

        try {
            setIsLoadingContract(true);
            const res = await contractService.createContract(payload);
            const createdContract = res.data.contract;

            setActiveContract(createdContract);

            // Update local conversation reference if applicable
            setConversations((prev) =>
                prev.map((c) =>
                    c._id === activeId ? { ...c, contract: createdContract._id } : c
                )
            );

            handleToast("Contract created successfully", "success");
        } catch (error: any) {
            handleToast(error.message || "Failed to create contract", "error");
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleRespondToContract = async (id: string, payload: IRespondContractDto) => {
        if (activeContract?.status === ContractStatus.ACTIVE) {
            handleToast("Action restricted: Cannot respond to an active contract.", "error");
            return;
        }

        try {
            setIsLoadingContract(true);
            const res = await contractService.respondToContract(id, payload);
            setActiveContract(res.data.contract);
            handleToast(`Contract ${payload.action}ed successfully`, "success");
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
            setActiveContract(res.data.contract);
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

            // Clear contract reference from local conversation state
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

    // 5. Socket Event Handlers
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

        socket.on("message:received", handleNewMessage);
        socket.on("message:updated", handleMessageEdited);
        socket.on("message:deleted", handleMessageDeleted);
        socket.on("message:status_updated", handleStatusUpdated);
        socket.on("user_typing", handleUserTyping);

        return () => {
            socket.emit("leave_conversation", { conversationId: activeId });
            socket.off("message:received", handleNewMessage);
            socket.off("message:updated", handleMessageEdited);
            socket.off("message:deleted", handleMessageDeleted);
            socket.off("message:status_updated", handleStatusUpdated);
            socket.off("user_typing", handleUserTyping);
        };
    }, [activeId, currentUserId]);

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
                                    <div className="flex h-full min-h-[300px] items-center justify-center border border-border rounded-lg bg-white">
                                        <Loading />
                                    </div>
                                ) : (
                                    <ProjectDossier
                                        proposal={proposal!}
                                        activeConversationId={activeId!}
                                        contract={activeContract}
                                        onCreateContract={handleCreateContract}
                                        onRespondContract={handleRespondToContract}
                                        onUpdateContract={handleUpdateContract}
                                        onDeleteContract={handleDeleteContract}
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
                                className="text-body-sm font-semibold p-1"
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
                                    proposal={proposal!}
                                    activeConversationId={activeId!}

                                    contract={activeContract}
                                    onCreateContract={handleCreateContract}
                                    onRespondContract={handleRespondToContract}
                                    onUpdateContract={handleUpdateContract}
                                    onDeleteContract={handleDeleteContract}
                                />
                            )
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}