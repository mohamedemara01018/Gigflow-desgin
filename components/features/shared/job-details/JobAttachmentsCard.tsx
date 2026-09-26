import React from "react";
import { Paperclip, Download } from "lucide-react";
import { IAttachmentItem } from "@/services/attachment.service";

interface JobAttachmentsCardProps {
    attachments: IAttachmentItem[];
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function JobAttachmentsCard({ attachments }: JobAttachmentsCardProps) {
    if (!attachments || attachments.length === 0) return null;

    return (
        <section className="card">
            <h3 className="text-headline-md text-[16px]! leading-6! text-on-surface pb-3 border-b border-outline-variant">
                Attachments ({attachments.length})
            </h3>
            <div className="flex flex-col gap-3 mt-4">
                {attachments.map((file) => (
                    <div
                        key={file._id}
                        className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className="p-2 bg-primary/10 text-primary rounded-md shrink-0">
                                <Paperclip size={18} />
                            </span>
                            <div className="flex flex-col min-w-0">
                                <p className="text-body-md font-medium text-on-surface truncate" title={file.originalName}>
                                    {file.originalName}
                                </p>
                                <p className="text-body-sm text-on-surface-variant">
                                    {formatFileSize(file.size)} • {file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                                </p>
                            </div>
                        </div>
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer shrink-0"
                            title="Download"
                        >
                            <Download size={18} />
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}