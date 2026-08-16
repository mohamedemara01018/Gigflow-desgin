"use client";

import { UserRole, UserStatus } from "@/utils/enums.utils";
import { Search } from "lucide-react";
import { ChangeEvent } from "react";

export interface UserFilterState {
    search: string;
    role: string;
    status: string;
    isIdentityVerified: string;
}

interface UserFiltersProps {
    filters: UserFilterState;
    searchInput: string;
    onFilterChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
}

export default function AdminUserFilters({
    filters,
    searchInput,
    onFilterChange,
}: UserFiltersProps) {
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
                    placeholder="Search by name, email, ID..."
                    value={searchInput}
                    onChange={onFilterChange}
                />
            </div>

            {/* Select Filters */}
            <div className="flex items-center gap-4 flex-wrap">
                {/* Role Select */}
                <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm">
                    <label htmlFor="role" className="text-body-sm text-on-surface-variant">
                        Role
                    </label>
                    <select
                        value={filters.role}
                        onChange={onFilterChange}
                        name="role"
                        id="role"
                        className="outline-none text-on-surface bg-transparent text-body-sm"
                    >
                        <option value="" className="bg-surface-container text-on-surface">
                            All
                        </option>
                        {Object.values(UserRole).map((role, idx) => (
                            <option
                                className="capitalize bg-surface-container text-on-surface"
                                key={idx}
                                value={role}
                            >
                                {role}
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
                        {Object.values(UserStatus).map((status, idx) => (
                            <option
                                className="capitalize bg-surface-container text-on-surface"
                                key={idx}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Identity Verification Select */}
                <div className="flex items-center justify-center gap-2 bg-surface-container-highest p-2 rounded-sm">
                    <label
                        htmlFor="isIdentityVerified"
                        className="text-body-sm text-on-surface-variant"
                    >
                        Verification
                    </label>
                    <select
                        value={filters.isIdentityVerified}
                        onChange={onFilterChange}
                        name="isIdentityVerified"
                        id="isIdentityVerified"
                        className="outline-none text-on-surface bg-transparent text-body-sm"
                    >
                        <option value="" className="bg-surface-container text-on-surface">
                            All
                        </option>
                        <option value="true" className="bg-surface-container text-on-surface">
                            Yes
                        </option>
                        <option value="false" className="bg-surface-container text-on-surface">
                            No
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
}