import { BASE_URL } from "@/utils/constant.utils";
import { DeliveryDurationUnit, ProposalStatus } from "@/utils/enums.utils";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface IFreelancerRef {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    title?: string;
    bio?: string;
}

export interface IJobRef {
    _id: string;
    title: string;
    budget: number;
    status: string;
    type: string;
    client?: {
        _id?: string;
        firstName: string;
        lastName: string;
    } | string;
}

export interface IEstimatedDuration {
    value: number;
    unit: DeliveryDurationUnit;
}

export interface IProposal {
    _id: string;
    job: IJobRef;
    freelancer: IFreelancerRef;
    coverLetter: string;
    bidAmount: number;
    estimatedDuration: IEstimatedDuration;
    status: ProposalStatus | string;
    clientViewed?: boolean;
    viewedAt?: string | null;
    acceptedAt?: string | null;
    rejectedAt?: string | null;
    withdrawnAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// 2. Query Params & DTOs
// ==========================================
export interface IGetProposalsQueryParams {
    job?: string;
    freelancer?: string;
    client?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface ICreateProposalDto {
    job: string;
    freelancer: string;
    coverLetter: string;
    bidAmount: number;
    estimatedDuration: IEstimatedDuration;
}

export interface IUpdateProposalDto {
    coverLetter?: string;
    bidAmount?: number;
    estimatedDuration?: IEstimatedDuration;
}

export interface IUpdateProposalStatusDto {
    status: ProposalStatus | string;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IProposalListApiResponse {
    status: string;
    message: string;
    data: {
        totalProposals: number;
        currentPage: number;
        totalPages: number;
        proposals: IProposal[];
    };
}

export interface IProposalSingleApiResponse {
    status: string;
    message: string;
    data: {
        proposal: IProposal;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// ==========================================
// 4. Proposal Service
// ==========================================
export const proposalService = {
    getAllProposals: async (params?: IGetProposalsQueryParams) => {
        const queryParams = new URLSearchParams();

        if (params?.job) queryParams.append("job", params.job);
        if (params?.freelancer) queryParams.append("freelancer", params.freelancer);
        if (params?.client) queryParams.append("client", params.client);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/proposal${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IProposalListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching proposals"
            );
        }

        return data;
    },

    getProposalById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/proposal/${id}`, {
            credentials: "include",
        });

        const data: IProposalSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching proposal details"
            );
        }

        return data;
    },

    createProposal: async (payload: ICreateProposalDto) => {
        const response = await fetch(`${BASE_URL}/api/proposal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IProposalSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when submitting proposal"
            );
        }

        return data;
    },

    updateProposal: async (id: string, payload: IUpdateProposalDto) => {
        const response = await fetch(`${BASE_URL}/api/proposal/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IProposalSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating proposal details"
            );
        }

        return data;
    },

    updateProposalStatus: async (id: string, payload: IUpdateProposalStatusDto) => {
        const response = await fetch(`${BASE_URL}/api/proposal/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IProposalSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating proposal status"
            );
        }

        return data;
    },

    deleteProposal: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/proposal/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting proposal"
            );
        }

        return data;
    },
};