import { BASE_URL } from "@/utils/constant.utils";
import { MessageStatus, MessageType } from "@/utils/enums.utils";
import { IAttachmentItem } from "./attachment.service";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface ISenderRef {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    email?: string;
}

export interface IReplyToRef {
    _id: string;
    content: string | null;
    type: MessageType | string;
    isDeleted?: boolean;
    sender: {
        _id?: string;
        firstName: string;
        lastName: string;
    };
}

export interface IMessage {
    _id: string;
    conversation: string;
    sender: ISenderRef | string;
    type: MessageType | string;
    content: string | null;
    replyTo?: IReplyToRef | string | null;
    status: MessageStatus | string;
    deliveredAt?: string | null;
    attachments?: IAttachmentItem[];
    readAt?: string | null;
    editedAt?: string | null;
    deletedAt?: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// ==========================================
// 2. Query Params & DTOs
// ==========================================
export interface IGetConversationMessagesParams {
    page?: number;
    limit?: number;
}

export interface ISendMessageDto {
    conversationId: string;
    senderId: string;
    content?: string | null;
    replyTo?: string | null;
    type?: MessageType | string;
    /**
     * Files or attachments to upload with this message (up to 5 items)
     */
    attachments?: File[];
}

export interface IEditMessageDto {
    content: string;
    senderId?: string;
}

export interface IDeleteMessageDto {
    senderId?: string;
}

export interface IUpdateMessageStatusDto {
    status: MessageStatus | string;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IMessageSingleResponse {
    status: string;
    message: string;
    data: {
        message: IMessage;
    };
}

export interface IMessageListResponse {
    status: string;
    message: string;
    data: {
        messages: IMessage[];
        pagination: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
        };
    };
}

export interface IMessageDeleteResponse {
    status: string;
    message: string;
    data: null;
}

// ==========================================
// 4. Message Service
// ==========================================
export const messageService = {
    /**
     * Send a new message in a conversation.
     * Handles multipart/form-data when attachments are present.
     */
    sendMessage: async (payload: ISendMessageDto) => {
        let response: Response;

        const hasFiles = payload.attachments && payload.attachments.length > 0;

        if (hasFiles) {
            const formData = new FormData();
            formData.append("conversationId", payload.conversationId);
            formData.append("senderId", payload.senderId);

            if (payload.content) formData.append("content", payload.content);
            if (payload.replyTo) formData.append("replyTo", payload.replyTo);
            if (payload.type) formData.append("type", payload.type);

            payload.attachments?.forEach((file) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileObj = file instanceof File ? file : (file as any).file || file;
                formData.append("attachments", fileObj, fileObj.name);
            });

            response = await fetch(`${BASE_URL}/api/message`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
        } else {
            response = await fetch(`${BASE_URL}/api/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    conversationId: payload.conversationId,
                    senderId: payload.senderId,
                    content: payload.content,
                    replyTo: payload.replyTo,
                    type: payload.type,
                }),
            });
        }

        const data: IMessageSingleResponse = await response.json().catch(() => ({
            success: false,
            message: "Server returned non-JSON response or crashed",
        }));

        if (!response.ok) {
            console.error("Upload Error Response:", data);
            throw new Error(data.message || `Failed to send message (${response.status})`);
        }

        return data;
    },

    /**
     * Get paginated messages for a specific conversation
     */
    getConversationMessages: async (
        conversationId: string,
        params?: IGetConversationMessagesParams
    ) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/message/conversation/${conversationId}${queryString ? `?${queryString}` : ""
            }`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IMessageListResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch messages");
        }

        return data;
    },

    /**
     * Edit an existing message
     */
    editMessage: async (id: string, payload: IEditMessageDto) => {
        const response = await fetch(`${BASE_URL}/api/message/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IMessageSingleResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to edit message");
        }

        return data;
    },

    /**
     * Update message status (e.g., DELIVERED, READ)
     */
    updateMessageStatus: async (
        id: string,
        payload: IUpdateMessageStatusDto
    ) => {
        const response = await fetch(`${BASE_URL}/api/message/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IMessageSingleResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update message status");
        }

        return data;
    },

    /**
     * Soft-delete a message
     */
    deleteMessage: async (id: string, payload?: IDeleteMessageDto) => {
        const response = await fetch(`${BASE_URL}/api/message/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload || {}),
        });

        const data: IMessageDeleteResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete message");
        }

        return data;
    },
};