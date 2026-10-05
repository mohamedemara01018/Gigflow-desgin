"use client";

import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";
import { IJob } from "@/services/jobs.service";
import { JobStatus, JobType } from "@/utils/enums.utils";
import { formatDateTime } from "@/utils/functions.utils";
import Link from "next/link";
import AdminJobStatusBadge from "./AdminJobStatusBadge";
import Pagination from "@/components/ui/Pagination";

interface IPagination {
    totalJobs: number;
    currentPage: number;
    totalPages: number;
}

interface AdminJobTableProps {
    jobs: IJob[];
    loading: boolean;
    pagination: IPagination;
    onSelectJob?: (jobId: string) => void;
    onStatusChange?: (jobId: string, newStatus: JobStatus) => void;
    onDeleteJob?: (jobId: string) => void;
    onPageChange?: (page: number) => void;
}

export default function AdminJobTable({
    jobs,
    loading,
    pagination,
    onSelectJob,
    onStatusChange,
    onDeleteJob,
    onPageChange,
}: AdminJobTableProps) {
    const TOTAL_COLUMNS = 7;

    return (
        <>
            <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* Header */}
                        <thead className="bg-surface-container-high">
                            <tr className="border-b border-outline-variant">
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Job
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Client
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Type
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Budget
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
                                    Posted Date
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
                                    <td colSpan={TOTAL_COLUMNS}>
                                        <div className="min-h-60 flex items-center justify-center">
                                            <SmallLoading />
                                        </div>
                                    </td>
                                </tr>
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={TOTAL_COLUMNS}>
                                        <EmptyState
                                            size="compact"
                                            title="No jobs match your current filters."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job) => {
                                    const postedDate = job.createdAt
                                        ? formatDateTime(job.createdAt).date
                                        : "N/A";
                                    const jobHref = `/jobs/${job._id}`;
                                    const clientName = job.client
                                        ? `${job.client.firstName ?? ""} ${job.client.lastName ?? ""}`.trim() || "Unknown"
                                        : "Unknown";
                                    return (
                                        <tr
                                            key={job._id}
                                            className="group hover:bg-surface-container-high transition-colors"
                                        >
                                            {/* Job Title & Category */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col max-w-xs">
                                                    <Link
                                                        href={jobHref}
                                                        className="text-body-md font-medium text-on-surface hover:text-primary transition-colors hover:underline truncate"
                                                        title={job.title}
                                                    >
                                                        {job.title}
                                                    </Link>
                                                    <span className="text-body-sm text-on-surface-variant capitalize truncate">
                                                        {typeof job.category === "object" && job.category !== null
                                                            ? job.category.name
                                                            : job.category || "General"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Client Info */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-body-md font-medium text-on-surface">
                                                        {clientName}
                                                    </span>
                                                    {job.client?.email && (
                                                        <span className="text-body-sm text-on-surface-variant">
                                                            {job.client.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Job Type */}
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-label-md font-medium text-secondary capitalize">
                                                    {job.type ?? JobType.FIXED}
                                                </span>
                                            </td>

                                            {/* Budget */}
                                            <td className="px-5 py-4">
                                                <span className="text-body-md font-semibold text-on-surface">
                                                    {typeof job.budget === "number"
                                                        ? `$${job.budget.toLocaleString()}`
                                                        : "N/A"}
                                                </span>
                                            </td>

                                            {/* Status Badge Select */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={job.status}
                                                        onChange={(e) =>
                                                            onStatusChange?.(
                                                                job._id,
                                                                e.target.value as JobStatus
                                                            )
                                                        }
                                                        className="bg-surface border border-outline-variant text-on-surface text-body-sm rounded-lg px-2.5 py-1 focus:outline-none focus:border-primary transition-colors cursor-pointer"
                                                    >
                                                        {Object.values(JobStatus).map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <AdminJobStatusBadge status={job.status} />
                                                </div>
                                            </td>

                                            {/* Posted Date */}
                                            <td className="px-5 py-4">
                                                <span className="text-body-sm text-on-surface">
                                                    {postedDate}
                                                </span>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onSelectJob?.(job._id)}
                                                        className="px-3 py-1.5 rounded-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors cursor-pointer"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteJob?.(job._id)}
                                                        className="px-3 py-1.5 rounded-md text-label-md font-medium text-error hover:bg-error/10 transition-colors cursor-pointer"
                                                    >
                                                        Delete
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
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pageSize={10} // Pass your actual page size (or state value)
                totalItems={pagination.totalJobs}
                onPageChange={(page) => onPageChange?.(page)}
                isLoading={loading}
                itemLabel="jobs"
            />
        </>
    );
}