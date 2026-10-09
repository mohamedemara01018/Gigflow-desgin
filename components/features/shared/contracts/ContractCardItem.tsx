"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase, Calendar, ExternalLink, FileText, MessageSquare, ShieldCheck, User } from "lucide-react";
import { IContract } from "@/services/contract.service";
import { STATUS_CONFIG } from "@/views/shared/ContractsPage";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";
import UserImage from "@/components/ui/UserImage";
import InfoCell from "./InfoCell";
import Primary from "./Primary";
import Ghost from "./Ghost";

interface ContractCardItemProps {
    contract: IContract;
    currentUserId?: string;
    isFreelancer: string
}

export default function ContractCardItem({ contract, currentUserId, isFreelancer }: ContractCardItemProps) {
    const router = useRouter();

    const statusKey = (contract.status || "draft").toLowerCase();
    const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.draft;
    const StatusIcon = cfg.icon;

    const isClient =
        typeof contract.client === "object" && contract.client !== null
            ? contract.client._id === currentUserId
            : contract.client === currentUserId;

    const counterparty = isClient
        ? typeof contract.freelancer === "object" && contract.freelancer !== null
            ? contract.freelancer
            : null
        : typeof contract.client === "object" && contract.client !== null
            ? contract.client
            : null;

    const counterpartyFirstName = counterparty?.firstName || "";
    const counterpartyLastName = counterparty?.lastName || "";
    const counterpartyName =
        counterpartyFirstName || counterpartyLastName
            ? `${counterpartyFirstName} ${counterpartyLastName}`.trim()
            : isClient
                ? "Freelancer"
                : "Client";

    const counterpartyRole = isClient ? "Freelancer" : "Client";
    const counterpartyAvatar = counterparty?.avatar || "";

    const jobObj = typeof contract.job === "object" && contract.job !== null ? contract.job : null;
    const jobTitle = jobObj?.title || "Project Job";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jobCategory = (jobObj as any)?.category?.name || "Contract Project";

    const dateFormatted = contract.startDate
        ? formatDateTime(contract.startDate).date
        : contract.createdAt
            ? formatDateTime(contract.createdAt).date
            : "Not set";

    const shortId = contract._id ? `#CT-${contract._id.slice(-4).toUpperCase()}` : "#CONTRACT";

    return (
        <article
            onClick={() => router.push(`/contracts/${contract._id}`)}
            className={`card p-0! overflow-hidden border-l-4 ${cfg.accent} cursor-pointer hover:shadow-md transition-shadow`}
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`flex items-center gap-1.5 text-label-sm px-2.5 py-1 rounded-full ${cfg.badge}`}>
                            <StatusIcon size={12} />
                            {cfg.label}
                        </span>
                        <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-md capitalize">
                            {contract.type || "Fixed"} · {shortId}
                        </span>
                        {(contract.startDate || contract.createdAt) && (
                            <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                                <Calendar size={12} />
                                {dateFormatted}
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-label-sm text-on-surface-variant">
                            {statusKey === "completed" ? "Total Paid Out" : "Total Contract Value"}
                        </p>
                        <p className="text-headline-md text-on-surface">
                            {formatCurrency(contract.totalAmount)}
                        </p>
                    </div>
                </div>

                <h3 className="text-headline-md text-[22px]! leading-7! text-on-surface mt-3">{contract.title}</h3>
                {contract.description && (
                    <p className="text-body-sm text-on-surface-variant mt-1.5 line-clamp-2">{contract.description}</p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 bg-surface-container-low rounded-lg p-3 mt-4">
                    <InfoCell
                        leading={
                            <UserImage
                                avatarUrl={counterpartyAvatar}
                                firstName={counterpartyFirstName}
                                lastName={counterpartyLastName}
                                className="w-10 h-10 shrink-0"
                            />
                        }
                        title={
                            <span className="flex items-center gap-1">
                                {counterpartyName}
                                <ShieldCheck size={12} className="text-primary" />
                            </span>
                        }
                        sub={`${counterpartyRole} · ${counterparty?.email || "Verified"}`}
                        trailing="Profile"
                        TrailingIcon={User}
                        onClick={() => {
                            if (counterparty?._id && !isFreelancer) router.push(`/profile/${counterparty._id}`);
                        }}
                    />
                    <InfoCell
                        leading={
                            <span className="w-10 h-10 rounded-md bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                                <Briefcase size={16} />
                            </span>
                        }
                        title={jobTitle}
                        sub={jobCategory}
                        trailing="Job"
                        TrailingIcon={ExternalLink}
                        onClick={() => {
                            if (jobObj?._id) router.push(`/jobs/${jobObj._id}`);
                        }}
                    />
                    <InfoCell
                        leading={
                            <span className="w-10 h-10 rounded-md bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                                <FileText size={16} />
                            </span>
                        }
                        title={`Bid: ${formatCurrency(contract.totalAmount)}`}
                        sub="Accepted Proposal"
                        trailing="Proposal"
                        TrailingIcon={FileText}
                        onClick={() => {
                            const propId =
                                typeof contract.proposal === "object" && contract.proposal !== null
                                    ? contract.proposal._id
                                    : contract.proposal;
                            if (propId) router.push(`/proposals/${propId}`);
                        }}
                    />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3 mt-5 pt-3 border-t border-outline-variant/40">
                    <div className="flex items-center gap-2">
                        <Ghost
                            icon={MessageSquare}
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push("/messages");
                            }}
                        >
                            Messages
                        </Ghost>
                    </div>
                    <div className="flex items-center gap-2">
                        <Primary
                            icon={ArrowRight}
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/contracts/${contract._id}`);
                            }}
                        >
                            View Contract Details
                        </Primary>
                    </div>
                </div>
            </div>
        </article>
    );
}