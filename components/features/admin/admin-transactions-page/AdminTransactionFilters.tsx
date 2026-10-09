"use client";

import {
    TransactionDirection,
    TransactionStatus,
    TransactionType,
} from "@/utils/enums.utils";
import { Search, RotateCcw } from "lucide-react";
import { ChangeEvent } from "react";

export interface TransactionFilterState {
    search: string;
    type: string;
    status: string;
    direction: string;
    page: number;
    limit: number;
}

interface AdminTransactionFiltersProps {
    filters: TransactionFilterState;
    searchInput: string;
    onFilterChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onResetFilters: () => void;
}

export default function AdminTransactionFilters({
    filters,
    searchInput,
    onFilterChange,
    onResetFilters,
}: AdminTransactionFiltersProps) {
    const hasActiveFilters = Boolean(
        searchInput.trim() || filters.type || filters.status || filters.direction
    );

    return (
        <div className="bg-surface-container rounded-md flex items-center justify-between gap-4 p-4 flex-wrap">
            {/* Search Input */}
            <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm w-full sm:w-80">
                <label htmlFor="search" className="cursor-pointer">
                    <Search size={18} className="text-on-surface-variant" />
                </label>
                <input
                    className="outline-none w-full bg-transparent text-body-sm text-on-surface placeholder:text-on-surface-variant"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search by transaction ID, Stripe ref, participant..."
                    value={searchInput}
                    onChange={onFilterChange}
                />
            </div>

            {/* Select Filters Container */}
            <div className="flex items-center gap-4 flex-wrap">
                {/* Transaction Type Select */}
                <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm">
                    <label htmlFor="type" className="text-body-sm text-on-surface-variant">
                        Type
                    </label>
                    <select
                        value={filters.type}
                        onChange={onFilterChange}
                        name="type"
                        id="type"
                        className="outline-none text-on-surface bg-transparent text-body-sm cursor-pointer"
                    >
                        <option value="" className="bg-surface-container text-on-surface">
                            All Types
                        </option>
                        {Object.values(TransactionType).map((type) => (
                            <option
                                className="capitalize bg-surface-container text-on-surface"
                                key={type}
                                value={type}
                            >
                                {type.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Transaction Status Select */}
                <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm">
                    <label htmlFor="status" className="text-body-sm text-on-surface-variant">
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={onFilterChange}
                        name="status"
                        id="status"
                        className="outline-none text-on-surface bg-transparent text-body-sm cursor-pointer"
                    >
                        <option value="" className="bg-surface-container text-on-surface">
                            All Statuses
                        </option>
                        {Object.values(TransactionStatus).map((status) => (
                            <option
                                className="capitalize bg-surface-container text-on-surface"
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Direction Select */}
                <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm">
                    <label htmlFor="direction" className="text-body-sm text-on-surface-variant">
                        Direction
                    </label>
                    <select
                        value={filters.direction}
                        onChange={onFilterChange}
                        name="direction"
                        id="direction"
                        className="outline-none text-on-surface bg-transparent text-body-sm cursor-pointer"
                    >
                        <option value="" className="bg-surface-container text-on-surface">
                            All Directions
                        </option>
                        {Object.values(TransactionDirection).map((dir) => (
                            <option
                                className="capitalize bg-surface-container text-on-surface"
                                key={dir}
                                value={dir}
                            >
                                {dir}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Filters */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="flex items-center gap-1.5 text-body-sm text-on-surface-variant hover:text-primary transition-colors px-2 py-1 rounded cursor-pointer"
                        title="Reset filters"
                    >
                        <RotateCcw size={14} />
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}
