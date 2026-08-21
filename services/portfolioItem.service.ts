import { BASE_URL } from "@/utils/constant.utils";
import { PortfolioProjectStatus } from "@/utils/enums.utils";

/* -------------------------------------------------------------------------- */
/*                            Types & Interfaces                              */
/* -------------------------------------------------------------------------- */

export interface ICloudinaryImage {
    image: string | null;
    publicId: string | null;
}

export interface IPortfolioItem {
    _id: string;
    freelancer: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        email?: string;
        title?: string;
        bio?: string;
    };
    title: string;
    description: string;
    thumbnail: ICloudinaryImage;
    images: ICloudinaryImage[];
    technologies: {
        _id: string;
        name: string;
        category?: string;
    }[];
    projectUrl?: string | null;
    githubUrl?: string | null;
    figmaUrl?: string | null;
    role?: string | null;
    completedAt?: string | Date | null;
    status: PortfolioProjectStatus;
    featured: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
}

export interface IGetPortfolioItemsParams {
    freelancer?: string;
    technology?: string;
    featured?: boolean | string;
    status?: PortfolioProjectStatus;
    page?: number;
    limit?: number;
}

/* -------------------------------------------------------------------------- */
/*                          API Response Interfaces                           */
/* -------------------------------------------------------------------------- */

export interface IPortfolioListApiResponse {
    status?: string;
    message: string;
    data: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
        portfolioItems: IPortfolioItem[];
    };
}

export interface IPortfolioSingleApiResponse {
    status?: string;
    message: string;
    data: {
        portfolioItem: IPortfolioItem;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

/* -------------------------------------------------------------------------- */
/*                            Portfolio Item Service                          */
/* -------------------------------------------------------------------------- */

export const portfolioItemService = {
    /**
     * Fetch paginated list of portfolio items with optional filters
     * GET /api/portfolio-item
     */
    getAllPortfolioItems: async (params?: IGetPortfolioItemsParams) => {
        const searchParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.set(key, String(value));
                }
            });
        }

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/api/portfolio-item${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: IPortfolioListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching portfolio items"
            );
        }

        return data;
    },

    /**
     * Create a new portfolio project
     * POST /api/portfolio-item
     */
    createPortfolioItem: async (payload: FormData) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item`, {
            method: "POST",
            credentials: "include",
            body: payload,
        });

        const data: IPortfolioSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when creating portfolio item"
            );
        }

        return data;
    },

    /**
     * Get project details (Auto-increments views counter)
     * GET /api/portfolio-item/:id
     */
    getPortfolioItemById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item/${id}`, {
            credentials: "include",
        });

        const data: IPortfolioSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching the portfolio item"
            );
        }

        return data;
    },

    /**
     * Edit project details
     * PATCH /api/portfolio-item/:id
     */
    editPortfolioItem: async (id: string, payload: Partial<IPortfolioItem> | FormData) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const data: IPortfolioSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when updating portfolio item"
            );
        }

        return data;
    },

    /**
     * Remove portfolio item
     * DELETE /api/portfolio-item/:id
     */
    deletePortfolioItem: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting portfolio item"
            );
        }

        return data;
    },

    /* ------------------------------------------------------------------------ */
    /*                             Thumbnail Endpoints                          */
    /* ------------------------------------------------------------------------ */

    /**
     * Change existing thumbnail image
     * POST /api/portfolio-item/thumbnail/change/:id
     */
    changeThumbnail: async (id: string, payload: FormData) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item/thumbnail/change/${id}`, {
            method: "POST",
            credentials: "include",
            body: payload,
        });

        const data: IPortfolioSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when changing thumbnail"
            );
        }

        return data;
    },

    /**
     * Add new thumbnail image
     * POST /api/portfolio-item/thumbnail/add/:id
     */
    addThumbnail: async (id: string, payload: FormData) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item/thumbnail/add/${id}`, {
            method: "POST",
            credentials: "include",
            body: payload,
        });

        const data: IPortfolioSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when adding thumbnail"
            );
        }

        return data;
    },

    /**
     * Delete thumbnail image
     * POST /api/portfolio-item/thumbnail/delete/:id
     */
    deleteThumbnail: async (id: string, publicId?: string) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item/thumbnail/delete/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ publicId }),
        });

        const data: IPortfolioSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting thumbnail"
            );
        }

        return data;
    },

    /* ------------------------------------------------------------------------ */
    /*                               Gallery Endpoints                          */
    /* ------------------------------------------------------------------------ */

    /**
     * Add image(s) to portfolio gallery
     * POST /api/portfolio-item/images/add/:id
     */
    addImage: async (id: string, payload: FormData) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item/images/add/${id}`, {
            method: "POST",
            credentials: "include",
            body: payload,
        });

        const data: IPortfolioSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when adding gallery images"
            );
        }

        return data;
    },

    /**
     * Delete single gallery image by publicId
     * POST /api/portfolio-item/images/delete/:id
     */
    deleteImage: async (id: string, publicId: string) => {
        const response = await fetch(`${BASE_URL}/api/portfolio-item/images/delete/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ publicId }),
        });

        const data: IPortfolioSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting gallery image"
            );
        }

        return data;
    },
};