import { BASE_URL } from "@/utils/constant.utils";
import { MilestoneStatus } from "@/utils/enums.utils";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface IMilestone {
    _id: string;
    contract: string;
    title: string;
    description?: string | null;
    amount: number;
    order: number;
    dueDate?: string | null;
    status: MilestoneStatus | string;
    submittedAt?: string | null;
    approvedAt?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    completedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// 2. DTOs
// ==========================================
export interface ICreateMilestoneDto {
    contract: string;
    title: string;
    amount: number;
    description?: string;
    order?: number;
    dueDate?: string;
}

export interface IUpdateMilestoneDto {
    title?: string;
    description?: string;
    amount?: number;
    dueDate?: string;
    order?: number;
}

export interface IRejectMilestoneDto {
    rejectionReason: string;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IMilestoneListApiResponse {
    status: string;
    message: string;
    data: {
        milestones: IMilestone[];
    };
}

export interface IMilestoneSingleApiResponse {
    status: string;
    message: string;
    data: {
        milestone: IMilestone;
    };
}

export interface IApproveMilestoneApiResponse {
    status: string;
    message: string;
    data: {
        milestone: IMilestone;
        nextMilestoneActivated?: string | null;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// ==========================================
// 4. Milestone Service
// ==========================================
export const milestoneService = {
    getContractMilestones: async (contractId: string) => {
        const response = await fetch(`${BASE_URL}/api/milestone/contract/${contractId}`, {
            credentials: "include",
        });

        const data: IMilestoneListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching contract milestones"
            );
        }

        return data;
    },

    getMilestoneById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/milestone/${id}`, {
            credentials: "include",
        });

        const data: IMilestoneSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching milestone details"
            );
        }

        return data;
    },

    createMilestone: async (payload: ICreateMilestoneDto) => {
        const response = await fetch(`${BASE_URL}/api/milestone`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IMilestoneSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when creating milestone"
            );
        }

        return data;
    },

    submitMilestone: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/milestone/${id}/submit`, {
            method: "PATCH",
            credentials: "include",
        });

        const data: IMilestoneSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when submitting milestone work"
            );
        }

        return data;
    },

    approveMilestone: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/milestone/${id}/approve`, {
            method: "PATCH",
            credentials: "include",
        });

        const data: IApproveMilestoneApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when approving milestone"
            );
        }

        return data;
    },

    rejectMilestone: async (id: string, payload: IRejectMilestoneDto) => {
        const response = await fetch(`${BASE_URL}/api/milestone/${id}/reject`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IMilestoneSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when rejecting milestone"
            );
        }

        return data;
    },

    updateMilestone: async (id: string, payload: IUpdateMilestoneDto) => {
        const response = await fetch(`${BASE_URL}/api/milestone/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IMilestoneSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating milestone"
            );
        }

        return data;
    },

    deleteMilestone: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/milestone/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting milestone"
            );
        }

        return data;
    },
};