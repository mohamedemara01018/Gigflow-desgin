'use client';

import { Search } from "lucide-react";
import { ContactSupportCategory, ContactSupportStatus } from "@/utils/enums.utils";
import { CATEGORY_LABELS, STATUS_FILTERS } from "./support.types";
import FilterSelect from "@/components/ui/FilterSelect";

interface FiltersBarProps {
    query: string;
    setQuery: (val: string) => void;
    categoryFilter: "all" | ContactSupportCategory;
    setCategoryFilter: (cat: "all" | ContactSupportCategory) => void;
}

export function FiltersBar({ query, setQuery, categoryFilter, setCategoryFilter }: FiltersBarProps) {
    // Transform categories into key-value pairs or formatted display strings
    const categoryOptions = ["all", ...Object.values(ContactSupportCategory)];

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-60">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by requester name, email, or subject…"
                    className="w-full bg-surface-container border border-outline-variant rounded-md pl-9 pr-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {/* Category Dropdown using Reusable FilterSelect Component */}
            <FilterSelect
                options={categoryOptions}
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val as "all" | ContactSupportCategory)}
                renderOption={(opt: string) =>
                    opt === "all" ? "All Categories" : CATEGORY_LABELS[opt as ContactSupportCategory] || opt
                }
            />
        </div>
    );
}

interface StatusTabsProps {
    statusFilter: "all" | ContactSupportStatus;
    setStatusFilter: (status: "all" | ContactSupportStatus) => void;
}

export function StatusTabs({ statusFilter, setStatusFilter }: StatusTabsProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 mt-4">
            {STATUS_FILTERS.map(({ id, label }) => {
                const active = statusFilter === id;
                return (
                    <button
                        key={id}
                        onClick={() => setStatusFilter(id)}
                        className={`text-label-md rounded-md px-4 py-2 transition-colors cursor-pointer ${active
                                ? "bg-surface-container-high text-on-surface font-medium"
                                : "text-on-surface-variant hover:text-on-surface"
                            }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}