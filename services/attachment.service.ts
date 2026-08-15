import { BASE_URL } from "@/utils/constant.utils";
import { AttachmentEntityType } from "@/utils/enums.utils";


// 1. User details embedded in the attachment
export interface IAttachmentUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
}

// 2. Individual Attachment item
export interface IAttachmentItem {
    _id: string;
    uploadedBy: IAttachmentUser;
    entityType: AttachmentEntityType
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

// 3. Data payload containing attachments list and pagination metadata
export interface IAttachmentsData {
    totalAttachments: number;
    currentPage: number;
    totalPages: number;
    attachments: IAttachmentItem[];
}

// 4. API Response Wrapper
export interface IGetAttachmentsApiResponse {
    status: string;
    message: string;
    data: IAttachmentsData;
}

interface ICreateAttachmentParams {
    files: File[];
    entityId: string;
    entityType: AttachmentEntityType;
    uploadedBy: string;
}



export const attachmentService = {

    getEntityAttachments: async ({ entity, entityId }: { entity: AttachmentEntityType, entityId: string }) => {
        const response = await fetch(
            `${BASE_URL}/api/attachment/entity/${entity}/${entityId}`,
            {
                credentials: "include",
            }
        );

        const data: IGetAttachmentsApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching attachments "
            );
        }

        return data;
    },
    createAttachment: async ({
        files,
        entityId,
        entityType,
        uploadedBy,
    }: ICreateAttachmentParams) => {
        const formData = new FormData();

        // Only real, uploaded files — empty slots (unselected front/back)
        // must never reach the server as a stray "undefined" field.
        const uploadedFiles = files.filter((file): file is File => Boolean(file));

        // IMPORTANT: field name must match upload.array("url", 5)
        uploadedFiles.forEach((file) => {
            formData.append("url", file);
        });

        formData.append("entityId", entityId);
        formData.append("entityType", entityType);
        formData.append("uploadedBy", uploadedBy);

        const response = await fetch(`${BASE_URL}/api/attachment`, {
            method: "POST",
            credentials: "include",
            // No Content-Type header: the browser sets the multipart
            // boundary itself. Setting it manually breaks the upload.
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong while creating the attachment.");
        }

        return data;
    },
};