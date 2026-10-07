import { BASE_URL } from "@/utils/constant.utils";

export interface IReviewUserRef {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    email: string;
    role?: string;
}

export interface IReview {
    _id: string;
    contract: string;
    job: any;
    reviewer: IReviewUserRef;
    reviewee: IReviewUserRef;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateReviewDto {
    contractId: string;
    rating: number;
    comment: string;
}

export interface IReviewSingleResponse {
    status: string;
    message: string;
    data: {
        review: IReview;
    };
}

export interface IReviewListResponse {
    status: string;
    message: string;
    data: {
        reviews: IReview[];
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export const reviewService = {
    /**
     * Submit a review for a completed contract
     */
    createReview: async (payload: ICreateReviewDto): Promise<IReviewSingleResponse> => {
        const response = await fetch(`${BASE_URL}/api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to submit review");
        }

        return data;
    },

    /**
     * Get reviews submitted for a specific contract
     */
    getContractReviews: async (contractId: string): Promise<IReviewListResponse> => {
        const response = await fetch(`${BASE_URL}/api/reviews/contract/${contractId}`, {
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch contract reviews");
        }

        return data;
    },

    /**
     * Get reviews received by a user
     */
    getUserReviews: async (userId: string, page = 1, limit = 10): Promise<IReviewListResponse> => {
        const response = await fetch(`${BASE_URL}/api/reviews/user/${userId}?page=${page}&limit=${limit}`, {
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user reviews");
        }

        return data;
    },
};
