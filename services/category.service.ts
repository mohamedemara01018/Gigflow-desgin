import { BASE_URL } from "@/utils/constant.utils";

// 1. Core Data Interface
export interface ICategory {
    _id: string;
    name: string;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// 2. Query Params Interface
export interface IGetAllCategoriesParams {
    search?: string;
    page?: number;
    limit?: number;
}

// 3. DTOs
export interface ICreateCategoryDto {
    name: string;
    description?: string;
}

export type IUpdateCategoryDto = Partial<ICreateCategoryDto>;

// 4. API Response Interfaces
export interface ICategoryListApiResponse {
    message: string;
    data: {
        categories: ICategory[];
        total?: number;
    };
}

export interface ICategorySingleApiResponse {
    message: string;
    data: {
        category: ICategory;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 5. Category Service
export const categoryService = {
    getAllCategories: async (params?: IGetAllCategoriesParams) => {
        const searchParams = new URLSearchParams();

        if (params?.search?.trim()) {
            searchParams.set("search", params.search.trim());
        }

        if (params?.page) {
            searchParams.set("page", params.page.toString());
        }

        if (params?.limit) {
            searchParams.set("limit", params.limit.toString());
        }

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/api/category${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: ICategoryListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching categories"
            );
        }

        return data;
    },

    getCategoryById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/category/${id}`, {
            credentials: "include",
        });

        const data: ICategorySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching category details"
            );
        }

        return data;
    },

    createCategory: async (payload: ICreateCategoryDto) => {
        const response = await fetch(`${BASE_URL}/api/category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ICategorySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when creating category"
            );
        }

        return data;
    },

    editCategory: async (id: string, payload: IUpdateCategoryDto) => {
        const response = await fetch(`${BASE_URL}/api/category/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: ICategorySingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating category"
            );
        }

        return data;
    },

    deleteCategory: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/category/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting category"
            );
        }

        return data;
    },
};