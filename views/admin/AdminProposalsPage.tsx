"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import {
    IGetProposalsQueryParams,
    IProposal,
    proposalService,
} from "@/services/proposal.service";
import StatCard from "@/components/features/admin/admin-page/Statcard";
import AdminProposalFilters, {
    ProposalFilterState,
} from "@/components/features/admin/admin-proposals-page/AdminProposalFilters";
import AdminProposalTable from "@/components/features/admin/admin-proposals-page/AdminProposalTable";
import AdminProposalDetailsModal from "@/components/modals/AdminProposalDetailsModal";
import { FileText, Clock, CheckCircle2, Star } from "lucide-react";

export default function AdminProposalsPage() {
    const dispatch: AppDispatch = useDispatch();

    // 1. Table & List state
    const [proposals, setProposals] = useState<IProposal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchInput, setSearchInput] = useState<string>("");
    const [pagination, setPagination] = useState({
        totalProposals: 0,
        currentPage: 1,
        totalPages: 1,
    });

    const [filters, setFilters] = useState<ProposalFilterState>({
        search: "",
        status: "",
        page: 1,
        limit: 10,
    });

    // 2. Single Proposal Detail Modal State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedProposal, setSelectedProposal] = useState<IProposal | null>(null);
    const [proposalDetailLoading, setProposalDetailLoading] = useState<boolean>(false);

    // Toast helper
    const handleAddToastification = (
        message: string,
        type: IToastificationType,
        duration?: number
    ) => {
        dispatch(toastify({ message, type, duration }));
    };

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    // Fetch proposals list
    useEffect(() => {
        let isStale = false;

        const getProposals = async () => {
            try {
                setLoading(true);

                const queryParams: IGetProposalsQueryParams = {
                    status: filters.status || undefined,
                    page: filters.page,
                    limit: filters.limit,
                };

                const response = await proposalService.getAllProposals(queryParams);

                if (!isStale) {
                    let list = response.data.proposals || [];

                    // Client-side search across freelancer name/email, job title, and proposal ID
                    if (filters.search.trim()) {
                        const q = filters.search.toLowerCase();
                        list = list.filter((p) => {
                            const idMatch = p._id?.toLowerCase().includes(q);
                            const jobMatch = p.job?.title?.toLowerCase().includes(q);
                            const freelancerMatch = p.freelancer
                                ? `${p.freelancer.firstName || ""} ${p.freelancer.lastName || ""} ${p.freelancer.email || ""}`
                                      .toLowerCase()
                                      .includes(q)
                                : false;

                            return idMatch || jobMatch || freelancerMatch;
                        });
                    }

                    setProposals(list);
                    setPagination({
                        totalProposals: response.data.totalProposals,
                        currentPage: response.data.currentPage,
                        totalPages: response.data.totalPages,
                    });
                }
            } catch (error: any) {
                if (!isStale) {
                    handleAddToastification(
                        error.message || "Failed to load proposals",
                        "error",
                        DURATION
                    );
                }
            } finally {
                if (!isStale) {
                    setLoading(false);
                }
            }
        };

        getProposals();

        return () => {
            isStale = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // Fetch single proposal details
    const handleSelectProposal = async (proposalId: string) => {
        try {
            setIsModalOpen(true);
            setProposalDetailLoading(true);

            const response = await proposalService.getProposalById(proposalId);
            setSelectedProposal(response.data.proposal);
        } catch (error: any) {
            handleAddToastification(
                error.message || "Failed to load proposal details",
                "error",
                DURATION
            );
            setIsModalOpen(false);
        } finally {
            setProposalDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProposal(null);
    };

    const handleFilterChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "search") {
            setSearchInput(value);
            return;
        }

        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setFilters({
            search: "",
            status: "",
            page: 1,
            limit: 10,
        });
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    // Calculate dynamic stats
    const pendingCount = proposals.filter((p) => (p.status || "").toLowerCase() === "pending").length;
    const acceptedCount = proposals.filter((p) => (p.status || "").toLowerCase() === "accepted").length;
    const shortlistedCount = proposals.filter((p) => (p.status || "").toLowerCase() === "shortlisted").length;

    return (
        <div className="wrapper py-6">
            <div className="space-y-8">
                {/* Header Action Bar */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-headline-lg text-on-surface">Proposals</h2>
                        <p className="text-body-md text-on-surface-variant mt-2">
                            Monitor, filter, and inspect proposals submitted by freelancers across GigFlow jobs.
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Proposals"
                        value={String(pagination.totalProposals || 0)}
                        icon={FileText}
                        variant="primary"
                    />
                    <StatCard
                        label="Pending Review"
                        value={String(pendingCount)}
                        icon={Clock}
                        variant="tertiary"
                    />
                    <StatCard
                        label="Shortlisted"
                        value={String(shortlistedCount)}
                        icon={Star}
                        variant="neutral"
                    />
                    <StatCard
                        label="Accepted"
                        value={String(acceptedCount)}
                        icon={CheckCircle2}
                        variant="neutral"
                    />
                </div>

                {/* Filter Toolbar */}
                <AdminProposalFilters
                    filters={filters}
                    searchInput={searchInput}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                />

                {/* Proposals Table */}
                <AdminProposalTable
                    proposals={proposals}
                    loading={loading}
                    pagination={pagination}
                    onSelectProposal={handleSelectProposal}
                    onPageChange={handlePageChange}
                />

                {/* Proposal Details Modal */}
                {isModalOpen && (
                    <AdminProposalDetailsModal
                        proposal={selectedProposal}
                        loading={proposalDetailLoading}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </div>
    );
}
