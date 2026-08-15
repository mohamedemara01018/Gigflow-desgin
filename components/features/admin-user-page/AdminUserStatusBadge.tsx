"use client";

import { UserStatus } from "@/utils/enums.utils";

const STATUS_STYLES: Record<string, string> = {
    active: "bg-primary/10 text-primary",
    inactive: "bg-surface-container-highest text-on-surface-variant",
    suspended: "bg-tertiary/10 text-tertiary",
    banned: "bg-error/10 text-error",
};

function getStatusClasses(status: string) {
    return (
        STATUS_STYLES[status.toLowerCase()] ??
        "bg-surface-container-highest text-on-surface-variant"
    );
}

interface UserStatusBadgeProps {
    status: UserStatus | string;
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-label-md font-medium capitalize ${getStatusClasses(
                status
            )}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}