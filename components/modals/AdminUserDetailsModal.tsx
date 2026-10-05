/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Globe, Mail, MapPin, Phone, ShieldCheck, X, XCircle } from "lucide-react";
import SmallLoading from "@/components/ui/SmallLoading";

import { UserStatus } from "@/utils/enums.utils";
import { getInitials } from "@/utils/functions.utils";
import { ISelectedUserDetails } from "@/views/admin/AdminUserPage";
import UserStatusBadge from "../features/admin/admin-user-page/AdminUserStatusBadge";

interface UserDetailsModalProps {
    details: ISelectedUserDetails | null;
    loading: boolean;
    onClose: () => void;
    onStatusChange?: (userId: string, status: UserStatus) => void;
}

export default function AdminUserDetailsModal({
    details,
    loading,
    onClose,
    onStatusChange,
}: UserDetailsModalProps) {
    if (!details && !loading) return null;

    const user = details?.user;
    const clientStats = details?.clientStats;

    const isFreelancer = user?.role?.toString().toLowerCase() === "freelancer";
    const isClient = user?.role?.toString().toLowerCase() === "client";
    const profileHref = `/profile/${user?._id}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! max-w-2xl space-y-4 relative w-full overflow-hidden my-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        User Details
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading || !user ? (
                    <div className="min-h-60 flex items-center justify-center p-8">
                        <SmallLoading />
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                        {/* Profile Overview Banner */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-md border border-outline-variant">
                            <div className="flex items-center gap-3.5">
                                {/* Profile Avatar */}
                                {isFreelancer ? (
                                    <Link href={profileHref} className="shrink-0 hover:opacity-80 transition-opacity">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="w-14 h-14 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-title-medium">
                                                {getInitials(user.firstName, user.lastName)}
                                            </div>
                                        )}
                                    </Link>
                                ) : (
                                    <div className="shrink-0">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="w-14 h-14 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-title-medium">
                                                {getInitials(user.firstName, user.lastName)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* User Meta Info */}
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        {isFreelancer ? (
                                            <Link
                                                href={profileHref}
                                                className="text-body-md font-semibold text-on-surface hover:text-primary transition-colors hover:underline"
                                            >
                                                {user.firstName} {user.lastName}
                                            </Link>
                                        ) : (
                                            <span className="text-body-md font-semibold text-on-surface">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        )}
                                        <UserStatusBadge status={user.status} />
                                    </div>
                                    <span className="text-body-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                                        <Mail size={14} />
                                        {user.email}
                                    </span>
                                </div>
                            </div>

                            {/* Status Change Controls */}
                            <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/30">
                                <label
                                    htmlFor="user-status-select"
                                    className="text-label-sm font-medium text-on-surface-variant block mb-1"
                                >
                                    Change Status
                                </label>
                                <select
                                    id="user-status-select"
                                    value={user.status}
                                    onChange={(e) =>
                                        onStatusChange?.(user._id, e.target.value as UserStatus)
                                    }
                                    className="w-full sm:w-auto bg-surface-container-high border border-outline-variant rounded-md px-3 py-1.5 text-body-sm text-on-surface outline-none focus:border-primary cursor-pointer"
                                >
                                    {Object.values(UserStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Profile Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-surface-container-low p-3.5 rounded-md border border-outline-variant">
                                <span className="text-body-sm font-medium text-on-surface-variant block mb-1">
                                    Role
                                </span>
                                <p className="text-body-md font-medium text-on-surface capitalize">
                                    {user.role}
                                </p>
                            </div>

                            <div className="bg-surface-container-low p-3.5 rounded-md border border-outline-variant">
                                <span className="text-body-sm font-medium text-on-surface-variant block mb-1">
                                    Auth Provider
                                </span>
                                <p className="text-body-md font-medium text-on-surface capitalize">
                                    {user.provider}
                                </p>
                            </div>

                            <div className="bg-surface-container-low p-3.5 rounded-md border border-outline-variant">
                                <span className="text-body-sm font-medium text-on-surface-variant block mb-1">
                                    Phone Number
                                </span>
                                <p className="text-body-md font-medium text-on-surface flex items-center gap-1.5">
                                    <Phone size={15} className="text-on-surface-variant" />
                                    {user.phone || "N/A"}
                                </p>
                            </div>

                            <div className="bg-surface-container-low p-3.5 rounded-md border border-outline-variant">
                                <span className="text-body-sm font-medium text-on-surface-variant block mb-1">
                                    Location
                                </span>
                                <p className="text-body-md font-medium text-on-surface flex items-center gap-1.5">
                                    <MapPin size={15} className="text-on-surface-variant" />
                                    {user.city?.name || user.country?.name
                                        ? `${user.city?.name ? user.city.name + ", " : ""}${user.country?.name || ""}`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Verifications Section */}
                        <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant space-y-3">
                            <h4 className="text-body-md font-semibold text-on-surface flex items-center gap-2">
                                <ShieldCheck size={18} className="text-primary" />
                                Verifications
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex items-center gap-2 text-body-sm text-on-surface">
                                    {user.isEmailVerified ? (
                                        <CheckCircle2 size={16} className="text-primary" />
                                    ) : (
                                        <XCircle size={16} className="text-on-surface-variant" />
                                    )}
                                    <span>Email Verified</span>
                                </div>
                                <div className="flex items-center gap-2 text-body-sm text-on-surface">
                                    {user.isPhoneVerified ? (
                                        <CheckCircle2 size={16} className="text-primary" />
                                    ) : (
                                        <XCircle size={16} className="text-on-surface-variant" />
                                    )}
                                    <span>Phone Verified</span>
                                </div>
                                <div className="flex items-center gap-2 text-body-sm text-on-surface">
                                    {user.isIdentityVerified ? (
                                        <CheckCircle2 size={16} className="text-primary" />
                                    ) : (
                                        <XCircle size={16} className="text-on-surface-variant" />
                                    )}
                                    <span>Identity Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Client Statistics Section (Conditional) */}
                        {isClient && clientStats && (
                            <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant space-y-3">
                                <h4 className="text-body-md font-semibold text-on-surface flex items-center gap-2">
                                    <Globe size={18} className="text-primary" />
                                    Client Statistics
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block">Total Spent</span>
                                        <span className="text-title-medium font-bold text-on-surface">${clientStats.totalSpent}</span>
                                    </div>
                                    <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block">Jobs Posted</span>
                                        <span className="text-title-medium font-bold text-on-surface">{clientStats.totalJobsPosted}</span>
                                    </div>
                                    <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block">Jobs Hired</span>
                                        <span className="text-title-medium font-bold text-on-surface">{clientStats.totalJobsHired}</span>
                                    </div>
                                    <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block">Hire Rate</span>
                                        <span className="text-title-medium font-bold text-on-surface">{clientStats.hireRate}%</span>
                                    </div>
                                    <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block">Rating</span>
                                        <span className="text-title-medium font-bold text-on-surface">{clientStats.rating} / 5</span>
                                    </div>
                                    <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                        <span className="text-label-sm text-on-surface-variant block">Payment Verified</span>
                                        <span className={`text-title-medium font-bold ${clientStats.paymentVerified ? "text-primary" : "text-on-surface-variant"}`}>
                                            {clientStats.paymentVerified ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end pt-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}