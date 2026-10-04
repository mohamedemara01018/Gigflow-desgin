import { ContactSupportCategory, ContactSupportStatus } from "@/utils/enums.utils";

export const CATEGORY_LABELS: Record<ContactSupportCategory, string> = {
    [ContactSupportCategory.GENERAL_INQUIRY]: "General Inquiry",
    [ContactSupportCategory.ACCOUNT]: "Account Issue",
    [ContactSupportCategory.PAYMENT]: "Payment & Billing",
    [ContactSupportCategory.JOB]: "Job & Projects",
    [ContactSupportCategory.PROPOSAL]: "Proposals",
    [ContactSupportCategory.CONTRACT]: "Contracts",
    [ContactSupportCategory.TECHNICAL]: "Technical Issue",
    [ContactSupportCategory.SECURITY]: "Security & Privacy",
    [ContactSupportCategory.OTHER]: "Other",
};

export const STATUS_LABELS: Record<ContactSupportStatus, string> = {
    [ContactSupportStatus.NEW]: "New",
    [ContactSupportStatus.IN_PROGRESS]: "In Progress",
    [ContactSupportStatus.RESOLVED]: "Resolved",
    [ContactSupportStatus.CLOSED]: "Closed",
};

export const STATUS_FILTERS: { id: "all" | ContactSupportStatus; label: string }[] = [
    { id: "all", label: "All" },
    { id: ContactSupportStatus.NEW, label: "New" },
    { id: ContactSupportStatus.IN_PROGRESS, label: "In Progress" },
    { id: ContactSupportStatus.RESOLVED, label: "Resolved" },
    { id: ContactSupportStatus.CLOSED, label: "Closed" },
];

export const statusBadgeClass: Record<ContactSupportStatus, string> = {
    [ContactSupportStatus.NEW]: "bg-tertiary-container/20 text-tertiary",
    [ContactSupportStatus.IN_PROGRESS]: "bg-secondary-container text-on-secondary-container",
    [ContactSupportStatus.RESOLVED]: "bg-primary-container/15 text-primary",
    [ContactSupportStatus.CLOSED]: "bg-surface-container-high text-on-surface-variant",
};

export const statusDotClass: Record<ContactSupportStatus, string> = {
    [ContactSupportStatus.NEW]: "bg-tertiary",
    [ContactSupportStatus.IN_PROGRESS]: "bg-secondary",
    [ContactSupportStatus.RESOLVED]: "bg-primary",
    [ContactSupportStatus.CLOSED]: "bg-on-surface-variant",
};