import { BASE_URL } from "@/utils/constant.utils";
import { ContractStatus, ContractType } from "@/utils/enums.utils";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface IUserRef {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    country?: string | null;
    city?: string | null;
}

export interface IJobRef {
    _id: string;
    title: string;
    description?: string;
    budget?: number;
    status: string;
    type?: string;
}

import { IMilestone } from "./milestone.service";
import { IProposal } from "./proposal.service";

export interface IContract {
    _id: string;
    job: IJobRef | string;
    proposal: string | IProposal;
    client: IUserRef | string;
    freelancer: IUserRef | string;
    type: ContractType | string;
    title: string;
    description?: string | null;
    totalAmount: number;
    startDate?: string | null;
    endDate?: string | null;
    status: ContractStatus | string;
    sentToFreelancer?: boolean;
    sentAt?: string | null;
    clientAcceptedAt?: string | null;
    freelancerAcceptedAt?: string | null;
    rejectedAt?: string | null;
    rejectedBy?: IUserRef | string | null;
    rejectionReason?: string | null;
    completedAt?: string | null;
    cancelledAt?: string | null;
    cancellationReason?: string | null;
    milestones?: IMilestone[];
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// 2. Query Params & DTOs
// ==========================================
export interface IGetContractsQueryParams {
    client?: string;
    freelancer?: string;
    job?: string;
    proposal?: string;
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
}

export interface ICreateContractDto {
    job: string;
    proposal: string;
    client: string;
    freelancer: string;
    type: ContractType | string;
    title: string;
    description?: string;
    totalAmount: number;
    startDate?: string;
    endDate?: string;
    status?: ContractStatus | string;
}

export interface IUpdateContractDto {
    title?: string;
    description?: string;
    totalAmount?: number;
    startDate?: string;
    endDate?: string;
    status?: ContractStatus | string;
    cancellationReason?: string;
}

export interface IRespondContractDto {
    action: "accept" | "reject";
    userId: string;
    rejectionReason?: string;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IContractListApiResponse {
    status: string;
    message: string;
    data: {
        totalContracts: number;
        currentPage: number;
        totalPages: number;
        contracts: IContract[];
    };
}

export interface IContractSingleApiResponse {
    status: string;
    message: string;
    data: {
        contract: IContract;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// ==========================================
// 4. Contract Service
// ==========================================
const API_URL = `${BASE_URL}/api/contract`;

export const contractService = {
    /**
     * Fetch all contracts with optional filters and pagination
     */
    getAllContracts: async (params?: IGetContractsQueryParams): Promise<IContractListApiResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.client) queryParams.append("client", params.client);
        if (params?.freelancer) queryParams.append("freelancer", params.freelancer);
        if (params?.job) queryParams.append("job", params.job);
        if (params?.proposal) queryParams.append("proposal", params.proposal);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.type) queryParams.append("type", params.type);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        const url = `${API_URL}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data: IContractListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch contracts");
        }

        return data;
    },

    /**
     * Alias for getAllContracts
     */
    getContracts: async (params?: IGetContractsQueryParams): Promise<IContractListApiResponse> => {
        return contractService.getAllContracts(params);
    },

    /**
     * Fetch contract details by contract ID
     */
    getContractById: async (id: string): Promise<IContractSingleApiResponse> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data: IContractSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch contract details");
        }

        return data;
    },

    /**
     * Create a new contract
     */
    createContract: async (payload: ICreateContractDto): Promise<IContractSingleApiResponse> => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IContractSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create contract");
        }

        return data;
    },

    /**
     * Accept or reject a contract offer
     */
    respondToContract: async (id: string, payload: IRespondContractDto): Promise<IContractSingleApiResponse> => {
        const response = await fetch(`${API_URL}/${id}/respond`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IContractSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to respond to contract");
        }

        return data;
    },

    /**
     * Update contract fields or status
     */
    updateContract: async (id: string, payload: IUpdateContractDto): Promise<IContractSingleApiResponse> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IContractSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update contract");
        }

        return data;
    },

    /**
     * Send a draft contract to the freelancer for review
     */
    sendContract: async (id: string): Promise<IContractSingleApiResponse> => {
        const response = await fetch(`${API_URL}/${id}/send`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data: IContractSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to send contract");
        }

        return data;
    },

    /**
     * Delete a contract document
     */
    deleteContract: async (id: string): Promise<IDeleteApiResponse> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete contract");
        }

        return data;
    },
};