"use client";

import { Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { categoryService, ICategory } from "@/services/category.service";

export interface SkillFilterState {
    search: string;
    category: string;
}

interface AdminSkillFiltersProps {
    filters: SkillFilterState;
    searchInput: string;
    onFilterChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function AdminSkillFilters({
    filters,
    searchInput,
    onFilterChange,
}: AdminSkillFiltersProps) {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true);
                const response = await categoryService.getAllCategories();
                // Adjust payload extraction based on API wrapper structure (e.g., response.data or response.data.categories)
                const fetchedData = response.data?.categories || response.data || [];
                setCategories(Array.isArray(fetchedData) ? fetchedData : []);
            } catch (error) {
                console.error("Failed to load categories for filter:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                    type="text"
                    name="search"
                    value={searchInput}
                    onChange={onFilterChange}
                    placeholder="Search skills by name..."
                    className="w-full bg-surface-container rounded-md pl-11 pr-4 py-3.5 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            {/* Category Filter Select */}
            <div className="relative">
                {isLoadingCategories ? (
                    <Loader2
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant animate-spin pointer-events-none"
                    />
                ) : (
                    <Filter
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                    />
                )}

                <select
                    name="category"
                    value={filters.category}
                    onChange={onFilterChange}
                    disabled={isLoadingCategories}
                    className="appearance-none bg-surface-container rounded-md pl-10 pr-9 py-3.5 text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/30 min-w-[180px] disabled:opacity-60 cursor-pointer"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                />
            </div>
        </div>
    );
}