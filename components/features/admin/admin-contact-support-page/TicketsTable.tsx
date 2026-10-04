'use client';

import { Trash2, UserRound, Loader2 } from "lucide-react";
import { IContactTicket, IUserRef } from "@/services/contactSupport.service";
import { ContactSupportCategory, ContactSupportStatus } from "@/utils/enums.utils";
import { STATUS_LABELS, CATEGORY_LABELS, statusBadgeClass, statusDotClass } from "./support.types";
import { StatusDropdown } from "./StatusDropdown";
import { formatDateTime, getInitials } from "@/utils/functions.utils";





function formatUserRef(user: IUserRef | string | null | undefined): { name: string; initials: string } | null {
    if (!user) return null;
    if (typeof user === "string") return { name: "Assigned Staff", initials: "ST" };
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Assigned Staff";
    return { name, initials: getInitials(user.firstName, user.lastName) };
}

interface TicketsTableProps {
    tickets: IContactTicket[];
    confirmingId: string | null;
    setConfirmingId: (id: string | null) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: ContactSupportStatus) => Promise<void>;
    isLoading: boolean;
}

export function TicketsTable({
    tickets,
    confirmingId,
    setConfirmingId,
    onDelete,
    onStatusChange,
    isLoading
}: TicketsTableProps) {
    return (
        <div className="card !p-0 mt-4 overflow-hidden border border-outline-variant rounded-lg">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">
                            <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Requester</th>
                            <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Subject & Category</th>
                            <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Status</th>
                            <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Change Status</th>
                            <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Assigned To</th>
                            <th className="text-left text-label-sm text-on-surface-variant font-medium px-4 py-3">Submitted</th>
                            <th className="text-right text-label-sm text-on-surface-variant font-medium px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-on-surface-variant">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 size={24} className="animate-spin text-primary" />
                                        <span className="text-body-md">Loading tickets...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : tickets.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-body-md text-on-surface-variant">
                                    No support tickets found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => {
                                const assigned = formatUserRef(ticket.assignedTo);
                                const categoryKey = ticket.category as ContactSupportCategory;
                                const categoryLabel = CATEGORY_LABELS[categoryKey] || ticket.category;
                                const statusKey = (ticket.status as ContactSupportStatus) in STATUS_LABELS
                                    ? (ticket.status as ContactSupportStatus)
                                    : ContactSupportStatus.NEW;

                                return (
                                    <tr key={ticket._id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/60 transition-colors">
                                        {/* Requester */}
                                        <td className="px-4 py-4 align-top">
                                            <div className="flex items-start gap-3">
                                                <span className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container text-label-sm flex items-center justify-center shrink-0 font-medium">
                                                    {getInitials(ticket.fullName.split('')[0], ticket.fullName.split('')[1])}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-body-md text-on-surface font-medium truncate">{ticket.fullName}</p>
                                                    <p className="text-label-sm text-on-surface-variant truncate">{ticket.email}</p>
                                                    {!ticket.user && (
                                                        <span className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded mt-1">
                                                            <UserRound size={11} />
                                                            Guest
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Subject & Category */}
                                        <td className="px-4 py-4 align-top max-w-sm">
                                            <span className="text-label-sm text-on-surface-variant bg-surface-container-high rounded px-2 py-0.5">
                                                {categoryLabel}
                                            </span>
                                            <p className="text-body-md text-on-surface font-medium mt-1.5">{ticket.subject}</p>
                                            <p className="text-body-sm text-on-surface-variant truncate mt-0.5">{ticket.message}</p>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-4 py-4 align-top">
                                            <span className={`inline-flex items-center gap-1.5 text-label-sm rounded-full px-2.5 py-1 whitespace-nowrap ${statusBadgeClass[statusKey]}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass[statusKey]}`} />
                                                {STATUS_LABELS[statusKey]}
                                            </span>
                                        </td>

                                        {/* Change Status */}
                                        <td className="px-4 py-4 align-top">
                                            <StatusDropdown
                                                ticketId={ticket._id}
                                                currentStatus={ticket.status}
                                                onStatusChange={onStatusChange}
                                            />
                                        </td>

                                        {/* Assigned To */}
                                        <td className="px-4 py-4 align-top">
                                            {assigned ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-label-sm flex items-center justify-center shrink-0 font-medium">
                                                        {assigned.initials}
                                                    </span>
                                                    <span className="text-body-sm text-on-surface whitespace-nowrap">{assigned.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-body-sm text-on-surface-variant">Unassigned</span>
                                            )}
                                        </td>

                                        {/* Submitted */}
                                        <td className="px-4 py-4 align-top">
                                            <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
                                                {formatDateTime(ticket.createdAt).date}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4 align-top">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => onDelete(ticket._id)}
                                                    onBlur={() => setConfirmingId(null)}
                                                    className={`flex items-center gap-1.5 text-label-md rounded-md px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${confirmingId === ticket._id
                                                        ? "bg-error text-on-error"
                                                        : "text-error hover:bg-error-container/40"
                                                        }`}
                                                >
                                                    <Trash2 size={14} />
                                                    {confirmingId === ticket._id ? "Confirm?" : "Delete"}
                                                </button>
                                            </div>
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