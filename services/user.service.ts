/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from "@/utils/constant.utils";
import { UserRole, UserStatus } from "@/utils/enums.utils";

// 1. Individual User Item
export interface IUserListItem {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole | string;
    avatar: string | null;
    public_id: string | null;
    phone: string | null;
    country: string | null;
    city: string | null;
    verifiedEmailCode: string | null;
    emailCodeExpiresAt?: string | null;
    verifiedPhoneCode: string | null;
    resetTokenExpiresAt: string | null;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isIdentityVerified: boolean;
    twoFactorEnabled: boolean;
    provider: "local" | "google" | string;
    providerId: string | null;
    status: UserStatus | string;
    refreshTokenVersion: number;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string | null;
}

// 2. Pagination Metadata
export interface IPagination {
    pageNumber: number;
    pageSize: number;
    totalUsers: number;
    totalPages: number;
}

// 3. Payload Data
export interface IUsersListData {
    users: IUserListItem[];
    pagination: IPagination;
}

// 4. API Response Wrapper
export interface IGetUsersApiResponse {
    message: string;
    data: IUsersListData;
}


export interface IGetUserByIdApiResponse {
    message: string;
    data: {
        user: IUserListItem
    };
}

export interface GetAllUserParams {
    search: string;
    role: string;
    status: string;
    isIdentityVerified: string;
}


export const userService = {
    me: async () => {
        const response = await fetch(`${BASE_URL}/api/user/user/me`, {
            credentials: 'include',
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when register')
        }

        return data
    },

    getAllUser: async ({ search = "", role = "", status = "", isIdentityVerified = "", }: {
        search?: string;
        role?: string;
        status?: string;
        isIdentityVerified?: string;
    }) => {
        const searchParams = new URLSearchParams();
        if (search.trim()) {
            searchParams.set("search", search.trim());
        }

        if (role) {
            searchParams.set("role", role);
        }

        if (status) {
            searchParams.set("status", status);
        }

        if (isIdentityVerified !== "") {
            searchParams.set(
                "isIdentityVerified",
                isIdentityVerified
            );
        }

        const response = await fetch(
            `${BASE_URL}/api/user?${searchParams.toString()}`,
            {
                credentials: "include",
            }
        );

        const data: IGetUsersApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching users"
            );
        }

        return data;
    },
    getUserById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/user/${id}`, {
            credentials: 'include',
        })
        const data: IGetUserByIdApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'something went wrong when get user')
        }

        return data
    },
    updateUser: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/user/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data: IGetUserByIdApiResponse = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to update user profile");
        }

        return data;
    },
    changePassword: async (formData: any) => {
        const response = await fetch(`${BASE_URL}/api/user/change-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data: { message: string } = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to change password");
        }

        return data;
    },
    changeAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(`${BASE_URL}/api/user/image/change`, {
            method: "PUT", // or "PATCH" depending on your route design
            credentials: "include",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update profile image");
        }

        return data;
    },
    removeAvatar: async () => {
        const response = await fetch(`${BASE_URL}/api/user/image/remove`, {
            method: "DELETE",
            credentials: "include", // Ensures auth token cookies are sent
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to remove avatar");
        }

        return data;
    }

}