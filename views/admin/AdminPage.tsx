"use client";

import JobFunnel from "@/components/features/admin-page/Jobfunnel";
import RecentActivity from "@/components/features/admin-page/Recentactivity";
import RevenueChart from "@/components/features/admin-page/Revenuechart";
import StatCard from "@/components/features/admin-page/Statcard";
import {
    Users,
    Briefcase,
    ShieldCheck,
    Flag,
    Wallet,
    UserCheck,
    Building2,
    CalendarClock,
    CheckCircle2,
    Landmark,
    FileSignature,
    Hourglass,
    IdCard,
    AlertTriangle,
} from "lucide-react";
import { useState } from "react";


type SectionTab = "users" | "jobs" | "verifications" | "reports" | "withdrawals";

const TABS: {
    id: SectionTab;
    label: string;
    icon: typeof Users;
    count?: number;
    countTone?: "error" | "secondary";
}[] = [
        { id: "users", label: "View Users", icon: Users },
        { id: "jobs", label: "Manage Jobs", icon: Briefcase },
        { id: "verifications", label: "Verifications", icon: ShieldCheck, count: 15, countTone: "error" },
        { id: "reports", label: "Reports", icon: Flag, count: 8, countTone: "error" },
        { id: "withdrawals", label: "Withdrawals", icon: Wallet, count: 42, countTone: "secondary" },
    ];

function SectionTabs({
    active,
    onChange,
}: {
    active: SectionTab;
    onChange: (tab: SectionTab) => void;
}) {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            {TABS.map(({ id, label, icon: Icon, count, countTone }) => {
                const isActive = active === id;
                return (
                    <button
                        key={id}
                        onClick={() => onChange(id)}
                        className={`flex items-center gap-2 pl-4 pr-3.5 py-2.5 rounded-full text-body-sm font-medium transition-colors ${isActive
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                            }`}
                    >
                        <Icon size={16} />
                        {label}
                        {count !== undefined && (
                            <span
                                className={`text-label-sm px-2 py-0.5 rounded-full ${countTone === "secondary"
                                    ? "bg-secondary text-on-secondary"
                                    : "bg-error text-on-error"
                                    }`}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<SectionTab>("users");

    return (
        <div className="wrapper py-6">
            <SectionTabs active={activeTab} onChange={setActiveTab} />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <StatCard
                    label="Total Users"
                    value="12.4k"
                    icon={Users}
                    variant="primary"
                    trend={{ label: "+8.2% this month", positive: true }}
                />
                <StatCard label="Freelancers" value="8,200" icon={UserCheck} />
                <StatCard label="Clients" value="4,250" icon={Building2} />
                <StatCard label="Active Jobs" value="1,120" icon={CalendarClock} />
                <StatCard label="Completed Jobs" value="15.6k" icon={CheckCircle2} />

                <StatCard
                    label="Platform Revenue"
                    value="$1.2M"
                    icon={Landmark}
                    variant="tertiary"
                    trend={{ label: "+12% this year", positive: true }}
                />
                <StatCard label="Active Contracts" value="850" icon={FileSignature} />
                <StatCard label="Pending Withdrawals" value="42" icon={Hourglass} />
                <StatCard
                    label="Verifications"
                    value="15"
                    icon={IdCard}
                    variant="tertiary-soft"
                />
                <StatCard
                    label="Open Reports"
                    value="8"
                    icon={AlertTriangle}
                    variant="error-soft"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <RevenueChart />
                <JobFunnel />
            </div>

            <div className="mt-6">
                <RecentActivity />
            </div>
        </div>
    );
}