import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interface
export interface ISkill {
    _id: string;
    name: string;
    slug: string;
    category?: string | { _id: string; name: string; description?: string } | null;
    description?: string;
    icon?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// 2. Query Params Interface
export interface IGetAllSkillsParams {
    search?: string;
    categoryId?: string;
}

// 3. DTOs
export interface ICreateSkillDto {
    name: string;
    slug?: string;
    category?: string | null;
    description?: string;
    icon?: string | null;
}

export type IUpdateSkillDto = Partial<ICreateSkillDto>;

// 4. API Response Interfaces
export interface ISkillListApiResponse {
    message: string;
    data: {
        skills: ISkill[];
    };
}

export interface ISkillSingleApiResponse {
    message: string;
    data: {
        skill: ISkill;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 5. Skill Service
export const skillService = {
    getAllSkills: async (params?: IGetAllSkillsParams) => {
        const searchParams = new URLSearchParams();

        if (params?.search?.trim()) {
            searchParams.set("search", params.search.trim());
        }

        if (params?.categoryId) {
            searchParams.set("categoryId", params.categoryId);
        }

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/api/skill${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: ISkillListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching skills"
            );
        }

        return data;
    },

    getSkillById: async (idOrSlug: string) => {
        const response = await fetch(`${BASE_URL}/api/skill/${idOrSlug}`, {
            credentials: "include",
        });

        const data: ISkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching skill details"
            );
        }

        return data;
    },

    createSkill: async (payload: ICreateSkillDto) => {
        const response = await fetch(`${BASE_URL}/api/skill`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ISkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when creating skill"
            );
        }

        return data;
    },

    editSkill: async (id: string, payload: IUpdateSkillDto) => {
        const response = await fetch(`${BASE_URL}/api/skill/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ISkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating skill"
            );
        }

        return data;
    },

    deleteSkill: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/skill/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting skill"
            );
        }

        return data;
    },
};