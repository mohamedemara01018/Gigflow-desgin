import { BASE_URL } from "@/utils/constant.utils";
import { ContactSupportCategory, ContactSupportStatus } from "@/utils/enums.utils";

// ==========================================
// 1. Enums & Interfaces
// ==========================================


export interface IUserRef {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    role?: string;
}

export interface IContactTicket {
    _id: string;
    user?: IUserRef | string | null;
    fullName: string;
    email: string;
    subject: string;
    category: ContactSupportCategory | string;
    message: string;
    status: ContactSupportStatus | string;
    assignedTo?: IUserRef | string | null;
    repliedAt?: string | null;
    resolvedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

// ==========================================
// 2. Query Params & DTOs
// ==========================================
export interface IGetContactTicketsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: ContactSupportStatus | string;
    category?: ContactSupportCategory | string;
}

export interface ICreateContactTicketDto {
    fullName: string;
    email: string;
    subject: string;
    category?: ContactSupportCategory | string;
    message: string;
    user?: string | null;
}

export interface IUpdateContactTicketDto {
    status?: ContactSupportStatus | string;
    assignedTo?: string | null;
    repliedAt?: string | Date | null;
    resolvedAt?: string | Date | null;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IContactTicketSingleResponse {
    status: string;
    message: string;
    data: {
        ticket: IContactTicket;
    };
}

export interface IContactTicketListResponse {
    status: string;
    message: string;
    data: {
        tickets: IContactTicket[];
        pagination: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
        };
    };
}

export interface IContactTicketDeleteResponse {
    status: string;
    message: string;
    data: null;
}

// ==========================================
// 4. Contact Support Service
// ==========================================
export const contactSupportService = {
    /**
     * Fetch paginated list of support tickets with optional filtering and search
     */
    getAllTickets: async (params?: IGetContactTicketsParams) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.category) queryParams.append("category", params.category);

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/contact-support${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IContactTicketListResponse = await response.json().catch(() => ({
            status: "fail",
            message: "Server returned non-JSON response",
            data: { tickets: [], pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 1 } },
        }));

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch contact support tickets");
        }

        return data;
    },

    /**
     * Get single support ticket details by ID
     */
    getTicketById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/contact-support/${id}`, {
            credentials: "include",
        });

        const data: IContactTicketSingleResponse = await response.json().catch(() => ({
            status: "fail",
            message: "Server returned non-JSON response",
            data: { ticket: {} as IContactTicket },
        }));

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch support ticket details");
        }

        return data;
    },

    /**
     * Submit a new contact support ticket (Public or Authenticated)
     */
    createTicket: async (payload: ICreateContactTicketDto) => {
        const response = await fetch(`${BASE_URL}/api/contact-support`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IContactTicketSingleResponse = await response.json().catch(() => ({
            status: "fail",
            message: "Server returned non-JSON response",
            data: { ticket: {} as IContactTicket },
        }));

        if (!response.ok) {
            throw new Error(data.message || "Failed to submit support ticket");
        }

        return data;
    },

    /**
     * Update support ticket details (status, assigned staff, response dates)
     */
    updateTicket: async (id: string, payload: IUpdateContactTicketDto) => {
        const response = await fetch(`${BASE_URL}/api/contact-support/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IContactTicketSingleResponse = await response.json().catch(() => ({
            status: "fail",
            message: "Server returned non-JSON response",
            data: { ticket: {} as IContactTicket },
        }));

        if (!response.ok) {
            throw new Error(data.message || "Failed to update support ticket");
        }

        return data;
    },

    /**
     * Delete a support ticket
     */
    deleteTicket: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/contact-support/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data: IContactTicketDeleteResponse = await response.json().catch(() => ({
            status: "fail",
            message: "Server returned non-JSON response",
            data: null,
        }));

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete support ticket");
        }

        return data;
    },
};