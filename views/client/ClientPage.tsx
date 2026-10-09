/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Plus, Briefcase, ShieldCheck, Users } from "lucide-react";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { clientStatsService, IClientStats, IClientLocation } from "@/services/clientStats.service";
import { jobService, IJob } from "@/services/jobs.service";
import { contractService, IContract } from "@/services/contract.service";
import { proposalService, IProposal } from "@/services/proposal.service";
import ClientDashboardHeader from "@/components/features/client/client-dashboard/ClientDashboardHeader";
import ClientStatsGrid from "@/components/features/client/client-dashboard/ClientStatsGrid";
import DashboardMyJobs from "@/components/features/client/client-dashboard/DashboardMyJobs";
import DashboardActiveContracts from "@/components/features/client/client-dashboard/DashboardActiveContracts";
import DashboardRecentProposals from "@/components/features/client/client-dashboard/DashboardRecentProposals";
import { ContractStatus, JobStatus } from "@/utils/enums.utils";

function QuickActions() {
    const actions = [
        { label: "Post a New Job", icon: Plus, primary: true, href: "/client/jobs/create" },
        { label: "Manage My Jobs", icon: Briefcase, href: "/client/jobs" },
        { label: "Search Top Talent", icon: Users, href: "/client/talent" },
        { label: "Contracts & Escrow", icon: ShieldCheck, href: "/contracts" },
    ];

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Quick Actions:
            </span>
            {actions.map(({ label, icon: Icon, primary, href }) => (
                <Link
                    key={label}
                    href={href}
                    className={`inline-flex items-center gap-2 text-label-md rounded-md px-4 py-2 font-medium transition-colors ${
                        primary
                            ? "bg-primary text-on-primary hover:opacity-90 shadow-xs"
                            : "bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high"
                    }`}
                >
                    <Icon size={15} />
                    {label}
                </Link>
            ))}
        </div>
    );
}

export default function ClientPage() {
    const { me } = useSelector(selectMeSlice);
    const clientId = me?._id;

    const [stats, setStats] = useState<IClientStats | null>(null);
    const [location, setLocation] = useState<IClientLocation | null>(null);
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [totalJobs, setTotalJobs] = useState<number>(0);
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [proposals, setProposals] = useState<IProposal[]>([]);
    const [totalProposals, setTotalProposals] = useState<number>(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDashboardData = useCallback(async () => {
        if (!clientId) return;

        try {
            setLoading(true);
            setError(null);

            const [statsRes, jobsRes, contractsRes, proposalsRes] = await Promise.allSettled([
                clientStatsService.getClientStats(clientId, { populate: true }),
                jobService.getAllJobs({ client: clientId, limit: 10 }),
                contractService.getAllContracts({ client: clientId, limit: 20 }),
                proposalService.getAllProposals({ client: clientId, limit: 10 }),
            ]);

            // 1. Client Stats
            if (statsRes.status === "fulfilled") {
                setStats(statsRes.value.data.stats || null);
                setLocation(statsRes.value.data.location || null);
            }

            // 2. Jobs
            if (jobsRes.status === "fulfilled") {
                const fetchedJobs = jobsRes.value.data.jobs || [];
                setJobs(fetchedJobs);
                setTotalJobs(jobsRes.value.data.totalJobs ?? fetchedJobs.length);
            }

            // 3. Contracts
            if (contractsRes.status === "fulfilled") {
                setContracts(contractsRes.value.data.contracts || []);
            }

            // 4. Proposals
            if (proposalsRes.status === "fulfilled") {
                const fetchedProposals = proposalsRes.value.data.proposals || [];
                setProposals(fetchedProposals);
                setTotalProposals(proposalsRes.value.data.totalProposals ?? fetchedProposals.length);
            }
        } catch (err: any) {
            setError(err?.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    // Computed counts
    const activeContracts = useMemo(() => {
        return contracts.filter(
            (c) => (c.status || "").toLowerCase() === ContractStatus.ACTIVE || (c.status as string) === "active"
        );
    }, [contracts]);

    const completedContractsCount = useMemo(() => {
        return contracts.filter(
            (c) => (c.status || "").toLowerCase() === ContractStatus.COMPLETED || (c.status as string) === "completed"
        ).length;
    }, [contracts]);

    const openJobsCount = useMemo(() => {
        return jobs.filter(
            (j) => (j.status || "").toLowerCase() === JobStatus.OPEN || (j.status as string) === "open"
        ).length;
    }, [jobs]);

    const totalJobsPosted = stats?.totalJobsPosted ?? totalJobs;
    const totalSpent = stats?.totalSpent ?? 0;
    const hireRate = stats?.hireRate ?? 0;

    return (
        <div className="wrapper py-8 flex flex-col gap-6">
            {/* 1. Client Profile Header */}
            <ClientDashboardHeader
                me={me}
                stats={stats}
                location={location}
                isLoading={loading}
            />

            {/* 2. Key Statistics Grid */}
            <ClientStatsGrid
                totalJobsPosted={totalJobsPosted}
                openJobsCount={openJobsCount}
                totalProposalsCount={totalProposals}
                activeContractsCount={activeContracts.length}
                completedContractsCount={completedContractsCount}
                totalSpent={totalSpent}
                hireRate={hireRate}
                isLoading={loading}
            />

            {/* 3. Quick Actions */}
            <QuickActions />

            {/* 4. Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
                <div className="flex flex-col gap-6 min-w-0">
                    {/* My Jobs Section */}
                    <DashboardMyJobs jobs={jobs} isLoading={loading} />

                    {/* Active Contracts Section */}
                    <DashboardActiveContracts contracts={activeContracts} isLoading={loading} />
                </div>

                {/* Right Aside: Recent Proposals Section */}
                <aside className="flex flex-col gap-6 min-w-0">
                    <DashboardRecentProposals proposals={proposals} isLoading={loading} />
                </aside>
            </div>
        </div>
    );
}