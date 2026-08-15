"use client";

import { VerificationStatus } from "@/utils/enums.utils";

const STATUS_CONFIG: Record<VerificationStatus, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-surface-container-high text-on-surface-variant" },
    in_review: { label: "In Review", className: "bg-secondary/15 text-secondary" },
    approved: { label: "Approved", className: "bg-primary/10 text-primary" },
    rejected: { label: "Rejected", className: "bg-error-container text-on-error-container" },
    cancelled: { label: "cancelled", className: "bg-error-container text-on-error-container" },
};

interface StatusBadgeProps {
    status: VerificationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status] || {
        label: status,
        className: "bg-surface-container-high text-on-surface-variant",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 text-label-md px-2.5 py-1 rounded-full ${config.className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {config.label}
        </span>
    );
}