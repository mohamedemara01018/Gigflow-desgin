/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useCallback } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { contactSupportService, IContactTicket } from "@/services/contactSupport.service";
import { ContactSupportCategory, ContactSupportStatus } from "@/utils/enums.utils";

import { FiltersBar, StatusTabs } from "@/components/features/admin/admin-contact-support-page/SupportFilters";
import { TicketsTable } from "@/components/features/admin/admin-contact-support-page/TicketsTable";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 10;

function PageHeader() {
    return (
        <div className="mb-4">
            <h1 className="text-headline-lg text-on-surface mt-2">Support Inquiries & Tickets</h1>
            <p className="text-body-md text-on-surface-variant mt-2">
                Review, assign, and resolve incoming support requests, escrow inquiries, and technical issues across the platform.
            </p>
        </div>
    );
}

export default function AdminContactsSupport() {
    const [tickets, setTickets] = useState<IContactTicket[]>([]);
    const [statusFilter, setStatusFilter] = useState<"all" | ContactSupportStatus>("all");
    const [categoryFilter, setCategoryFilter] = useState<"all" | ContactSupportCategory>("all");
    const [query, setQuery] = useState("");
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await contactSupportService.getAllTickets({
                page,
                limit: PAGE_SIZE,
                search: query.trim() || undefined,
                status: statusFilter === "all" ? undefined : statusFilter,
                category: categoryFilter === "all" ? undefined : categoryFilter,
            });

            setTickets(res.data.tickets || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setTotalItems(res.data.pagination?.totalItems || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load support tickets");
        } finally {
            setIsLoading(false);
        }
    }, [page, query, statusFilter, categoryFilter]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleDelete = async (id: string) => {
        if (confirmingId !== id) {
            setConfirmingId(id);
            return;
        }

        try {
            await contactSupportService.deleteTicket(id);
            setTickets((prev) => prev.filter((t) => t._id !== id));
            setTotalItems((prev) => Math.max(0, prev - 1));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete ticket");
        } finally {
            setConfirmingId(null);
        }
    };

    const handleStatusChange = async (id: string, newStatus: ContactSupportStatus) => {
        try {
            await contactSupportService.updateTicket(id, { status: newStatus });
            setTickets((prev) =>
                prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
            );
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update ticket status");
        }
    };

    return (
        <main className="bg-surface min-h-screen py-6">
            <div className="wrapper">
                <PageHeader />

                {error && (
                    <div className="mb-4 p-4 rounded-md bg-error/10 border border-error/20 text-error flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span className="text-body-md font-medium">{error}</span>
                        </div>
                        <button
                            onClick={fetchTickets}
                            className="flex items-center gap-1.5 text-label-md hover:underline font-medium"
                        >
                            <RefreshCw size={14} /> Retry
                        </button>
                    </div>
                )}

                <FiltersBar
                    query={query}
                    setQuery={(val) => {
                        setQuery(val);
                        setPage(1);
                    }}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={(cat) => {
                        setCategoryFilter(cat);
                        setPage(1);
                    }}
                />

                <StatusTabs
                    statusFilter={statusFilter}
                    setStatusFilter={(st) => {
                        setStatusFilter(st);
                        setPage(1);
                    }}
                />

                <TicketsTable
                    tickets={tickets}
                    confirmingId={confirmingId}
                    setConfirmingId={setConfirmingId}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    isLoading={isLoading}
                />

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={PAGE_SIZE}
                    totalItems={totalItems}
                    onPageChange={setPage}
                    isLoading={isLoading}
                    itemLabel="tickets"
                />
            </div>
        </main>
    );
}