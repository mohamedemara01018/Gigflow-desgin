import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interface
export interface IEducation {
    _id: string;
    profile: string | { _id: string; title: string; user: string };
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    startYear?: number;
    endYear?: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

// 2. DTOs
export interface ICreateEducationDto {
    profile: string;
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    startYear?: number;
    endYear?: number;
    description?: string;
}

export type IUpdateEducationDto = Partial<ICreateEducationDto>;

// 3. API Response Interfaces
export interface IEducationListApiResponse {
    message: string;
    data: {
        educations: IEducation[];
    };
}

export interface IEducationSingleApiResponse {
    message: string;
    data: {
        education: IEducation;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 4. Education Service
export const educationService = {
    getAllEducations: async (profileId?: string) => {
        const searchParams = new URLSearchParams();
        if (profileId) {
            searchParams.set("profileId", profileId);
        }

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/api/education${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IEducationListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching education entries"
            );
        }

        return data;
    },

    createEducation: async (payload: ICreateEducationDto) => {
        const response = await fetch(`${BASE_URL}/api/education`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IEducationSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when creating education entry"
            );
        }

        return data;
    },

    editEducation: async (id: string, payload: IUpdateEducationDto) => {
        const response = await fetch(`${BASE_URL}/api/education/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IEducationSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating education entry"
            );
        }

        return data;
    },

    deleteEducation: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/education/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting education entry"
            );
        }

        return data;
    },
};