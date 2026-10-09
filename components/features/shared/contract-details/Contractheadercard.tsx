"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, FileDown, Lock, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { IContract } from "@/services/contract.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";

const STATUS_CONFIG: Record<
    string,
    { label: string; badge: string; icon: typeof CheckCircle2 }
> = {
    active: { label: "Active Contract", badge: "bg-primary/10 text-primary", icon: CheckCircle2 },
    draft: { label: "Draft Contract", badge: "bg-surface-container-high text-on-surface-variant", icon: FileText },
    pending: { label: "Pending Review", badge: "bg-secondary/15 text-secondary", icon: Clock },
    completed: { label: "Completed Contract", badge: "bg-primary/10 text-primary", icon: CheckCircle2 },
    rejected: { label: "Rejected", badge: "bg-error/10 text-error", icon: XCircle },
    cancelled: { label: "Cancelled", badge: "bg-error/10 text-error", icon: XCircle },
};

export default function ContractHeaderCard({
    contract,
    currentUserId,
}: {
    contract: IContract;
    currentUserId?: string;
}) {
    const router = useRouter();

    const statusKey = (contract.status || "draft").toLowerCase();
    const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.draft;
    const StatusIcon = cfg.icon;

    const shortId = contract._id ? `#CT-${contract._id.slice(-4).toUpperCase()}` : "#CONTRACT";
    const startDate = contract.startDate
        ? formatDateTime(contract.startDate).date
        : contract.createdAt
            ? formatDateTime(contract.createdAt).date
            : "Not set";

    const endDate = contract.endDate
        ? formatDateTime(contract.endDate).date
        : "Ongoing";

    // Safe extraction for ID and Object variants
    const clientId = typeof contract.client === "object" && contract.client !== null ? contract.client._id : contract.client;
    const freelancerId = typeof contract.freelancer === "object" && contract.freelancer !== null ? contract.freelancer._id : contract.freelancer;

    const isClient = clientId === currentUserId;

    const counterparty = isClient
        ? typeof contract.freelancer === "object" && contract.freelancer !== null
            ? contract.freelancer
            : null
        : typeof contract.client === "object" && contract.client !== null
            ? contract.client
            : null;

    const counterpartyName = counterparty
        ? `${counterparty.firstName || ""} ${counterparty.lastName || ""}`.trim()
        : isClient
            ? "Freelancer"
            : "Client";

    // Safely extract query parameters
    const recipientId = isClient ? freelancerId : clientId;
    const proposalId = typeof contract.proposal === "object" && contract.proposal !== null ? contract.proposal._id : contract.proposal;
    const jobId = typeof contract.job === "object" && contract.job !== null ? contract.job._id : contract.job;

    const handleMessageClick = () => {
        const queryParams = new URLSearchParams();
        if (recipientId) queryParams.set("recipient", recipientId);
        if (proposalId) queryParams.set("proposal", proposalId);
        if (jobId) queryParams.set("job", jobId);

        router.push(`/messages?${queryParams.toString()}`);
    };

    return (
        <section className="card">
            <div className="flex flex-wrap items-center gap-2">
                <span className={`flex items-center gap-1.5 text-label-sm px-2.5 py-1 rounded ${cfg.badge}`}>
                    <StatusIcon size={12} />
                    {cfg.label}
                </span>
                <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded capitalize">
                    {contract.type || "Fixed-Price"} Escrow
                </span>
                <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded">
                    <Lock size={11} />
                    SafePay Vault Guarded
                </span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4 mt-3">
                <div>
                    <h1 className="text-headline-lg text-on-surface">{contract.title}</h1>
                    <p className="text-body-sm text-on-surface-variant mt-1.5">
                        Duration: {startDate} – {endDate} <span className="mx-1.5">·</span> Contract ID: {shortId} (
                        {contract._id})
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleMessageClick}
                        className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <MessageSquare size={15} />
                        Message {counterpartyName}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <FileDown size={15} />
                        Agreement (PDF)
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-1.5 text-body-sm text-primary mt-3 pt-3 border-t border-outline-variant/40">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>
                    Contract Total: {formatCurrency(contract.totalAmount)} USD
                </span>
            </div>
        </section>
    );
}