/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
    Search,
    ChevronDown,
    Wallet,
    Lock,
    Bell,
    CheckCircle2,
    LucideIcon,
    Loader2,
    Clock,
    XCircle,
    FileText,
} from "lucide-react";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { contractService, IContract } from "@/services/contract.service";
import EmptyState from "@/components/ui/Emptystate";
import Pagination from "@/components/ui/Pagination";
import ContractCardItem from "@/components/features/shared/contracts/ContractCardItem";
import KpiCard from "@/components/features/shared/contracts/KpiCard";
import { UserRole } from "@/utils/enums.utils";
import { formatCurrency } from "@/utils/functions.utils";

export const STATUS_CONFIG: Record<
    string,
    { label: string; badge: string; accent: string; icon: LucideIcon }
> = {
    active: { label: "Active", badge: "bg-primary/10 text-primary", accent: "border-primary", icon: CheckCircle2 },
    draft: { label: "Draft (Unsent)", badge: "bg-surface-container-high text-on-surface-variant", accent: "border-outline", icon: FileText },
    pending: { label: "Pending Review", badge: "bg-secondary/15 text-secondary", accent: "border-secondary", icon: Clock },
    completed: { label: "Completed", badge: "bg-primary/10 text-primary", accent: "border-primary/50", icon: CheckCircle2 },
    rejected: { label: "Rejected / Cancelled", badge: "bg-error/10 text-error", accent: "border-error", icon: XCircle },
    cancelled: { label: "Cancelled", badge: "bg-error/10 text-error", accent: "border-error", icon: XCircle },
};

const PAGE_SIZE = 6;

export default function ContractsPage() {
    const { me } = useSelector(selectMeSlice);

    const [contracts, setContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [tab, setTab] = useState("all");
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const isFreelancer = me?.role === UserRole.FREELANCER;
    const userId = me?._id;

    useEffect(() => {
        if (!userId) return;

        const fetchContracts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await contractService.getAllContracts(
                    isFreelancer ? { freelancer: userId } : { client: userId }
                );
                setContracts(res.data.contracts || []);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message || "Failed to load contracts");
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [userId, isFreelancer]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [tab, query, typeFilter, sort]);

    // Dynamic KPI calculations
    const kpis = useMemo(() => {
        let totalCommitted = 0;
        let activeCount = 0;
        let pendingActionCount = 0;
        let completedCount = 0;

        contracts.forEach((c) => {
            const amount = c.totalAmount || 0;
            const status = (c.status || "").toLowerCase();

            if (status === "active") {
                totalCommitted += amount;
                activeCount += 1;
            } else if (status === "completed") {
                totalCommitted += amount;
                completedCount += 1;
            } else if (status === "draft" || status === "pending") {
                pendingActionCount += 1;
            }
        });

        return {
            totalCommitted,
            activeCount,
            pendingActionCount,
            completedCount,
            totalContracts: contracts.length,
        };
    }, [contracts]);

    // Dynamic tab counts
    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = {
            all: contracts.length,
            active: 0,
            draft: 0,
            completed: 0,
            rejected: 0,
        };

        contracts.forEach((c) => {
            const st = (c.status || "").toLowerCase();
            if (st === "active") counts.active++;
            else if (st === "draft" || st === "pending") counts.draft++;
            else if (st === "completed") counts.completed++;
            else if (st === "rejected" || st === "cancelled") counts.rejected++;
        });

        return counts;
    }, [contracts]);

    const tabs = [
        { id: "all", label: "All", count: tabCounts.all },
        { id: "active", label: "Active", count: tabCounts.active },
        { id: "draft", label: "Draft & Pending", count: tabCounts.draft },
        { id: "completed", label: "Completed", count: tabCounts.completed },
        { id: "rejected", label: "Rejected / Cancelled", count: tabCounts.rejected },
    ];

    // Filtered & Sorted contracts
    const visibleContracts = useMemo(() => {
        const q = query.trim().toLowerCase();

        return contracts
            .filter((c) => {
                const st = (c.status || "").toLowerCase();

                if (tab === "active" && st !== "active") return false;
                if (tab === "draft" && st !== "draft" && st !== "pending") return false;
                if (tab === "completed" && st !== "completed") return false;
                if (tab === "rejected" && st !== "rejected" && st !== "cancelled") return false;

                if (typeFilter !== "all" && c.type !== typeFilter) return false;

                if (!q) return true;

                const titleMatch = (c.title || "").toLowerCase().includes(q);
                const descMatch = (c.description || "").toLowerCase().includes(q);

                const clientName =
                    typeof c.client === "object" && c.client !== null
                        ? `${c.client.firstName || ""} ${c.client.lastName || ""}`.toLowerCase()
                        : "";
                const freelancerName =
                    typeof c.freelancer === "object" && c.freelancer !== null
                        ? `${c.freelancer.firstName || ""} ${c.freelancer.lastName || ""}`.toLowerCase()
                        : "";

                return titleMatch || descMatch || clientName.includes(q) || freelancerName.includes(q);
            })
            .sort((a, b) => {
                if (sort === "amount") {
                    return (b.totalAmount || 0) - (a.totalAmount || 0);
                }
                if (sort === "oldest") {
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                }
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            });
    }, [contracts, tab, typeFilter, query, sort]);

    // Paginated items
    const paginatedContracts = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return visibleContracts.slice(startIndex, startIndex + PAGE_SIZE);
    }, [visibleContracts, currentPage]);

    const totalPages = Math.ceil(visibleContracts.length / PAGE_SIZE) || 1;

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper flex flex-col gap-6">
                <div>
                    <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                        <span className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Contracts Portal
                        </span>
                        <span>/</span>
                        <span className="uppercase tracking-wide">Legal &amp; Escrow</span>
                    </div>

                    <div className="flex items-start justify-between flex-wrap gap-4 mt-3">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-headline-lg text-on-surface">My Contracts</h1>
                                <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full">
                                    {kpis.totalContracts} Total
                                </span>
                                <span className="text-label-sm bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                                    {kpis.activeCount} Active
                                </span>
                            </div>
                            <p className="text-body-md text-on-surface-variant mt-2">
                                Manage active milestones, released funds, contract terms, and review deliverables.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dynamic KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <KpiCard
                        label="Total Committed"
                        value={formatCurrency(kpis.totalCommitted)}
                        meta={`${kpis.activeCount} Active contracts`}
                        icon={Wallet}
                        progress={kpis.totalContracts > 0 ? (kpis.activeCount / kpis.totalContracts) * 100 : 0}
                    />
                    <KpiCard
                        label="Active Contracts"
                        value={`${kpis.activeCount}`}
                        meta="In Progress"
                        metaTone="muted"
                        icon={Lock}
                        progress={kpis.totalContracts > 0 ? (kpis.activeCount / kpis.totalContracts) * 100 : 0}
                    />
                    <KpiCard
                        label="Pending Actions"
                        value={`${kpis.pendingActionCount}`}
                        meta="Awaiting Review"
                        metaTone="muted"
                        icon={Bell}
                        progress={kpis.totalContracts > 0 ? (kpis.pendingActionCount / kpis.totalContracts) * 100 : 0}
                        tone="tertiary"
                    />
                    <KpiCard
                        label="Completed Contracts"
                        value={`${kpis.completedCount}`}
                        meta="Successfully closed"
                        icon={CheckCircle2}
                        progress={kpis.totalContracts > 0 ? (kpis.completedCount / kpis.totalContracts) * 100 : 0}
                    />
                </div>

                {/* Filter & Search Bar */}
                <section className="card">
                    <div className="flex items-center gap-2 flex-wrap">
                        {tabs.map((t) => {
                            const isActive = tab === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`flex items-center gap-1.5 text-body-sm px-3.5 py-2 rounded-full transition-colors cursor-pointer ${isActive
                                            ? "bg-primary text-on-primary"
                                            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                                        }`}
                                >
                                    {t.label}
                                    <span
                                        className={`text-label-sm px-1.5 rounded-full ${isActive
                                                ? "bg-on-primary/20"
                                                : t.id === "rejected"
                                                    ? "bg-error/10 text-error"
                                                    : "bg-surface-container-highest"
                                            }`}
                                    >
                                        {t.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3 mt-4 flex-wrap">
                        <div className="relative flex-1 min-w-65">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                            />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search contracts by title, counterparty name, or description..."
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md pl-9 pr-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="appearance-none bg-surface-container-low border border-outline-variant rounded-md pl-3 pr-8 py-2.5 text-body-sm text-on-surface outline-none min-w-37.5 cursor-pointer"
                            >
                                <option value="all">All Types</option>
                                <option value="fixed">Fixed-Price</option>
                                <option value="hourly">Hourly</option>
                            </select>
                            <ChevronDown
                                size={14}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="appearance-none bg-surface-container-low border border-outline-variant rounded-md pl-3 pr-8 py-2.5 text-body-sm text-on-surface outline-none min-w-37.5 cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="amount">Highest Value</option>
                            </select>
                            <ChevronDown
                                size={14}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Contract Cards List */}
                <div className="flex flex-col gap-5">
                    {loading && (
                        <div className="card flex items-center justify-center text-body-md text-on-surface-variant py-12 gap-3">
                            <Loader2 className="animate-spin text-primary" size={20} />
                            Loading contracts...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="card text-center text-body-md text-error py-12">
                            {error}
                        </div>
                    )}

                    {!loading && !error && paginatedContracts.map((c) => (
                        <ContractCardItem key={c._id} contract={c} currentUserId={userId} isFreelancer={isFreelancer} />
                    ))}

                    {!loading && !error && visibleContracts.length === 0 && (
                        <div className="card text-center text-body-md text-on-surface-variant py-12">
                            <EmptyState
                                title="No contracts found matching your filters."
                                size="compact"
                            />
                        </div>
                    )}

                    {!loading && !error && visibleContracts.length > PAGE_SIZE && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={PAGE_SIZE}
                            totalItems={visibleContracts.length}
                            onPageChange={(page) => setCurrentPage(page)}
                            itemLabel="contracts"
                        />
                    )}
                </div>
            </div>
        </main>
    );
}