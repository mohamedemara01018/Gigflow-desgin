/* eslint-disable @next/next/no-img-element */
"use client";

import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";
import { IUserListItem } from "@/services/user.service";
import { formatDateTime, getInitials } from "@/utils/functions.utils";
import { CheckCircle2, XCircle } from "lucide-react";

import UserStatusBadge from "./AdminUserStatusBadge";

interface UserTableProps {
    users: IUserListItem[];
    loading: boolean;
    onViewUser?: (user: IUserListItem) => void;
}

export default function AdminUserTable({
    users,
    loading,
    onViewUser,
}: UserTableProps) {
    return (
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    {/* Header */}
                    <thead className="bg-surface-container-high">
                        <tr className="border-b border-outline-variant">
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                User
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Role
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Status
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Verification
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                Last Login
                            </th>
                            <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide text-right">
                                Action
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-outline-variant">
                        {loading ? (
                            <tr>
                                <td colSpan={6}>
                                    <div className="min-h-60 flex items-center justify-center">
                                        <SmallLoading />
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <EmptyState
                                        size="compact"
                                        title="No users match your current filters."
                                    />
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                const lastLogin = user.lastLoginAt
                                    ? formatDateTime(user.lastLoginAt)
                                    : null;

                                return (
                                    <tr
                                        key={user._id}
                                        className="group hover:bg-surface-container-high transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-semibold shrink-0">
                                                        {getInitials(user.firstName, user.lastName)}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-body-md font-medium text-on-surface">
                                                        {user.firstName} {user.lastName}
                                                    </span>
                                                    <span className="text-body-sm text-on-surface-variant">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-label-md font-medium text-secondary capitalize">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <UserStatusBadge status={user.status} />
                                        </td>

                                        <td className="px-5 py-4">
                                            {user.isIdentityVerified ? (
                                                <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary">
                                                    <CheckCircle2 size={15} />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-on-surface-variant">
                                                    <XCircle size={15} />
                                                    Not Verified
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {lastLogin ? (
                                                <div className="flex flex-col">
                                                    <span className="text-body-sm text-on-surface">
                                                        {lastLogin.date}
                                                    </span>
                                                    <span className="text-label-sm text-on-surface-variant">
                                                        {lastLogin.time}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-body-sm text-on-surface-variant">
                                                    Never
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => onViewUser?.(user)}
                                                className="px-3 py-2 rounded-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors cursor-pointer"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}