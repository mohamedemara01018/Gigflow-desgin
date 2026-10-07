import { BASE_URL } from "@/utils/constant.utils";
import {
    TransactionDirection,
    TransactionStatus,
    TransactionType,
} from "@/utils/enums.utils";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface ITransactionUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface ITransactionContract {
    _id: string;
    title: string;
    status: string;
    totalAmount: number;
    type?: string;
}

export interface ITransactionMilestone {
    _id: string;
    title: string;
    amount: number;
    order?: number;
    status?: string;
}

export interface ITransactionPayment {
    _id: string;
    amount: number;
    platformFee?: number;
    freelancerAmount?: number;
    currency?: string;
    method?: string;
    status?: string;
    paidAt?: string | null;
}

export interface ITransaction {
    _id: string;
    type: TransactionType | string;
    status: TransactionStatus | string;
    amount: number;
    currency: string;
    direction: TransactionDirection | string;
    client?: string | ITransactionUser | null;
    freelancer?: string | ITransactionUser | null;
    contract?: string | ITransactionContract | null;
    milestone?: string | ITransactionMilestone | null;
    payment?: string | ITransactionPayment | null;
    stripePaymentIntentId?: string | null;
    stripeChargeId?: string | null;
    stripeTransferId?: string | null;
    stripeRefundId?: string | null;
    description?: string | null;
    failureReason?: string | null;
    completedAt?: string | null;
    failedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// 2. Query Interfaces
// ==========================================
export interface ITransactionQueryParams {
    page?: number;
    limit?: number;
    type?: TransactionType | string;
    status?: TransactionStatus | string;
    direction?: TransactionDirection | string;
    contract?: string;
    milestone?: string;
    payment?: string;
    startDate?: string;
    endDate?: string;
    user?: string;
    client?: string;
    freelancer?: string;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface ITransactionListApiResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
        transactions: ITransaction[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}

export interface ITransactionSingleApiResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
        transaction: ITransaction;
    };
}

// ==========================================
// 4. Transaction Client Service
// ==========================================
export const transactionService = {
    /**
     * Get paginated transactions for current user with optional filters
     */
    getUserTransactions: async (
        params?: ITransactionQueryParams
    ): Promise<ITransactionListApiResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.type) queryParams.append("type", params.type);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.direction) queryParams.append("direction", params.direction);
        if (params?.contract) queryParams.append("contract", params.contract);
        if (params?.milestone) queryParams.append("milestone", params.milestone);
        if (params?.payment) queryParams.append("payment", params.payment);
        if (params?.startDate) queryParams.append("startDate", params.startDate);
        if (params?.endDate) queryParams.append("endDate", params.endDate);

        const url = `${BASE_URL}/api/transactions${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch transactions");
        }

        return data;
    },

    /**
     * Get single transaction details by ID
     */
    getTransactionById: async (
        transactionId: string
    ): Promise<ITransactionSingleApiResponse> => {
        const response = await fetch(`${BASE_URL}/api/transactions/${transactionId}`, {
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch transaction details");
        }

        return data;
    },

    /**
     * Admin: Get all platform transactions with extensive filtering
     */
    getAdminTransactions: async (
        params?: ITransactionQueryParams
    ): Promise<ITransactionListApiResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.type) queryParams.append("type", params.type);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.direction) queryParams.append("direction", params.direction);
        if (params?.contract) queryParams.append("contract", params.contract);
        if (params?.milestone) queryParams.append("milestone", params.milestone);
        if (params?.payment) queryParams.append("payment", params.payment);
        if (params?.startDate) queryParams.append("startDate", params.startDate);
        if (params?.endDate) queryParams.append("endDate", params.endDate);
        if (params?.user) queryParams.append("user", params.user);
        if (params?.client) queryParams.append("client", params.client);
        if (params?.freelancer) queryParams.append("freelancer", params.freelancer);

        const url = `${BASE_URL}/api/transactions/admin${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch admin transactions");
        }

        return data;
    },
};
