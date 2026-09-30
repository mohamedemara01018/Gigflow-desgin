import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interfaces
export interface ICountryRef {
    _id: string;
    name: string;
    code?: string;
}

export interface ICityRef {
    _id: string;
    name: string;
}

export interface IClientLocation {
    country?: ICountryRef | string | null;
    city?: ICityRef | string | null;
}



export interface IClientStats {
    _id: string;
    client: string;
    paymentVerified: boolean;
    hireRate: number;
    rating: number;
    totalReviews: number;
    totalSpent: number;
    totalJobsPosted: number;
    totalJobsHired: number;
    createdAt?: string;
    updatedAt?: string;
}

// 2. Query Params & DTOs
export interface IGetClientStatsQueryParams {
    populate?: boolean;
}

export interface IUpdateClientStatsDto {
    paymentVerified?: boolean;
    rating?: number;
    totalReviews?: number;
    totalSpent?: number;
}

// 3. API Response Interfaces
export interface IClientStatsSingleApiResponse {
    status: string;
    message?: string;
    data: {
        stats: IClientStats;
        location?: IClientLocation;
    };
}

// 4. Client Stats Service
export const clientStatsService = {
    /**
     * Get or initialize stats for a specific client by User ID
     */
    getClientStats: async (
        clientId: string,
        params?: IGetClientStatsQueryParams
    ): Promise<IClientStatsSingleApiResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.populate !== undefined) {
            queryParams.append("populate", params.populate.toString());
        }

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/client-stats/${clientId}${queryString ? `?${queryString}` : ""
            }`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data: IClientStatsSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching client stats"
            );
        }

        return data;
    },
};