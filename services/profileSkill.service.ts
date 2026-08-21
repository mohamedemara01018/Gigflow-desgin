import { BASE_URL } from "@/utils/constant.utils";
import { SkillLevel } from "@/utils/enums.utils";

// 1. Skill Level Enum matching backend SkillLevel


// 2. Core Data Interface
export interface IProfileSkill {
    _id: string;
    profile: string | { _id: string; title?: string; user?: string };
    skill: string | { _id: string; name: string; slug: string; category?: string; icon?: string | null };
    level: SkillLevel;
    yearsOfExperience: number;
    isPrimary: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// 3. Query Params Interface
export interface IGetProfileSkillsParams {
    profileId?: string;
    skillId?: string;
    level?: SkillLevel;
    isPrimary?: boolean;
}

// 4. DTOs
export interface ICreateProfileSkillDto {
        profile: string;
        skill: string;
        level?: SkillLevel;
        yearsOfExperience?: number;
        isPrimary?: boolean;
}

export type IUpdateProfileSkillDto = Partial<Omit<ICreateProfileSkillDto, "profile" | "skill">>;

// 5. API Response Interfaces
export interface IProfileSkillListApiResponse {
    message: string;
    data: {
        profileSkills: IProfileSkill[];
    };
}

export interface IProfileSkillSingleApiResponse {
    message: string;
    data: {
        profileSkill: IProfileSkill;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 6. ProfileSkill Service
export const profileSkillService = {
    getProfileSkills: async (params?: IGetProfileSkillsParams) => {
        const searchParams = new URLSearchParams();

        if (params?.profileId) {
            searchParams.set("profileId", params.profileId);
        }

        if (params?.skillId) {
            searchParams.set("skillId", params.skillId);
        }

        if (params?.level) {
            searchParams.set("level", params.level);
        }

        if (params?.isPrimary !== undefined) {
            searchParams.set("isPrimary", String(params.isPrimary));
        }

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/api/profile-skill${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IProfileSkillListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching profile skills"
            );
        }

        return data;
    },

    getProfileSkillById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/profile-skill/${id}`, {
            credentials: "include",
        });

        const data: IProfileSkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching profile skill details"
            );
        }

        return data;
    },

    createProfileSkill: async (payload: ICreateProfileSkillDto) => {
        const response = await fetch(`${BASE_URL}/api/profile-skill`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IProfileSkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when adding skill to profile"
            );
        }

        return data;
    },

    editProfileSkill: async (id: string, payload: IUpdateProfileSkillDto) => {
        const response = await fetch(`${BASE_URL}/api/profile-skill/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IProfileSkillSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating profile skill"
            );
        }

        return data;
    },

    deleteProfileSkill: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/profile-skill/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when removing skill from profile"
            );
        }

        return data;
    },
};