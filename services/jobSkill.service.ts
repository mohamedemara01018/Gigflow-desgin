import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interface
export interface IJobSkill {
    _id: string;
    job: string | { _id: string; title?: string; client?: string; status?: string; type?: string; budget?: number };
    skill: string | { _id: string; name: string; slug: string; category?: string; icon?: string | null };
    isRequired: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// 2. Query Params Interface
export interface IGetJobSkillsParams {
    jobId?: string;
    skillId?: string;
    isRequired?: boolean;
}

// 3. DTOs
export interface ICreateJobSkillDto {
    job: string;
    skill: string;
    isRequired?: boolean;
}

export type IUpdateJobSkillDto = Partial<Omit<ICreateJobSkillDto, "job" | "skill">>;

// 4. API Response Interfaces
export interface IJobSkillListApiResponse {
    message: string;
    data: {
        jobSkills: IJobSkill[];
    };
}

export interface IJobSkillSingleApiResponse {
    message: string;
    data: {
        jobSkill: IJobSkill;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 5. JobSkill Service
export const jobSkillService = {
    getJobSkills: async (params?: IGetJobSkillsParams) => {
        const searchParams = new URLSearchParams();

        if (params?.jobId) {
            searchParams.set("jobId", params.jobId);
        }

        if (params?.skillId) {
            searchParams.set("skillId", params.skillId);
        }

        if (params?.isRequired !== undefined) {
            searchParams.set("isRequired", String(params.isRequired));
        }

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/api/job-skill${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IJobSkillListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching job skills"
            );
        }

        return data;
    },

    getJobSkillById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/job-skill/${id}`, {
            credentials: "include",
        });

        const data: IJobSkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching job skill details"
            );
        }

        return data;
    },

    createJobSkill: async (payload: ICreateJobSkillDto) => {
        const response = await fetch(`${BASE_URL}/api/job-skill`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IJobSkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when adding skill to job"
            );
        }

        return data;
    },

    editJobSkill: async (id: string, payload: IUpdateJobSkillDto) => {
        const response = await fetch(`${BASE_URL}/api/job-skill/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IJobSkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating job skill"
            );
        }

        return data;
    },

    deleteJobSkill: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/job-skill/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when removing skill from job"
            );
        }

        return data;
    },
};