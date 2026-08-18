import { BASE_URL } from "@/utils/constant.utils";
import { AvailabilityStatus, ExperienceLevel, ProfileVisibility } from "@/utils/enums.utils";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
}

export interface ISocialLinks {
    website: string;
    github: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    portfolio: string;
}

export interface IProfile {
    _id: string;
    user: IUser;
    title: string;
    bio: string;
    overview: string;
    hourlyRate: number;
    experienceLevel: ExperienceLevel;
    availability: AvailabilityStatus;
    responseTime: number;
    completedJobs: number;
    totalHours: number;
    totalEarnings: number;
    totalReviews: number;
    averageRating: number;
    successScore: number;
    socialLinks: ISocialLinks;
    isProfileCompleted: boolean;
    profileViews: number;
    visibility: ProfileVisibility;
    createdAt: string;
    updatedAt: string;
}

export type UpdateProfilePayload = Partial<
    Pick<
        IProfile,
        "title" | "bio" | "overview" | "hourlyRate" | "experienceLevel" | "availability" | "visibility"
    >
>;

export interface IProfilesApiResponse {
    message: string;
    data: {
        profiles: IProfile[];
    };
}

export interface IUserProfilesApiResponse {
    message: string;
    data: {
        profile: IProfile;
    };
}

export const profileService = {
    getAllProfiles: async () => {
        const response = await fetch(`${BASE_URL}/api/profile`, {
            credentials: "include",
        });

        const data: IProfilesApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong when fetching profiles");
        }

        return data;
    },
    getUserProfileById: async (userId: string) => {
        const response = await fetch(`${BASE_URL}/api/profile/user-profile/${userId}`, {
            credentials: "include",
        });

        const data: IUserProfilesApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong when fetching user profile");
        }

        return data;
    },
    updateProfile: async (payload: UpdateProfilePayload, id: string) => {
        const response = await fetch(`${BASE_URL}/api/profile/${id}`, {
            method: "PATCH", // Change to "PUT" if required by your backend
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IUserProfilesApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update profile");
        }

        return data;
    },
};