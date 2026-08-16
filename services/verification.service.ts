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

// 2. Individual Verification Request
export interface IVerificationRequest {
    _id: string;
    user: IVerificationUser;
    documentType: DocumentType | string;
    status: VerificationStatus
    submittedAt: string;
    reviewedBy: string | IVerificationUser | null;
    reviewedAt: string | null;
    rejectionReason: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

// 3. Paginated Data Payload
export interface IVerificationRequestsData {
    totalRequests: number;
    currentPage: number;
    totalPages: number;
    requests: IVerificationRequest[];
}

// 4. Complete API Response Wrapper
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
    verificationId: string,
    status: VerificationStatus,
    reviewedBy: string,
    rejectionReason: string,
    notes: string
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
            searchParams.set("page", String(page))
        }

        if (String(limit).trim()) {
            searchParams.set("limit", String(limit))
        }

        const response = await fetch(`${BASE_URL}/api/verifiction?${searchParams}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        const data: IVerificationRequestsApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong ')
        }
        return data;
    },
    createVerification: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/verifiction`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when verification process')
        }
        return data
    },

    getVerificationByUserId: async (userId: string) => {
        const response = await fetch(`${BASE_URL}/api/verifiction/user/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong ')
        }
        return data.data.verification
    },

    reviewVerificationRequest: async ({ verificationId, status, reviewedBy, rejectionReason, notes, }: IReviewVerificationRequestParams) => {
        const response = await fetch(`${BASE_URL}/api/verifiction/${verificationId}/review`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                status, reviewedBy, rejectionReason, notes
            })
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong ')
        }
        return data
    },
    deleteVerificationRequest: async (verificationId: string) => {
        const response = await fetch(`${BASE_URL}/api/verifiction/${verificationId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong ')
        }
        return data
    }
}