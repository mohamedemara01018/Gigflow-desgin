import { BASE_URL } from "@/utils/constant.utils";
import { AttachmentEntityType } from "@/utils/enums.utils";
import { IUserListItem } from "./user.service";

// Individual Attachment item matching Express schema response
export interface IAttachmentItem {
    _id: string;
    uploadedBy: IUserListItem;
    entityType: AttachmentEntityType;
    entityId: string;
    originalName: string;
    fileName: string;
    url: string;
    publicId: string;
    mimeType: string;
    size: number;
    createdAt: string;
    updatedAt: string;
}

// Data payload containing attachments list and pagination metadata
export interface IAttachmentsData {
    totalAttachments: number;
    currentPage: number;
    totalPages: number;
    attachments: IAttachmentItem[];
}

// Data payload for single attachment response
export interface ISingleAttachmentData {
    attachment: IAttachmentItem;
}

// Data payload for entity attachments response
export interface IEntityAttachmentsData {
    attachments: IAttachmentItem[];
}

// Generic Base Response Wrapper
export interface IApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export type IGetAttachmentsApiResponse = IApiResponse<IAttachmentsData>;
export type IGetEntityAttachmentsApiResponse = IApiResponse<IEntityAttachmentsData>;
export type IGetSingleAttachmentApiResponse = IApiResponse<ISingleAttachmentData>;

// Query parameters for fetching all attachments
export interface IGetAttachmentsQueryParams {
    entityType?: AttachmentEntityType;
    entityId?: string;
    uploadedBy?: string;
    fileType?: string;
    page?: number;
    limit?: number;
}

// Params required for creating attachments
export interface ICreateAttachmentParams {
    files: File[];
    entityId: string;
    entityType: AttachmentEntityType;
    uploadedBy: string;
}

export const attachmentService = {
    /**
     * Fetch paginated attachments with optional filters.
     * Target endpoint: GET /api/attachment
     */
    getAllAttachments: async (queryParams?: IGetAttachmentsQueryParams) => {
        const params = new URLSearchParams();

        if (queryParams?.entityType) params.append("entityType", queryParams.entityType);
        if (queryParams?.entityId) params.append("entityId", queryParams.entityId);
        if (queryParams?.uploadedBy) params.append("uploadedBy", queryParams.uploadedBy);
        if (queryParams?.fileType) params.append("fileType", queryParams.fileType);
        if (queryParams?.page) params.append("page", queryParams.page.toString());
        if (queryParams?.limit) params.append("limit", queryParams.limit.toString());

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const response = await fetch(`${BASE_URL}/api/attachment${queryString}`, {
            credentials: "include",
        });

        const data: IGetAttachmentsApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch attachments.");
        }

        return data;
    },

    /**
     * Fetch all attachments associated with a specific entity (e.g. JOB, PROPOSAL).
     * Target endpoint: GET /api/attachment/entity/:entityType/:entityId
     */
    getEntityAttachments: async ({
        entity,
        entityId,
    }: {
        entity: AttachmentEntityType;
        entityId: string;
    }) => {
        const response = await fetch(
            `${BASE_URL}/api/attachment/entity/${entity}/${entityId}`,
            {
                credentials: "include",
            }
        );

        const data: IGetEntityAttachmentsApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching attachments."
            );
        }

        return data;
    },

    /**
     * Fetch a single attachment by its MongoDB ID.
     * Target endpoint: GET /api/attachment/:id
     */
    getAttachmentById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/attachment/${id}`, {
            credentials: "include",
        });

        const data: IGetSingleAttachmentApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch attachment details.");
        }

        return data;
    },

    /**
     * Create single or multiple attachments via FormData payload.
     * Target endpoint: POST /api/attachment
     */
    createAttachment: async ({
        files,
        entityId,
        entityType,
        uploadedBy,
    }: ICreateAttachmentParams) => {
        const formData = new FormData();

        // Filter out undefined/null slots before sending
        const uploadedFiles = files.filter((file): file is File => Boolean(file));

        // Field key MUST match upload.array("url") on Express Multer middleware
        uploadedFiles.forEach((file) => {
            formData.append("url", file);
        });

        formData.append("entityId", entityId);
        formData.append("entityType", entityType);
        formData.append("uploadedBy", uploadedBy);

        const response = await fetch(`${BASE_URL}/api/attachment`, {
            method: "POST",
            credentials: "include",
            // Content-Type is deliberately omitted to allow browser to calculate boundary
            body: formData,
        });

        const data: IApiResponse<IEntityAttachmentsData> = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong while creating the attachment."
            );
        }

        return data;
    },

    /**
     * Delete attachment record from database and Cloudinary storage.
     * Target endpoint: DELETE /api/attachment/:id
     */
    deleteAttachment: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/attachment/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IApiResponse<null> = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete attachment.");
        }

        return data;
    },
};