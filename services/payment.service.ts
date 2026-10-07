import { BASE_URL } from "@/utils/constant.utils";
import { PaymentMethod, PaymentStatus, PaymentType } from "@/utils/enums.utils";
import { ITransaction } from "./transaction.service";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface IPaymentUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface IPaymentContract {
    _id: string;
    title: string;
    status: string;
    totalAmount: number;
    type?: string;
}

export interface IPaymentMilestone {
    _id: string;
    title: string;
    amount: number;
    order?: number;
    status: string;
    dueDate?: string | null;
}

export interface IPayment {
    _id: string;
    contract: string | IPaymentContract;
    milestone?: string | IPaymentMilestone | null;
    client: string | IPaymentUser;
    freelancer: string | IPaymentUser;
    type: PaymentType | string;
    amount: number;
    platformFee: number;
    freelancerAmount: number;
    currency: string;
    status: PaymentStatus | string;
    method: PaymentMethod | string;
    stripePaymentIntentId?: string | null;
    stripeChargeId?: string | null;
    transactionId?: string | null;
    paidAt?: string | null;
    failedAt?: string | null;
    failureReason?: string | null;
    refundAmount?: number | null;
    refundedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// 2. Query & DTO Interfaces
// ==========================================
export interface IPaymentQueryParams {
    page?: number;
    limit?: number;
    status?: PaymentStatus | string;
    type?: PaymentType | string;
    contract?: string;
    milestone?: string;
    startDate?: string;
    endDate?: string;
    clientId?: string;
    freelancerId?: string;
}

export interface IPayMilestoneDto {
    paymentMethodId?: string;
}

export interface ICreateMilestonePaymentDto {
    method?: PaymentMethod | string;
}

export interface IRefundPaymentDto {
    amount?: number;
    reason?: string;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IPayMilestoneResult {
    success: boolean;
    message: string;
    status: string;
    clientSecret?: string;
    paymentId: string;
    requiresAction?: boolean;
}

export interface IPayMilestoneApiResponse {
    status: string;
    success: boolean;
    message: string;
    data: IPayMilestoneResult;
}

export interface IPaymentListApiResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
        payments: IPayment[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}

export interface IPaymentSingleApiResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
        payment: IPayment;
    };
}

export interface IRefundPaymentApiResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
        payment: IPayment;
        transaction?: ITransaction;
        stripeRefundId?: string;
    };
}

// ==========================================
// 4. Payment Client Service
// ==========================================
export const paymentService = {
    /**
     * Get paginated payments with optional status, contract, milestone, date filters
     */
    getPayments: async (params?: IPaymentQueryParams): Promise<IPaymentListApiResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.status) queryParams.append("status", params.status);
        if (params?.type) queryParams.append("type", params.type);
        if (params?.contract) queryParams.append("contract", params.contract);
        if (params?.milestone) queryParams.append("milestone", params.milestone);
        if (params?.startDate) queryParams.append("startDate", params.startDate);
        if (params?.endDate) queryParams.append("endDate", params.endDate);
        if (params?.clientId) queryParams.append("clientId", params.clientId);
        if (params?.freelancerId) queryParams.append("freelancerId", params.freelancerId);

        const url = `${BASE_URL}/api/payments${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const response = await fetch(url, {
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch payments");
        }

        return data;
    },

    /**
     * Get details of a single payment by ID
     */
    getPaymentById: async (paymentId: string): Promise<IPaymentSingleApiResponse> => {
        const response = await fetch(`${BASE_URL}/api/payments/${paymentId}`, {
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch payment details");
        }

        return data;
    },

    /**
     * Initialize / Create a payment record for a milestone (Client only)
     */
    createMilestonePayment: async (
        milestoneId: string,
        payload?: ICreateMilestonePaymentDto
    ): Promise<IPaymentSingleApiResponse> => {
        const response = await fetch(`${BASE_URL}/api/payments/milestone/${milestoneId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload || {}),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to initialize milestone payment");
        }

        return data;
    },

    /**
     * Pay for a milestone using a saved PaymentMethod (Client only)
     */
    payMilestone: async (
        paymentId: string,
        payload?: IPayMilestoneDto
    ): Promise<IPayMilestoneApiResponse> => {
        const response = await fetch(`${BASE_URL}/api/payments/${paymentId}/pay`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload || {}),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to process milestone payment");
        }

        return data;
    },

    /**
     * Refund a paid payment (Client or Admin)
     */
    refundPayment: async (
        paymentId: string,
        payload?: IRefundPaymentDto
    ): Promise<IRefundPaymentApiResponse> => {
        const response = await fetch(`${BASE_URL}/api/payments/${paymentId}/refund`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload || {}),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to execute refund");
        }

        return data;
    },
};