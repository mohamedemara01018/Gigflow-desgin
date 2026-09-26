import { BASE_URL } from "@/utils/constant.utils";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface ISavedJobPopulated {
    _id: string;
    title: string;
    budget?: number;
    type?: string;
    location?: string;
    status?: string;
    client?: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    category?: {
        _id: string;
        name: string;
        slug: string;
    };
}

export interface ISavedJobItem {
    _id: string;
    user: string;
    job: ISavedJobPopulated;
    createdAt: string;
    updatedAt: string;
}

// ==========================================
// 2. Query Params & DTOs
// ==========================================
export interface IGetSavedJobsQueryParams {
    user: string;
    page?: number;
    limit?: number;
}

export interface IIsJobSavedQueryParams {
    user: string;
    job: string;
}

export interface ISaveJobDto {
    user: string;
    job: string;
}

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface ISavedJobListApiResponse {
    status: string;
    message: string;
    data: {
        totalSavedJobs: number;
        currentPage: number;
        totalPages: number;
        savedJobs: ISavedJobItem[];
    };
}

export interface IIsJobSavedApiResponse {
    status: string;
    message: string;
    data: {
        isSaved: boolean;
        savedJobId: string | null;
    };
}

export interface ISavedJobSingleApiResponse {
    status: string;
    message: string;
    data: {
        savedJob: ISavedJobItem;
    };
}

export interface IToggleSaveJobApiResponse {
    status: string;
    message: string;
    data: {
        isSaved: boolean;
        savedJob?: ISavedJobItem;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// ==========================================
// 4. Saved Job Service
// ==========================================
export const savedJobService = {
    getUserSavedJobs: async (params: IGetSavedJobsQueryParams) => {
        const queryParams = new URLSearchParams();

        if (params?.user) queryParams.append("user", params.user);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/save-job${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: ISavedJobListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching saved jobs"
            );
        }

        return data;
    },

    isJobSaved: async (params: IIsJobSavedQueryParams) => {
        const queryParams = new URLSearchParams();

        if (params?.user) queryParams.append("user", params.user);
        if (params?.job) queryParams.append("job", params.job);

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/save-job/check${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IIsJobSavedApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when checking saved job status"
            );
        }

        return data;
    },

    saveJob: async (payload: ISaveJobDto) => {
        const response = await fetch(`${BASE_URL}/api/save-job`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ISavedJobSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when saving job"
            );
        }

        return data;
    },

    toggleSaveJob: async (payload: ISaveJobDto) => {
        const response = await fetch(`${BASE_URL}/api/save-job/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IToggleSaveJobApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when toggling saved job status"
            );
        }

        return data;
    },

    unsaveJob: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/save-job/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when removing saved job"
            );
        }

        return data;
    },
};