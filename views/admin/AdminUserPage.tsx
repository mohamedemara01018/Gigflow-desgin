/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AdminUserFilters, { UserFilterState } from "@/components/features/admin-user-page/AdminUserFilters";
import AdminUserTable from "@/components/features/admin-user-page/AdminUserTable";
import { IUserListItem, userService } from "@/services/user.service";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { Download, UserRoundPlus } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";



export default function AdminUserPage() {
    const [users, setUsers] = useState<IUserListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState<UserFilterState>({
        search: "",
        role: "",
        status: "",
        isIdentityVerified: "",
    });

    const dispatch: AppDispatch = useDispatch();

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
            setFilters((prev) => ({ ...prev, search: searchInput }));
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    // Fetch users with stale-check guard
    useEffect(() => {
        let isStale = false;

        const getUsers = async () => {
            try {
                setLoading(true);
                const response = await userService.getAllUser(filters);
                if (!isStale) {
                    setUsers(response.data.users);
                }
            } catch (error: any) {
                if (!isStale) {
                    handleAddToastification(error.message, "error", DURATION);
                }
            } finally {
                if (!isStale) {
                    setLoading(false);
                }
            }
        };

        getUsers();

        return () => {
            isStale = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleFilter = (
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
        }));
    };

    return (
        <div className="wrapper py-6">
            <div className="space-y-8">
                {/* Header Action Bar */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-headline-lg text-on-surface">Users</h2>
                        <p className="text-body-md text-on-surface-variant mt-2">
                            Manage all registered accounts across the platform.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center justify-center gap-2 bg-surface-container text-on-surface py-3 px-4 cursor-pointer hover:bg-surface-container-high duration-150 rounded-md text-label-md font-medium">
                            <Download size={16} />
                            Export CSV
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-3 px-4 cursor-pointer hover:bg-primary hover:text-on-primary duration-150 rounded-md text-label-md font-medium">
                            <UserRoundPlus size={16} />
                            Invite User
                        </button>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <AdminUserFilters
                    filters={filters}
                    searchInput={searchInput}
                    onFilterChange={handleFilter}
                />

                {/* User Table */}
                <AdminUserTable users={users} loading={loading} />
            </div>
        </div>
    );
}