import { BASE_URL } from "@/utils/constant.utils";
import { ExperienceLevel, JobDuration, JobStatus, JobType, JobVisibility } from "@/utils/enums.utils";

// ==========================================
// 1. Core Data Interfaces
// ==========================================
export interface IClientRef {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
}

export interface ICategoryRef {
    _id: string;
    name: string;
}

export interface IJob {
    _id: string;
    client: IClientRef;
    category: ICategoryRef | string;
    title: string;
    description: string;
    type: JobType | string;
    budget: number;
    hourlyRateFrom?: number | null;
    hourlyRateTo?: number | null;
    duration?: JobDuration | null;
    experienceLevel: ExperienceLevel | string;
    visibility: JobVisibility | string;
    location: string;
    proposalsCount: number;
    invitesCount: number;
    hiresCount: number;
    maxProposals?: number | null;
    status: JobStatus | string;
    featured: boolean;
    paymentVerified: boolean;
    publishedAt: string;
    expiresAt?: string | null;
    closedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// 2. Query Params & DTOs
// ==========================================
export interface IGetJobsQueryParams {
    search?: string;
    category?: string;
    type?: string;
    experienceLevel?: string;
    status?: string;
    minBudget?: number;
    maxBudget?: number;
    client?: string;
    page?: number;
    limit?: number;
}

export interface ICreateJobDto {
    client: string;
    category: string;
    title: string;
    description: string;
    type: JobType | string;
    budget: number;
    hourlyRateFrom?: number | null;
    hourlyRateTo?: number | null;
    duration?: string | null;
    experienceLevel?: ExperienceLevel | string;
    visibility?: JobVisibility | string;
    location?: string;
    maxProposals?: number | null;
    status?: JobStatus | string;
}

export type IUpdateJobDto = Partial<ICreateJobDto>;

// ==========================================
// 3. API Response Interfaces
// ==========================================
export interface IJobListApiResponse {
    status: string;
    message: string;
    data: {
        totalJobs: number;
        currentPage: number;
        totalPages: number;
        jobs: IJob[];
    };
}

export interface IJobSingleApiResponse {
    status: string;
    message: string;
    data: {
        _id: string;
        job: IJob;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// ==========================================
// 4. Job Service
// ==========================================
export const jobService = {
    getAllJobs: async (params?: IGetJobsQueryParams) => {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append("search", params.search);
        if (params?.category) queryParams.append("category", params.category);
        if (params?.type) queryParams.append("type", params.type);
        if (params?.experienceLevel) queryParams.append("experienceLevel", params.experienceLevel);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.minBudget !== undefined) queryParams.append("minBudget", params.minBudget.toString());
        if (params?.maxBudget !== undefined) queryParams.append("maxBudget", params.maxBudget.toString());
        if (params?.client) queryParams.append("client", params.client);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/job${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IJobListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching jobs"
            );
        }

        return data;
    },

    getJobById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/job/${id}`, {
            credentials: "include",
        });

        const data: IJobSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching job details"
            );
        }

        return data;
    },

    createJob: async (payload: ICreateJobDto) => {
        const response = await fetch(`${BASE_URL}/api/job`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IJobSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when posting job"
            );
        }

        return data;
    },

    editJob: async (id: string, payload: IUpdateJobDto) => {
        const response = await fetch(`${BASE_URL}/api/job/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IJobSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating job posting"
            );
        }

        return data;
    },

    deleteJob: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/job/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting job posting"
            );
        }

        return data;
    },
};