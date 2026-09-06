import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interfaces
export interface ICountryFlag {
    image: string;
    publicId: string;
}

export interface ICountry {
    _id: string;
    name: string;
    code: string;
    dialCode?: string | null;
    flag: ICountryFlag;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// 2. Query Params & DTOs
export interface IGetCountriesQueryParams {
    search?: string;
    page?: number;
    limit?: number;
    isActive?: boolean | string;
}

export interface ICreateCountryDto {
    name: string;
    code: string;
    dialCode?: string;
    isActive?: boolean;
    flag: File;
}

export interface IUpdateCountryDto {
    name?: string;
    code?: string;
    dialCode?: string;
    isActive?: boolean;
    flag?: File;
}

// 3. API Response Interfaces
export interface IPagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface ICountryListApiResponse {
    status: string;
    message: string;
    data: {
        countries: ICountry[];
        pagination: IPagination;
    };
}

export interface ICountrySingleApiResponse {
    status: string;
    message: string;
    data: {
        country: ICountry;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

const buildCountryFormData = (
    payload: ICreateCountryDto | IUpdateCountryDto
): FormData => {
    const formData = new FormData();

    if (payload.name !== undefined) formData.append("name", payload.name);
    if (payload.code !== undefined) formData.append("code", payload.code);
    if (payload.dialCode !== undefined) formData.append("dialCode", payload.dialCode);
    if (payload.isActive !== undefined) formData.append("isActive", String(payload.isActive));

    // Change "file" to "flag" to match upload.single("flag")
    if (payload.flag) formData.append("flag", payload.flag);

    return formData;
};

// 4. Country Service
export const countryService = {
    getAllCountries: async (params?: IGetCountriesQueryParams) => {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append("search", params.search);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.isActive !== undefined) queryParams.append("isActive", String(params.isActive));

        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/country${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: ICountryListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching countries"
            );
        }

        return data;
    },

    getCountryById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/country/${id}`, {
            credentials: "include",
        });

        const data: ICountrySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching country details"
            );
        }

        return data;
    },

    createCountry: async (payload: ICreateCountryDto) => {
        const formData = buildCountryFormData(payload);

        const response = await fetch(`${BASE_URL}/api/country`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        const data: ICountrySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when adding country"
            );
        }

        return data;
    },

    editCountry: async (id: string, payload: IUpdateCountryDto) => {
        const formData = buildCountryFormData(payload);

        const response = await fetch(`${BASE_URL}/api/country/${id}`, {
            method: "PATCH",
            credentials: "include",
            body: formData,
        });

        const data: ICountrySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating country"
            );
        }

        return data;
    },

    deleteCountry: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/country/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting country"
            );
        }

        return data;
    },
};