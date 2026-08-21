import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interface
export interface IEmploymentHistory {
    _id: string;
    profile: string | { _id: string; title: string; user: string };
    company: string;
    position: string;
    employmentType?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

// 2. DTOs
export interface ICreateEmploymentDto {
    profile: string;
    company: string;
    position: string;
    employmentType?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
}

export type IUpdateEmploymentDto = Partial<ICreateEmploymentDto>;

// 3. API Response Interfaces
export interface IEmploymentListApiResponse {
    message: string;
    data: {
        employmentHistories: IEmploymentHistory[];
    };
}

export interface IEmploymentSingleApiResponse {
    message: string;
    data: {
        employmentHistory: IEmploymentHistory;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 4. Employment Service
export const employmentHistoryService = {
    getAllEmploymentHistories: async (profileId?: string) => {
        const searchParams = new URLSearchParams();
        if (profileId) {
            searchParams.set("profileId", profileId);
        }

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/api/employment-histroy${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IEmploymentListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching employment histories"
            );
        }

        return data;
    },

    createEmploymentHistory: async (payload: ICreateEmploymentDto) => {
        const response = await fetch(`${BASE_URL}/api/employment-histroy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IEmploymentSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when creating employment history"
            );
        }

        return data;
    },

    editEmploymentHistory: async (id: string, payload: IUpdateEmploymentDto) => {
        const response = await fetch(`${BASE_URL}/api/employment-histroy/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IEmploymentSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating employment history"
            );
        }

        return data;
    },

    deleteEmploymentHistory: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/employment-histroy/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting employment history"
            );
        }

        return data;
    },
};