import { BASE_URL } from "@/utils/constant.utils";
import { PaymentMethod, PaymentStatus, PaymentType } from "@/utils/enums.utils";

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
}

export interface IPaymentMilestone {
    _id: string;
    title: string;
    amount: number;
    status: string;
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
    paidAt?: string | null;
    refundAmount?: number | null;
    refundedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// 2. DTOs
// ==========================================
export interface ICreatePaymentDto {
    contractId: string;
    type: PaymentType | string;
    method: PaymentMethod | string;
    milestoneId?: string;
}

export interface IProcessPaymentDto {
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
}

export interface IRefundPaymentDto {
    refundAmount?: number;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IPaymentListApiResponse {
    status: string;
    message: string;
    data: {
        payments: IPayment[];
    };
}

export interface IPaymentSingleApiResponse {
    status: string;
    message: string;
    data: {
        payment: IPayment;
    };
}

// ==========================================
// 4. Payment Service
// ==========================================
export const paymentService = {
    getAllPayments: async () => {
        const response = await fetch(`${BASE_URL}/api/payment`, {
            credentials: "include",
        });

        const data: IPaymentListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching payments history"
            );
        }

        return data;
    },

    getPaymentById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/payment/${id}`, {
            credentials: "include",
        });

        const data: IPaymentSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching payment details"
            );
        }

        return data;
    },

    getPaymentsByContract: async (contractId: string) => {
        const response = await fetch(`${BASE_URL}/api/payment/contract/${contractId}`, {
            credentials: "include",
        });

        const data: IPaymentListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching contract payments"
            );
        }

        return data;
    },

    createPayment: async (payload: ICreatePaymentDto) => {
        const response = await fetch(`${BASE_URL}/api/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IPaymentSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when initiating payment"
            );
        }

        return data;
    },

    processPayment: async (id: string, payload?: IProcessPaymentDto) => {
        const response = await fetch(`${BASE_URL}/api/payment/${id}/process`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload || {}),
        });

        const data: IPaymentSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when processing payment"
            );
        }

        return data;
    },

    refundPayment: async (id: string, payload?: IRefundPaymentDto) => {
        const response = await fetch(`${BASE_URL}/api/payment/${id}/refund`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload || {}),
        });

        const data: IPaymentSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when executing payment refund"
            );
        }

        return data;
    },
};