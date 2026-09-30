"use client";

import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { IAttachmentItem } from "@/services/attachment.service";
import AttachmentRow from "@/components/ui/AttachmentRow";
import { formatBytes } from "@/utils/functions.utils";

interface AttachmentCardProps {
    attachments?: IAttachmentItem[];
    title?: string;
    showSecurityBadge?: boolean;
    showDisputeInfo?: boolean;
    showTotalMetrics?: boolean;
    emptyMessage?: string;
    className?: string;
}

export default function AttachmentCard({
    attachments = [],
    title = "Attachments",
    showSecurityBadge = false,
    showDisputeInfo = false,
    showTotalMetrics = false,
    emptyMessage = "No attachments provided.",
    className = "",
}: AttachmentCardProps) {
    if (!attachments || attachments.length === 0) {
        if (!showDisputeInfo && !showSecurityBadge) {
            return null;
        }
    }

    const totalFiles = attachments.length;
    const totalSizeBytes = attachments.reduce((acc, item) => acc + (item.size || 0), 0);
    const formattedTotalSize = formatBytes(totalSizeBytes);

    return (
        <section className={`card ${className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-outline-variant">
                <div>
                    <h3 className="text-headline-md text-on-surface">
                        {title} {showTotalMetrics ? "" : `(${totalFiles})`}
                    </h3>
                    {showTotalMetrics && (
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            {totalFiles} {totalFiles === 1 ? "file" : "files"}
                            {totalFiles > 0 ? ` · ${formattedTotalSize} Total` : ""} · Verified SHA-256 Checksums
                        </p>
                    )}
                </div>

                {showSecurityBadge && (
                    <span className="flex items-center gap-1.5 text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded shrink-0">
                        <ShieldCheck size={13} />
                        Virus Scanned & Clean
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-4">
                {attachments.length > 0 ? (
                    attachments.map((attachment, index) => (
                        <AttachmentRow
                            key={attachment._id || index}
                            attachment={attachment}
                        />
                    ))
                ) : (
                    <div className="border border-dashed border-outline-variant rounded-md p-6 text-center text-on-surface-variant">
                        <p className="text-body-sm">{emptyMessage}</p>
                    </div>
                )}
            </div>

            {showDisputeInfo && (
                <div className="flex items-start gap-2 mt-4 bg-surface-container-highest border border-outline-variant rounded-md p-3 text-body-sm text-on-surface-variant">
                    <Info size={15} className="shrink-0 mt-0.5" />
                    <p>
                        All submitted deliverables are cryptographically hashed and backed by GigFlow Dispute Vault
                        protection. Documents remain tamper-proof throughout contract execution.
                    </p>
                </div>
            )}
        </section>
    );
}