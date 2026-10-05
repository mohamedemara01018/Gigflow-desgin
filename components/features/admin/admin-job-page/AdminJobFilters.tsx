"use client";

import {
    ExperienceLevel,
    JobStatus,
    JobType,
} from "@/utils/enums.utils";
import { Search } from "lucide-react";
import { ChangeEvent } from "react";

export interface JobFilterState {
    search: string;
    category: string;
    type: string;
    experienceLevel: string;
    status: string;
    minBudget?: number;
    maxBudget?: number;
    page: number;
    limit: number;
}

interface AdminJobFiltersProps {
    filters: JobFilterState;
    searchInput: string;
    onFilterChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
}

export default function AdminJobFilters({
    filters,
    searchInput,
    onFilterChange,
}: AdminJobFiltersProps) {
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
                    placeholder="Search by title, description, ID..."
                    value={searchInput}
                    onChange={onFilterChange}
                />
            </div>

            {/* Select Filters Container */}
            <div className="flex items-center gap-4 flex-wrap">
                {/* Job Type Select */}
                <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm">
                    <label htmlFor="type" className="text-body-sm text-on-surface-variant">
                        Type
                    </label>
                    <select
                        value={filters.type}
                        onChange={onFilterChange}
                        name="type"
                        id="type"
                        className="outline-none text-on-surface bg-transparent text-body-sm"
                    >
                        <option value="" className="bg-surface-container text-on-surface">
                            All
                        </option>
                        {Object.values(JobType).map((type, idx) => (
                            <option
                                className="capitalize bg-surface-container text-on-surface"
                                key={idx}
                                value={type}
                            >
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Experience Level Select */}
                <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm">
                    <label
                        htmlFor="experienceLevel"
                        className="text-body-sm text-on-surface-variant"
                    >
                        Experience
                    </label>
                    <select
                        value={filters.experienceLevel}
                        onChange={onFilterChange}
                        name="experienceLevel"
                        id="experienceLevel"
                        className="outline-none text-on-surface bg-transparent text-body-sm"
                    >
                        <option value="" className="bg-surface-container text-on-surface">
                            All
                        </option>
                        {Object.values(ExperienceLevel).map((level, idx) => (
                            <option
                                className="capitalize bg-surface-container text-on-surface"
                                key={idx}
                                value={level}
                            >
                                {level}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Select */}
                <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm">
                    <label htmlFor="status" className="text-body-sm text-on-surface-variant">
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={onFilterChange}
                        name="status"
                        id="status"
                        className="outline-none text-on-surface bg-transparent text-body-sm"
                    >
                        <option value="" className="bg-surface-container text-on-surface">
                            All
                        </option>
                        {Object.values(JobStatus).map((status, idx) => (
                            <option
                                className="capitalize bg-surface-container text-on-surface"
                                key={idx}
                                value={status}
                            >
                                {status.replace("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}