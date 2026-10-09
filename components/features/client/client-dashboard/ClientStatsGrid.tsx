"use client";

import { Briefcase, FileText, ShieldCheck, CheckCircle2, CreditCard, Users, LucideIcon, Percent } from "lucide-react";
import { formatCurrency } from "@/utils/functions.utils";

interface ClientStatsGridProps {
    totalJobsPosted: number;
    openJobsCount: number;
    totalProposalsCount: number;
    activeContractsCount: number;
    completedContractsCount: number;
    totalSpent: number;
    hireRate: number;
    isLoading?: boolean;
}

function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    tone = "primary",
}: {
    label: string;
    value: string | number;
    sub?: string;
    icon: LucideIcon;
    tone?: "primary" | "secondary" | "neutral";
}) {
    return (
        <div className="card !p-4 flex flex-col justify-between hover:border-outline transition-colors">
            <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                <span className="font-medium">{label}</span>
                <span className="w-7 h-7 rounded-md bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <Icon size={15} />
                </span>
            </div>

            <div className="mt-2">
                <p className="text-headline-md !text-[24px] !leading-8 font-bold text-on-surface">
                    {value}
                </p>
                {sub && (
                    <p className="text-label-sm text-on-surface-variant mt-0.5 truncate">
                        {sub}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ClientStatsGrid({
    totalJobsPosted,
    openJobsCount,
    totalProposalsCount,
    activeContractsCount,
    completedContractsCount,
    totalSpent,
    hireRate,
    isLoading = false,
}: ClientStatsGridProps) {
    const statsList = [
        {
            label: "Total Jobs",
            value: isLoading ? "—" : totalJobsPosted,
            sub: "Posted on platform",
            icon: Briefcase,
        },
        {
            label: "Open Jobs",
            value: isLoading ? "—" : openJobsCount,
            sub: "Accepting proposals",
            icon: FileText,
        },
        {
            label: "Proposals",
            value: isLoading ? "—" : totalProposalsCount,
            sub: "Total received",
            icon: Users,
        },
        {
            label: "Active Contracts",
            value: isLoading ? "—" : activeContractsCount,
            sub: "Currently in progress",
            icon: ShieldCheck,
        },
        {
            label: "Completed",
            value: isLoading ? "—" : completedContractsCount,
            sub: "Successfully finished",
            icon: CheckCircle2,
        },
        {
            label: "Total Spent",
            value: isLoading ? "—" : formatCurrency(totalSpent),
            sub: "Total paid to talent",
            icon: CreditCard,
        },
        {
            label: "Hire Rate",
            value: isLoading ? "—" : `${hireRate}%`,
            sub: "Jobs converted to hires",
            icon: Percent,
        },
    ];

    return (
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
            {statsList.map((st) => (
                <StatCard
                    key={st.label}
                    label={st.label}
                    value={st.value}
                    sub={st.sub}
                    icon={st.icon}
                />
            ))}
        </section>
    );
}
