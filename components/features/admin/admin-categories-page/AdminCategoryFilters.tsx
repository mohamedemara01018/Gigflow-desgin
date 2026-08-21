// src/components/features/admin/admin-categories-page/AdminCategoryFilters.tsx
"use client";

import React, { ChangeEvent } from "react";
import { Search, RotateCcw, Plus } from "lucide-react";

export interface CategoryFilterState {
    search: string;
}

interface AdminCategoryFiltersProps {
    filters: CategoryFilterState;
    searchInput: string;
    onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onReset?: () => void;
    onOpenCreateModal?: () => void;
}

export default function AdminCategoryFilters({
    filters,
    searchInput,
    onFilterChange,
    onReset,
    onOpenCreateModal,
}: AdminCategoryFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input & Reset */}
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
                <div className="relative w-full">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search categories by name..."
                        value={searchInput}
                        onChange={onFilterChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-colors"
                    />
                </div>

                {filters.search && onReset && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1.5 px-3 py-2.5 border border-outline-variant rounded-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors shrink-0"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                )}
            </div>

            {/* Optional Add Category Button (if embedded inside toolbar) */}
            {onOpenCreateModal && (
                <button
                    type="button"
                    onClick={onOpenCreateModal}
                    className="flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 rounded-md text-label-md font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            )}
        </div>
    );
}