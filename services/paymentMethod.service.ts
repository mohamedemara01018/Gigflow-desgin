import { BASE_URL } from "@/utils/constant.utils";
import { PaymentMethod } from "@/utils/enums.utils";

export interface IPaymentMethodCard {
    brand: string | null;
    last4: string | null;
    expMonth: number | null;
    expYear: number | null;
}

export interface IPaymentMethodUSBankAccount {
    bankName: string | null;
    last4: string | null;
    accountType: "checking" | "savings" | null;
}

export interface IPaymentMethodPayPal {
    payerId: string | null;
    email: string | null;
}

export interface IPaymentMethodItem {
    _id: string;
    user: string;
    stripePaymentMethodId: string;
    type: PaymentMethod | string;
    card?: IPaymentMethodCard;
    usBankAccount?: IPaymentMethodUSBankAccount;
    paypal?: IPaymentMethodPayPal;
    isDefault: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISetupIntentResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
        clientSecret: string;
        setupIntentId: string;
        customerId: string;
    };
}

export interface IPaymentMethodListResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
        paymentMethods: IPaymentMethodItem[];
    };
}

export interface IPaymentMethodSingleResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
        paymentMethod: IPaymentMethodItem;
    };
}

export const paymentMethodService = {
    createSetupIntent: async (): Promise<ISetupIntentResponse> => {
        const response = await fetch(`${BASE_URL}/api/payment-methods/setup-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to initialize payment setup");
        }
        return data;
    },

    getPaymentMethods: async (): Promise<IPaymentMethodListResponse> => {
        const response = await fetch(`${BASE_URL}/api/payment-methods`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch payment methods");
        }
        return data;
    },

    createPaymentMethod: async (
        payload:
            | {
                stripePaymentMethodId?: string;
                setupIntentId?: string;
            }
            | string
    ): Promise<IPaymentMethodSingleResponse> => {
        const bodyPayload =
            typeof payload === "string"
                ? { stripePaymentMethodId: payload }
                : payload;

        const response = await fetch(`${BASE_URL}/api/payment-methods`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(bodyPayload),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to save payment method");
        }
        return data;
    },

    setDefaultPaymentMethod: async (
        id: string
    ): Promise<IPaymentMethodSingleResponse> => {
        const response = await fetch(`${BASE_URL}/api/payment-methods/${id}/default`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to set default payment method");
        }
        return data;
    },

    deletePaymentMethod: async (
        id: string
    ): Promise<{ success: boolean; message: string }> => {
        const response = await fetch(`${BASE_URL}/api/payment-methods/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to delete payment method");
        }
        return data;
    },
};
