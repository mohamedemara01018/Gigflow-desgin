"use client";

import { ImageIcon, FileIcon, X } from "lucide-react";

interface AttachmentPreviewProps {
    file: File;
    onRemove: () => void;
}

function formatSize(bytes: number) {
    return bytes >= 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(bytes / 1024)} KB`;
}

export default function AttachmentPreview({ file, onRemove }: AttachmentPreviewProps) {
    return (
        <div className="px-5 py-3 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg shadow-sm max-w-sm">
                <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {file.type.startsWith("image/") ? <ImageIcon size={18} /> : <FileIcon size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-medium text-on-surface truncate">{file.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{formatSize(file.size)}</p>
                </div>
                <button
                    type="button"
                    aria-label="Remove attachment"
                    onClick={onRemove}
                    className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}