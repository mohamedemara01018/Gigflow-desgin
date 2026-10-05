/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from "@/utils/constant.utils";
import { DocumentType, UserRole, VerificationStatus } from "@/utils/enums.utils";

export interface IVerificationUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole | string;
    avatar: string | null;
}

export interface IVerificationRequest {
    _id: string;
    user: IVerificationUser;
    documentType: DocumentType | string;
    status: VerificationStatus;
    submittedAt: string;
    reviewedBy: string | IVerificationUser | null;
    reviewedAt: string | null;
    rejectionReason: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IVerificationRequestsData {
    totalRequests: number;
    currentPage: number;
    totalPages: number;
    requests: IVerificationRequest[];
}

export interface IVerificationRequestsApiResponse {
    status: string;
    message: string;
    data: IVerificationRequestsData;
}

export interface GetAllVerificationParams {
    status: string;
    search: string;
    page: number;
    limit: number;
}

export interface IReviewVerificationRequestParams {
    verificationId: string;
    status: VerificationStatus;
    reviewedBy: string;
    rejectionReason: string;
    notes: string;
}

export const verificationService = {
    getAllVerification: async ({ status, search, page, limit }: GetAllVerificationParams) => {
        const searchParams = new URLSearchParams();
        if (status.trim()) {
            searchParams.set("status", status.trim());
        }

        if (search.trim()) {
            searchParams.set("search", search);
        }

        if (String(page).trim()) {
            searchParams.set("page", String(page));
        }

        if (String(limit).trim()) {
            searchParams.set("limit", String(limit));
        }

        // Fixed typo: /api/verification
        const response = await fetch(`${BASE_URL}/api/verification?${searchParams}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        const data: IVerificationRequestsApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    },

    createVerification: async (formData: any) => {
        // Fixed typo: /api/verification
        const response = await fetch(`${BASE_URL}/api/verification`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong during verification process');
        }
        return data;
    },

    getVerificationByUserId: async (userId: string) => {
        // Fixed typo: /api/verification
        const response = await fetch(`${BASE_URL}/api/verification/user/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data.data.verification;
    },

    reviewVerificationRequest: async ({ verificationId, status, reviewedBy, rejectionReason, notes }: IReviewVerificationRequestParams) => {
        // Fixed typo: /api/verification
        const response = await fetch(`${BASE_URL}/api/verification/${verificationId}/review`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                status, reviewedBy, rejectionReason, notes
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    },

    deleteVerificationRequest: async (verificationId: string) => {
        // Fixed typo: /api/verification
        const response = await fetch(`${BASE_URL}/api/verification/${verificationId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    }
};