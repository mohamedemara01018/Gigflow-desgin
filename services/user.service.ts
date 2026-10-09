/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from "@/utils/constant.utils";
import { UserRole, UserStatus } from "@/utils/enums.utils";
import { ICountry } from "./country.service";
import { ICity } from "./city.service";

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
    country: ICountry | string | null;
    city: ICity | string | null;
    isOnline: boolean;
    lastSeen: string | Date;
    verifiedEmailCode: string | null;
    emailCodeExpiresAt: string | Date | null;
    verifiedPhoneCode: string | null;
    phoneCodeExpiresAt: string | Date | null;
    resetToken: string | null;
    resetTokenExpiresAt: string | Date | null;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isIdentityVerified: boolean;
    twoFactorEnabled: boolean;
    provider: "local" | "google" | string;
    providerId: string | null;
    stripeCustomerId: string | null;
    stripeConnectAccountId: string | null;
    stripeConnectOnboardingComplete: boolean;
    status: UserStatus | string;
    lastLoginAt: string | Date | null;
    refreshTokenVersion: number;
    deletedAt: string | Date | null;
    createdAt: string;
    updatedAt: string;
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

// 4. API Response Wrappers
export interface IGetUsersApiResponse {
    message: string;
    data: IUsersListData;
}

export interface IGetUserByIdApiResponse {
    message: string;
    data: {
        user: IUserListItem;
    };
}

export interface IUpdateUserStatusApiResponse {
    status: string;
    message: string;
    data: {
        user: IUserListItem;
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
        const response = await fetch(`/api/user/me`, {
            credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong while fetching user');
        }

        return data;
    },

    getAllUser: async ({
        search = "",
        role = "",
        status = "",
        isIdentityVerified = "",
    }: {
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
            searchParams.set("isIdentityVerified", isIdentityVerified);
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
        });
        const data: IGetUserByIdApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong when fetching user');
        }

        return data;
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

    updateUserStatus: async (id: string, status: UserStatus | string) => {
        const response = await fetch(`${BASE_URL}/api/user/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ status }),
        });

        const data: IUpdateUserStatusApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update user status");
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
            method: "PUT",
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
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to remove avatar");
        }

        return data;
    },
};