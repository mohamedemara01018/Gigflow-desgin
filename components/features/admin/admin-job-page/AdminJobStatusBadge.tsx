import React from "react";
import { JobStatus } from "@/utils/enums.utils";
import {
    Clock,
    CheckCircle2,
    XCircle,
    PauseCircle,
    AlertCircle,
    Archive
} from "lucide-react";

interface AdminJobStatusBadgeProps {
    status: JobStatus | string;
    className?: string;
    showIcon?: boolean;
}

interface StatusConfig {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
    icon: React.ElementType;
}

const statusConfigurations: Record<string, StatusConfig> = {
    [JobStatus.OPEN]: {
        label: "Open",
        bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
        textClass: "text-emerald-700 dark:text-emerald-400",
        borderClass: "border-emerald-500/30",
        dotClass: "bg-emerald-500",
        icon: CheckCircle2,
    },
    [JobStatus.IN_PROGRESS]: {
        label: "In Progress",
        bgClass: "bg-blue-500/10 dark:bg-blue-500/15",
        textClass: "text-blue-700 dark:text-blue-400",
        borderClass: "border-blue-500/30",
        dotClass: "bg-blue-500",
        icon: Clock,
    },
    [JobStatus.DRAFT]: {
        label: "Paused",
        bgClass: "bg-amber-500/10 dark:bg-amber-500/15",
        textClass: "text-amber-700 dark:text-amber-400",
        borderClass: "border-amber-500/30",
        dotClass: "bg-amber-500",
        icon: PauseCircle,
    },
    [JobStatus.COMPLETED]: {
        label: "Completed",
        bgClass: "bg-indigo-500/10 dark:bg-indigo-500/15",
        textClass: "text-indigo-700 dark:text-indigo-400",
        borderClass: "border-indigo-500/30",
        dotClass: "bg-indigo-500",
        icon: CheckCircle2,
    },
    [JobStatus.CLOSED]: {
        label: "Closed",
        bgClass: "bg-surface-container-high",
        textClass: "text-on-surface-variant",
        borderClass: "border-outline-variant",
        dotClass: "bg-outline-variant",
        icon: Archive,
    },
    [JobStatus.CANCELLED]: {
        label: "Cancelled",
        bgClass: "bg-rose-500/10 dark:bg-rose-500/15",
        textClass: "text-rose-700 dark:text-rose-400",
        borderClass: "border-rose-500/30",
        dotClass: "bg-rose-500",
        icon: XCircle,
    },
};

// Fallback configuration for unexpected or dynamic statuses
const defaultConfig: StatusConfig = {
    label: "Unknown",
    bgClass: "bg-surface-container-high",
    textClass: "text-on-surface-variant",
    borderClass: "border-outline-variant",
    dotClass: "bg-outline-variant",
    icon: AlertCircle,
};

export default function AdminJobStatusBadge({
    status,
    className = "",
    showIcon = true,
}: AdminJobStatusBadgeProps) {
    const normalizedStatus = typeof status === "string" ? status.toLowerCase() : status;
    const config = statusConfigurations[normalizedStatus] || {
        ...defaultConfig,
        label: typeof status === "string" ? status.toUpperCase() : "UNKNOWN",
    };

    const IconComponent = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-medium border transition-colors ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}
        >
            {showIcon ? (
                <IconComponent size={13} className="shrink-0" />
            ) : (
                <span className={`size-1.5 rounded-full shrink-0 ${config.dotClass}`} />
            )}
            <span className="capitalize">{config.label}</span>
        </span>
    );
}