"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight, Calendar, User } from "lucide-react";
import { IContract } from "@/services/contract.service";
import EmptyState from "@/components/ui/Emptystate";
import UserImage from "@/components/ui/UserImage";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";

interface DashboardActiveContractsProps {
    contracts: IContract[];
    isLoading?: boolean;
}

function DashboardContractRow({ contract }: { contract: IContract }) {
    const freelancerObj =
        typeof contract.freelancer === "object" && contract.freelancer !== null
            ? contract.freelancer
            : null;

    const freelancerFirstName = freelancerObj?.firstName || "";
    const freelancerLastName = freelancerObj?.lastName || "";
    const freelancerName =
        freelancerFirstName || freelancerLastName
            ? `${freelancerFirstName} ${freelancerLastName}`.trim()
            : "Freelancer";

    const avatarUrl = freelancerObj?.avatar || "";
    const shortId = contract._id ? `#CT-${contract._id.slice(-4).toUpperCase()}` : "#CONTRACT";

    const startDateFormatted = contract.startDate
        ? formatDateTime(contract.startDate).date
        : contract.createdAt
        ? formatDateTime(contract.createdAt).date
        : "Active";

    return (
        <div className="border border-outline-variant rounded-lg p-4.5 bg-surface-container-low hover:border-outline transition-colors">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left: Freelancer & Contract Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                    <UserImage
                        avatarUrl={avatarUrl}
                        firstName={freelancerFirstName}
                        lastName={freelancerLastName}
                        className="w-11 h-11 shrink-0 ring-1 ring-outline-variant"
                    />

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-body-md font-semibold text-on-surface truncate">
                                {freelancerName}
                            </span>
                            <span className="text-label-sm bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full">
                                ACTIVE
                            </span>
                            <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
                                {shortId}
                            </span>
                        </div>
                        <p className="text-body-sm font-medium text-on-surface mt-1 truncate">
                            {contract.title}
                        </p>
                    </div>
                </div>

                {/* Right: Amount & Timeline */}
                <div className="text-right shrink-0">
                    <p className="text-body-lg font-bold text-on-surface">
                        {formatCurrency(contract.totalAmount)}
                    </p>
                    <p className="flex items-center justify-end gap-1 text-label-sm text-on-surface-variant mt-0.5">
                        <Calendar size={12} />
                        Started {startDateFormatted}
                    </p>
                </div>
            </div>

            {/* Footer with exactly ONE primary navigation button */}
            <div className="flex items-center justify-between flex-wrap gap-3 mt-3.5 pt-3 border-t border-outline-variant/40">
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <ShieldCheck size={14} className="text-primary" />
                    <span className="capitalize">{contract.type || "Fixed-Price"} Escrow Protected</span>
                </div>

                <Link
                    href={`/contracts/${contract._id}`}
                    className="inline-flex items-center gap-1.5 text-label-md bg-primary text-on-primary rounded-md px-4 py-2 hover:opacity-90 transition-opacity font-medium"
                >
                    View Contract
                    <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}

export default function DashboardActiveContracts({
    contracts,
    isLoading = false,
}: DashboardActiveContractsProps) {
    return (
        <section className="card p-5!">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-outline-variant/50">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-headline-md font-bold text-on-surface">Active Contracts</h2>
                    <span className="text-label-sm bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full">
                        {contracts.length} Ongoing
                    </span>
                </div>

                <Link
                    href="/contracts"
                    className="inline-flex items-center gap-1.5 text-label-md text-primary hover:underline font-semibold"
                >
                    View All Contracts
                    <ArrowRight size={14} />
                </Link>
            </div>

            <div className="flex flex-col gap-3.5 mt-4">
                {isLoading ? (
                    <div className="py-8 text-center text-body-md text-on-surface-variant">
                        Loading active contracts…
                    </div>
                ) : contracts.length === 0 ? (
                    <EmptyState
                        title="No active contracts"
                        description="Accepted proposals with active terms will appear here."
                        size="compact"
                    />
                ) : (
                    contracts.slice(0, 5).map((contract) => (
                        <DashboardContractRow key={contract._id} contract={contract} />
                    ))
                )}
            </div>
        </section>
    );
}
