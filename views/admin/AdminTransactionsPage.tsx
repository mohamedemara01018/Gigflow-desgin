/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { formatCurrency } from "@/utils/functions.utils";
import {
    ITransaction,
    ITransactionQueryParams,
    transactionService,
} from "@/services/transaction.service";
import StatCard from "@/components/features/admin/admin-page/Statcard";
import AdminTransactionFilters, {
    TransactionFilterState,
} from "@/components/features/admin/admin-transactions-page/AdminTransactionFilters";
import AdminTransactionTable from "@/components/features/admin/admin-transactions-page/AdminTransactionTable";
import AdminTransactionDetailsModal from "@/components/modals/AdminTransactionDetailsModal";
import { Receipt, CheckCircle2, AlertTriangle, Percent } from "lucide-react";

export default function AdminTransactionsPage() {
    const dispatch: AppDispatch = useDispatch();

    // 1. Table & List state
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchInput, setSearchInput] = useState<string>("");
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
    });

    const [filters, setFilters] = useState<TransactionFilterState>({
        search: "",
        type: "",
        status: "",
        direction: "",
        page: 1,
        limit: 10,
    });

    // 2. Single Transaction Detail Modal State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
    const [transactionDetailLoading, setTransactionDetailLoading] = useState<boolean>(false);

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

    // Fetch transactions list
    useEffect(() => {
        let isStale = false;

        const getTransactions = async () => {
            try {
                setLoading(true);

                const queryParams: ITransactionQueryParams = {
                    type: filters.type || undefined,
                    status: filters.status || undefined,
                    direction: filters.direction || undefined,
                    page: filters.page,
                    limit: filters.limit,
                };

                const response = await transactionService.getAdminTransactions(queryParams);

                if (!isStale) {
                    let list = response.data.transactions || [];

                    // Client-side search across transaction ID, stripe IDs, participants
                    if (filters.search.trim()) {
                        const q = filters.search.toLowerCase();
                        list = list.filter((tx) => {
                            const idMatch = tx._id?.toLowerCase().includes(q);
                            const piMatch = tx.stripePaymentIntentId?.toLowerCase().includes(q);
                            const trMatch = tx.stripeTransferId?.toLowerCase().includes(q);
                            const clientMatch =
                                typeof tx.client === "object" && tx.client !== null
                                    ? `${tx.client.firstName || ""} ${tx.client.lastName || ""} ${tx.client.email || ""}`
                                          .toLowerCase()
                                          .includes(q)
                                    : false;
                            const freelancerMatch =
                                typeof tx.freelancer === "object" && tx.freelancer !== null
                                    ? `${tx.freelancer.firstName || ""} ${tx.freelancer.lastName || ""} ${tx.freelancer.email || ""}`
                                          .toLowerCase()
                                          .includes(q)
                                    : false;

                            return idMatch || piMatch || trMatch || clientMatch || freelancerMatch;
                        });
                    }

                    setTransactions(list);
                    setPagination({
                        total: response.data.total,
                        page: response.data.page,
                        totalPages: response.data.totalPages,
                    });
                }
            } catch (error: any) {
                if (!isStale) {
                    handleAddToastification(
                        error.message || "Failed to load transactions",
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

        getTransactions();

        return () => {
            isStale = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // Fetch single transaction details
    const handleSelectTransaction = async (transactionId: string) => {
        try {
            setIsModalOpen(true);
            setTransactionDetailLoading(true);

            const response = await transactionService.getTransactionById(transactionId);
            setSelectedTransaction(response.data.transaction);
        } catch (error: any) {
            handleAddToastification(
                error.message || "Failed to load transaction details",
                "error",
                DURATION
            );
            setIsModalOpen(false);
        } finally {
            setTransactionDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
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
            type: "",
            status: "",
            direction: "",
            page: 1,
            limit: 10,
        });
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    // Calculate dynamic stats
    const failedCount = transactions.filter((t) => (t.status || "").toLowerCase() === "failed").length;
    const platformFeesSum = transactions
        .filter((t) => (t.type || "").toLowerCase() === "platform_fee" && (t.status || "").toLowerCase() === "completed")
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalVolume = transactions
        .filter((t) => (t.status || "").toLowerCase() === "completed")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    return (
        <div className="wrapper py-6">
            <div className="space-y-8">
                {/* Header Action Bar */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-headline-lg text-on-surface">Transactions</h2>
                        <p className="text-body-md text-on-surface-variant mt-2">
                            Monitor, audit, and inspect financial transactions and ledger operations across GigFlow.
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Transactions"
                        value={String(pagination.total || 0)}
                        icon={Receipt}
                        variant="primary"
                    />
                    <StatCard
                        label="Platform Revenue"
                        value={formatCurrency(platformFeesSum)}
                        icon={Percent}
                        variant="tertiary"
                    />
                    <StatCard
                        label="Completed Volume"
                        value={formatCurrency(totalVolume)}
                        icon={CheckCircle2}
                        variant="neutral"
                    />
                    <StatCard
                        label="Failed / Issues"
                        value={String(failedCount)}
                        icon={AlertTriangle}
                        variant={failedCount > 0 ? "error-soft" : "neutral"}
                    />
                </div>

                {/* Filter Toolbar */}
                <AdminTransactionFilters
                    filters={filters}
                    searchInput={searchInput}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                />

                {/* Transactions Table */}
                <AdminTransactionTable
                    transactions={transactions}
                    loading={loading}
                    pagination={pagination}
                    onSelectTransaction={handleSelectTransaction}
                    onPageChange={handlePageChange}
                />

                {/* Transaction Details Modal */}
                {isModalOpen && (
                    <AdminTransactionDetailsModal
                        transaction={selectedTransaction}
                        loading={transactionDetailLoading}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </div>
    );
}
