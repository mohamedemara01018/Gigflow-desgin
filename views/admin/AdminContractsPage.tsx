"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { formatCurrency } from "@/utils/functions.utils";
import {
    contractService,
    IContract,
    IGetContractsQueryParams,
} from "@/services/contract.service";
import StatCard from "@/components/features/admin/admin-page/Statcard";
import AdminContractFilters, {
    ContractFilterState,
} from "@/components/features/admin/admin-contracts-page/AdminContractFilters";
import AdminContractTable from "@/components/features/admin/admin-contracts-page/AdminContractTable";
import AdminContractDetailsModal from "@/components/modals/AdminContractDetailsModal";
import { FileSignature, CheckCircle2, Clock, DollarSign, Activity } from "lucide-react";

export default function AdminContractsPage() {
    const dispatch: AppDispatch = useDispatch();

    // 1. Table & List state
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchInput, setSearchInput] = useState<string>("");
    const [pagination, setPagination] = useState({
        totalContracts: 0,
        currentPage: 1,
        totalPages: 1,
    });

    const [filters, setFilters] = useState<ContractFilterState>({
        search: "",
        status: "",
        type: "",
        page: 1,
        limit: 10,
    });

    // 2. Single Contract Detail Modal State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedContract, setSelectedContract] = useState<IContract | null>(null);
    const [contractDetailLoading, setContractDetailLoading] = useState<boolean>(false);

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

    // Fetch contracts list
    useEffect(() => {
        let isStale = false;

        const getContracts = async () => {
            try {
                setLoading(true);

                const queryParams: IGetContractsQueryParams = {
                    status: filters.status || undefined,
                    type: filters.type || undefined,
                    page: filters.page,
                    limit: filters.limit,
                };

                const response = await contractService.getAllContracts(queryParams);

                if (!isStale) {
                    let list = response.data.contracts || [];

                    // Apply client-side search across title, client name, freelancer name, ID
                    if (filters.search.trim()) {
                        const q = filters.search.toLowerCase();
                        list = list.filter((c) => {
                            const titleMatch = c.title?.toLowerCase().includes(q);
                            const idMatch = c._id?.toLowerCase().includes(q);
                            const clientMatch =
                                typeof c.client === "object" && c.client !== null
                                    ? `${c.client.firstName || ""} ${c.client.lastName || ""} ${c.client.email || ""}`
                                          .toLowerCase()
                                          .includes(q)
                                    : false;
                            const freelancerMatch =
                                typeof c.freelancer === "object" && c.freelancer !== null
                                    ? `${c.freelancer.firstName || ""} ${c.freelancer.lastName || ""} ${c.freelancer.email || ""}`
                                          .toLowerCase()
                                          .includes(q)
                                    : false;

                            return titleMatch || idMatch || clientMatch || freelancerMatch;
                        });
                    }

                    setContracts(list);
                    setPagination({
                        totalContracts: response.data.totalContracts,
                        currentPage: response.data.currentPage,
                        totalPages: response.data.totalPages,
                    });
                }
            } catch (error: any) {
                if (!isStale) {
                    handleAddToastification(
                        error.message || "Failed to load contracts",
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

        getContracts();

        return () => {
            isStale = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // Fetch single contract details
    const handleSelectContract = async (contractId: string) => {
        try {
            setIsModalOpen(true);
            setContractDetailLoading(true);

            const response = await contractService.getContractById(contractId);
            setSelectedContract(response.data.contract);
        } catch (error: any) {
            handleAddToastification(
                error.message || "Failed to load contract details",
                "error",
                DURATION
            );
            setIsModalOpen(false);
        } finally {
            setContractDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContract(null);
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
            type: "",
            page: 1,
            limit: 10,
        });
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    // Calculate dynamic stats from current dataset
    const activeContractsCount = contracts.filter((c) => (c.status || "").toLowerCase() === "active").length;
    const completedContractsCount = contracts.filter((c) => (c.status || "").toLowerCase() === "completed").length;
    const totalVolume = contracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0);

    return (
        <div className="wrapper py-6">
            <div className="space-y-8">
                {/* Header Action Bar */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-headline-lg text-on-surface">Contracts</h2>
                        <p className="text-body-md text-on-surface-variant mt-2">
                            Monitor, inspect, and track all active, completed, and draft contracts across GigFlow.
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Contracts"
                        value={String(pagination.totalContracts || 0)}
                        icon={FileSignature}
                        variant="primary"
                    />
                    <StatCard
                        label="Active Contracts"
                        value={String(activeContractsCount)}
                        icon={Activity}
                        variant="tertiary"
                    />
                    <StatCard
                        label="Completed Contracts"
                        value={String(completedContractsCount)}
                        icon={CheckCircle2}
                        variant="neutral"
                    />
                    <StatCard
                        label="Page Value"
                        value={formatCurrency(totalVolume)}
                        icon={DollarSign}
                        variant="neutral"
                    />
                </div>

                {/* Filter Toolbar */}
                <AdminContractFilters
                    filters={filters}
                    searchInput={searchInput}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                />

                {/* Contracts Table */}
                <AdminContractTable
                    contracts={contracts}
                    loading={loading}
                    pagination={pagination}
                    onSelectContract={handleSelectContract}
                    onPageChange={handlePageChange}
                />

                {/* Contract Details Modal */}
                {isModalOpen && (
                    <AdminContractDetailsModal
                        contract={selectedContract}
                        loading={contractDetailLoading}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </div>
    );
}
