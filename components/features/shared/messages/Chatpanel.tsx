/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { IConversation } from "@/services/conversation.service";
import { IMessage } from "@/services/message.service";
import { UserRole } from "@/utils/enums.utils";

import ChatHeader from "./chat-panel/ChatHeader";
import MessageThread from "./chat-panel/MessageThread";
import AttachmentPreview from "./chat-panel/AttachmentPreview";
import ChatComposer from "./chat-panel/ChatComposer";

interface ChatPanelProps {
    conversation: IConversation;
    messages: IMessage[];
    onSend: (text: string, files?: File[]) => void | Promise<void>;
    onEditMessage?: (messageId: string, newContent: string) => void | Promise<void>;
    onDeleteMessage?: (messageId: string) => void | Promise<void>;
    onUpdateMessageStatus?: (messageId: string, status: string) => void | Promise<void>;
    currentUserId?: string;
    currentUserRole?: UserRole.CLIENT | UserRole.FREELANCER;
    isLoadingSendMessage: boolean;
    isTyping?: boolean;
    onInputChange?: () => void;
    onToggleSidebar?: () => void;
    onToggleDossier?: () => void;
}

export default function ChatPanel({
    conversation,
    messages,
    onSend,
    onEditMessage,
    onDeleteMessage,
    onUpdateMessageStatus,
    currentUserId,
    currentUserRole,
    isLoadingSendMessage,
    isTyping = false,
    onInputChange,
    onToggleSidebar,
    onToggleDossier,
}: ChatPanelProps) {
    const [draft, setDraft] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        setDraft("");
        setSelectedFile(null);
    }, [conversation._id]);

    const handleDraftChange = (newDraft: string) => {
        setDraft(newDraft);
        if (onInputChange) {
            onInputChange();
        }
    };

    const handleSend = () => {
        if (!draft.trim() && !selectedFile) return;
        onSend(draft.trim(), selectedFile ? [selectedFile] : undefined);
        setDraft("");
        setSelectedFile(null);
    };

    return (

        <section className="card p-0! flex flex-col h-[calc(100dvh-5rem)] max-h-dvh min-h-0 overflow-hidden shrink-0">
            <ChatHeader
                conversation={conversation}
                currentUserRole={currentUserRole}
                isTyping={isTyping}
                onToggleSidebar={onToggleSidebar}
                onToggleDossier={onToggleDossier}
            />

            <MessageThread
                conversation={conversation}
                messages={messages}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                onEditMessage={onEditMessage}
                onDeleteMessage={onDeleteMessage}
                onUpdateMessageStatus={onUpdateMessageStatus}
                isTyping={isTyping}
            />

            {selectedFile && (
                <AttachmentPreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
            )}

            <ChatComposer
                draft={draft}
                setDraft={handleDraftChange}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                onSend={handleSend}
                isLoadingSendMessage={isLoadingSendMessage}
            />
        </section>
    );
}