import { BASE_URL } from "@/utils/constant.utils";
import { LanguageLevel } from "@/utils/enums.utils";

// 1. Language Level Enum


// 2. Core Data Interface
export interface ILanguage {
    _id: string;
    profile: string | { _id: string; title?: string; user?: string };
    name: string;
    level: LanguageLevel;
    createdAt?: string;
    updatedAt?: string;
}

// 3. DTOs
export interface ICreateLanguageDto {
    profile: string;
    name: string;
    level: LanguageLevel;
}

export type IUpdateLanguageDto = Partial<Omit<ICreateLanguageDto, "profile">>;

// 4. API Response Interfaces
export interface ILanguageListApiResponse {
    message: string;
    data: {
        languages: ILanguage[];
    };
}

export interface ILanguageSingleApiResponse {
    message: string;
    data: {
        language: ILanguage;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 5. Language Service
export const languageService = {
    getAllLanguages: async (profileId?: string) => {
        const url = `${BASE_URL}/api/language${profileId ? `?profileId=${profileId}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: ILanguageListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching languages"
            );
        }

        return data;
    },

    createLanguage: async (payload: ICreateLanguageDto) => {
        const response = await fetch(`${BASE_URL}/api/language`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ILanguageSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when adding language"
            );
        }

        return data;
    },

    editLanguage: async (id: string, payload: IUpdateLanguageDto) => {
        const response = await fetch(`${BASE_URL}/api/language/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ILanguageSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating language"
            );
        }

        return data;
    },

    deleteLanguage: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/language/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting language"
            );
        }

        return data;
    },
};