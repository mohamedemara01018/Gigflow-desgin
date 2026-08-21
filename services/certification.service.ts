import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interface
export interface ICertification {
    _id: string;
    profile: string | { _id: string; title?: string; user?: string };
    name: string;
    issuer?: string;
    issueDate?: string | Date;
    expirationDate?: string | Date;
    credentialId?: string;
    credentialUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

// 2. DTOs
export interface ICreateCertificationDto {
    profile: string;
    name: string;
    issuer?: string;
    issueDate?: string | Date;
    expirationDate?: string | Date;
    credentialId?: string;
    credentialUrl?: string;
}

export type IUpdateCertificationDto = Partial<Omit<ICreateCertificationDto, "profile">>;

// 3. API Response Interfaces
export interface ICertificationListApiResponse {
    message: string;
    data: {
        certifications: ICertification[];
    };
}

export interface ICertificationSingleApiResponse {
    message: string;
    data: {
        certification: ICertification;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 4. Certification Service
export const certificationService = {
    getAllCertifications: async (profileId?: string) => {
        const url = `${BASE_URL}/api/certification${profileId ? `?profileId=${profileId}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: ICertificationListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching certifications"
            );
        }

        return data;
    },

    createCertification: async (payload: ICreateCertificationDto) => {
        const response = await fetch(`${BASE_URL}/api/certification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ICertificationSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when adding certification"
            );
        }

        return data;
    },

    editCertification: async (id: string, payload: IUpdateCertificationDto) => {
        const response = await fetch(`${BASE_URL}/api/certification/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ICertificationSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating certification"
            );
        }

        return data;
    },

    deleteCertification: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/certification/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting certification"
            );
        }

        return data;
    },
};