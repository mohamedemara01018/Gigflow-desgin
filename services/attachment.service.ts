import { BASE_URL } from "@/utils/constant.utils";
import { AttachmentEntityType } from "@/utils/enums.utils";
import { FileSlots } from "@/views/UploadDocumentPage";

interface ICreateAttachment {
    files: FileSlots;
    entityId: string;
    entityType: AttachmentEntityType;
    uploadedBy: string;
}

interface ICreateAttachmentResponse {
    message: string;
    [key: string]: unknown;
}

export const attachmentService = {
    createAttachment: async ({
        files,
        entityId,
        entityType,
        uploadedBy,
    }: ICreateAttachment): Promise<ICreateAttachmentResponse> => {
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