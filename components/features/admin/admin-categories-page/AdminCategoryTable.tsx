// src/components/features/admin/admin-categories-page/AdminCategoryTable.tsx
"use client";

import React, { useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "@/components/ui/Emptystate";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatDateTime } from "@/utils/functions.utils";
import { ICategory } from "@/services/category.service";
import SmallLoading from "@/components/ui/SmallLoading";

interface AdminCategoryTableProps {
    categories: ICategory[];
    loading?: boolean;
    isLoading?: boolean; // Backwards compatibility alias
    page?: number;
    totalPages?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
    onEdit: (category: ICategory) => void;
    onDelete: (id: string) => Promise<void> | void;
}

export default function AdminCategoryTable({
    categories,
    loading,
    isLoading,
    page = 1,
    totalPages = 1,
    totalItems,
    onPageChange,
    onEdit,
    onDelete,
}: AdminCategoryTableProps) {
    const isTableLoading = loading || isLoading;
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        setDeleteLoading(true);
        await onDelete(pendingDeleteId);
        setDeleteLoading(false);
        setPendingDeleteId(null);
    };

    return (
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-high">
                        <tr className="border-b border-outline-variant">
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Name
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Description
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Created At
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {isTableLoading ? (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-body-md text-on-surface-variant">
                                    <SmallLoading />
                                </td>
                            </tr>
                        ) : !categories || categories.length === 0 ? (
                            <tr>
                                <td colSpan={4}>
                                    <EmptyState
                                        size="compact"
                                        title="No categories found."
                                    />
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr
                                    key={category._id}
                                    className="group hover:bg-surface-container-high transition-colors"
                                >
                                    <td className="px-5 py-4 font-medium text-body-md text-on-surface">
                                        {category.name}
                                    </td>
                                    <td className="px-5 py-4 text-body-sm text-on-surface-variant max-w-90 truncate">
                                        {category.description || "—"}
                                    </td>
                                    <td className="px-5 py-4 text-body-sm text-on-surface-variant whitespace-nowrap">
                                        {category.createdAt
                                            ? formatDateTime(String(category.createdAt)).date
                                            : "—"}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(category)}
                                                aria-label={`Edit ${category.name}`}
                                                className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPendingDeleteId(category._id)}
                                                aria-label={`Delete ${category.name}`}
                                                className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-error transition-colors"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {onPageChange && totalPages > 1 && (
                <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-t border-outline-variant">
                    <p className="text-body-sm text-on-surface-variant">
                        {totalItems !== undefined ? (
                            <span>
                                Total Items: <strong className="text-on-surface">{totalItems}</strong>
                            </span>
                        ) : (
                            <span>
                                Page {page} of {totalPages}
                            </span>
                        )}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => onPageChange(Math.max(1, page - 1))}
                            disabled={page <= 1}
                            aria-label="Previous page"
                            className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => onPageChange(p)}
                                className={`w-8 h-8 rounded-full text-body-sm font-medium transition-colors ${p === page
                                    ? "bg-primary text-on-primary"
                                    : "text-on-surface-variant hover:bg-surface-container-highest"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                            disabled={page >= totalPages}
                            aria-label="Next page"
                            className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={pendingDeleteId !== null}
                title="Delete this category?"
                description="Removing this category may affect skills associated with it. This action cannot be undone."
                confirmLabel="Delete Category"
                tone="danger"
                isLoading={deleteLoading}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
}