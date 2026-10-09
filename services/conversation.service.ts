import { BASE_URL } from "@/utils/constant.utils";
import { ConversationStatus, UserRole } from "@/utils/enums.utils";
import { IProposal } from "./proposal.service";
import { IContract } from "./contract.service";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface IUserRef {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
}

export interface IJobRef {
    _id: string;
    title: string;
    budget: number;
    status: string;
    hourlyRateFrom?: number | null;
    hourlyRateTo?: number | null;
}

export interface IMessageRef {
    _id: string;
    sender: string;
    content: string;
    createdAt: string;
    status?: string;
    attachments?: string[];
}

export interface IConversation {
    _id: string;
    client: IUserRef;
    freelancer: IUserRef;
    job?: IJobRef;
    proposal?: IProposal;
    contract?: IContract;
    lastMessage?: IMessageRef | string | null;
    lastMessageAt?: string;
    clientUnreadCount: number;
    freelancerUnreadCount: number;
    clientPinned: boolean;
    freelancerPinned: boolean;
    clientMuted: boolean;
    freelancerMuted: boolean;
    clientArchived: boolean;
    freelancerArchived: boolean;
    freelancerDeletedAt?: string | null;
    clientDeletedAt?: string | null;
    status: ConversationStatus;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// 2. Query Params & DTOs
// ==========================================
export interface IGetUserConversationsParams {
    page?: number;
    limit?: number;
}

export interface ICreateOrGetConversationDto {
    proposalId?: string;
    proposal?: string;
    client?: string;
    freelancer?: string;
    job?: string;
    contract?: string;
}

export interface IUpdateUserSettingsDto {
    role: UserRole.CLIENT | UserRole.FREELANCER;
    pinned?: boolean;
    muted?: boolean;
    archived?: boolean;
}

export interface IResetUnreadCountDto {
    role: UserRole.CLIENT | UserRole.FREELANCER;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IConversationSingleResponse {
    status: string;
    message: string;
    data: {
        conversation: IConversation;
    };
}

export interface IConversationListResponse {
    status: string;
    message: string;
    data: {
        conversations: IConversation[];
        pagination: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
        };
    };
}

// ==========================================
// 4. Conversation Service
// ==========================================
export const conversationService = {
    /**
     * Create a new conversation or fetch an existing one between client and freelancer (or for a specific proposal)
     */
    createOrGetConversation: async (payload: ICreateOrGetConversationDto) => {
        const response = await fetch(`${BASE_URL}/api/conversation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IConversationSingleResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to retrieve or create conversation"
            );
        }

        return data;
    },

    /**
     * Get paginated conversations for a specific user
     */
    getUserConversations: async (
        userId: string,
        params?: IGetUserConversationsParams
    ) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/conversation/user/${userId}${queryString ? `?${queryString}` : ""
            }`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IConversationListResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to fetch user conversations"
            );
        }

        return data;
    },

    /**
     * Get a single conversation by its ID
     */
    getConversationById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/conversation/${id}`, {
            credentials: "include",
        });

        const data: IConversationSingleResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to fetch conversation details"
            );
        }

        return data;
    },

    /**
     * Update participant settings (pin, mute, archive)
     */
    updateUserSettings: async (id: string, payload: IUpdateUserSettingsDto) => {
        const response = await fetch(`${BASE_URL}/api/conversation/${id}/settings`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IConversationSingleResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to update conversation settings"
            );
        }

        return data;
    },

    /**
     * Reset unread count for either client or freelancer
     */
    resetUnreadCount: async (id: string, payload: IResetUnreadCountDto) => {
        const response = await fetch(`${BASE_URL}/api/conversation/${id}/read`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IConversationSingleResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to reset unread message count"
            );
        }

        return data;
    },

    /**
     * Delete a conversation from inbox (Freelancer can delete only after contract is completed)
     */
    deleteConversation: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/conversation/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete conversation"
            );
        }

        return data;
    },
};