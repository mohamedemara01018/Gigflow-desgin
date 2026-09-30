import { formatBytes, formatDateTime } from "@/utils/functions.utils";
import { Download, Eye, HdIcon } from "lucide-react";
import { IAttachmentItem } from "@/services/attachment.service";

function AttachmentRow({
    attachment,
    dense = false,
}: {
    attachment: IAttachmentItem;
    dense?: boolean;
}) {
    const fileName = attachment.originalName || attachment.fileName || "Attachment";
    const uploadedAt = attachment.createdAt ? formatDateTime(attachment.createdAt).date : "";

    return (
        <div
            className={`flex items-center gap-3 border border-outline-variant rounded-md bg-surface-container-highest ${dense ? "px-3 py-2" : "p-3"
                }`}
        >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary-container/15 text-primary shrink-0">
                <HdIcon size={14} />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-body-sm text-on-surface truncate">{fileName}</p>
                <p className="text-label-sm text-on-surface-variant truncate">
                    {formatBytes(attachment.size)}
                    {uploadedAt && ` · ${uploadedAt}`}
                </p>
            </div>
            {!dense && attachment.url && (
                <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Preview ${fileName}`}
                    className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shrink-0"
                >
                    <Eye size={15} />
                </a>
            )}
            {attachment.url && (
                <a
                    href={attachment.url}
                    download={fileName}
                    aria-label={`Download ${fileName}`}
                    className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shrink-0"
                >
                    <Download size={15} />
                </a>
            )}
        </div>
    );
}

export default AttachmentRow