/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AdminUserFilters, {
    UserFilterState,
} from "@/components/features/admin/admin-user-page/AdminUserFilters";
import AdminUserTable from "@/components/features/admin/admin-user-page/AdminUserTable";
import AdminUserDetailsModal from "@/components/modals/AdminUserDetailsModal";
import {
    clientStatsService,
    IClientLocation,
    IClientStats,
} from "@/services/clientStats.service";
import { IUserListItem, userService } from "@/services/user.service";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { UserRole, UserStatus } from "@/utils/enums.utils";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface ISelectedUserDetails {
    user: IUserListItem;
    clientStats?: IClientStats | null;
    clientLocation?: IClientLocation | null;
}

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

    // Single User & Client Stats state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserDetail, setSelectedUserDetail] =
        useState<ISelectedUserDetails | null>(null);
    const [userDetailLoading, setUserDetailLoading] = useState(false);

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

    /**
     * Fetch user details by ID and load Client Stats if user role is client
     */
    const handleFetchUserById = async (userId: string) => {
        try {
            setIsModalOpen(true);
            setUserDetailLoading(true);

            // 1. Fetch user data by ID
            const userResponse = await userService.getUserById(userId);
            const user = userResponse.data.user;

            let clientStats: IClientStats | null = null;
            let clientLocation: IClientLocation | null = null;

            // 2. If user is a client, fetch client stats
            const isClientRole =
                user.role === UserRole.CLIENT ||
                user.role?.toString().toLowerCase() === "client";

            if (isClientRole) {
                try {
                    const statsResponse = await clientStatsService.getClientStats(
                        user._id,
                        { populate: true }
                    );
                    clientStats = statsResponse.data.stats;
                    clientLocation = statsResponse.data.location || null;
                } catch (statsError: any) {
                    // Graceful fallback if stats record does not exist yet
                    console.error("Client stats fetch error:", statsError);
                }
            }

            setSelectedUserDetail({
                user,
                clientStats,
                clientLocation,
            });
        } catch (error: any) {
            handleAddToastification(
                error.message || "Failed to fetch user details",
                "error",
                DURATION
            );
            setIsModalOpen(false);
        } finally {
            setUserDetailLoading(false);
        }
    };

    /**
     * Close modal and reset selection
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUserDetail(null);
    };

    /**
     * Update user status and optimistically update state
     */
    const handleUpdateUserStatus = async (
        userId: string,
        newStatus: UserStatus
    ) => {
        // Backup previous state for rollback
        const previousUsers = [...users];

        // Optimistic UI update
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId ? { ...user, status: newStatus } : user
            )
        );

        try {
            const response = await userService.updateUserStatus(userId, newStatus);
            handleAddToastification(
                response.message || "Status updated successfully",
                "success",
                DURATION
            );

            // Synchronize selected detail state if currently viewed
            if (selectedUserDetail?.user._id === userId) {
                setSelectedUserDetail((prev) =>
                    prev ? { ...prev, user: { ...prev.user, status: newStatus } } : null
                );
            }
        } catch (error: any) {
            // Revert state on failure
            setUsers(previousUsers);
            handleAddToastification(
                error.message || "Failed to update user status",
                "error",
                DURATION
            );
        }
    };

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
                </div>

                {/* Filter Toolbar */}
                <AdminUserFilters
                    filters={filters}
                    searchInput={searchInput}
                    onFilterChange={handleFilter}
                />

                {/* User Table */}
                <AdminUserTable
                    users={users}
                    loading={loading}
                    onSelectUser={handleFetchUserById}
                    onStatusChange={handleUpdateUserStatus}
                />

                {/* User Details Modal */}
                {isModalOpen && (
                    <AdminUserDetailsModal
                        details={selectedUserDetail}
                        loading={userDetailLoading}
                        onClose={handleCloseModal}
                        onStatusChange={handleUpdateUserStatus}
                    />
                )}
            </div>
        </div>
    );
}