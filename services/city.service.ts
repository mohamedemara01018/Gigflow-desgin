import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interfaces
export interface ICountryRef {
    _id: string;
    name: string;
    code: string;
    flag?: {
        image: string;
        publicId: string;
    };
}

export interface ICity {
    _id: string;
    name: string;
    country: ICountryRef;
    createdAt?: string;
    updatedAt?: string;
}

// 2. Query Params & DTOs
export interface IGetCitiesQueryParams {
    search?: string;
    country?: string;
    page?: number;
    limit?: number;
}

// Params specifically for getCitiesByCountry (omits redundant 'country' field)
export type IGetCitiesByCountryQueryParams = Omit<IGetCitiesQueryParams, "country">;

export interface ICreateCityDto {
    name: string;
    country: string;
}

export type IUpdateCityDto = Partial<ICreateCityDto>;

// 3. API Response Interfaces
export interface IPagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface ICityListApiResponse {
    status: string;
    message: string;
    data: {
        cities: ICity[];
        pagination: IPagination;
    };
}

export interface ICitySingleApiResponse {
    status: string;
    message: string;
    data: {
        city: ICity;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 4. City Service
export const cityService = {
    getAllCities: async (params?: IGetCitiesQueryParams) => {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append("search", params.search);
        if (params?.country) queryParams.append("country", params.country);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/city${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: ICityListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching cities"
            );
        }

        return data;
    },

    getCitiesByCountry: async (countryId: string, params?: IGetCitiesByCountryQueryParams) => {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append("search", params.search);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        // Route targets /api/city/cities/:id where :id maps to countryId
        const url = `${BASE_URL}/api/city/cities/${countryId}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: ICityListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching cities for this country"
            );
        }

        return data;
    },

    getCityById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/city/${id}`, {
            credentials: "include",
        });

        const data: ICitySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching city details"
            );
        }

        return data;
    },

    createCity: async (payload: ICreateCityDto) => {
        const response = await fetch(`${BASE_URL}/api/city`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ICitySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when adding city"
            );
        }

        return data;
    },

    editCity: async (id: string, payload: IUpdateCityDto) => {
        const response = await fetch(`${BASE_URL}/api/city/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ICitySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating city"
            );
        }

        return data;
    },

    deleteCity: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/city/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting city"
            );
        }

        return data;
    },
};