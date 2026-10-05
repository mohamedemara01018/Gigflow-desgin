/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import {
    Briefcase,
    Building2,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Globe,
    MapPin,
    Tag,
    Trash2,
    X,
    Eye,
    CheckCircle2,
    Star,
    Send,
    UserCheck,
    MailCheck,
} from "lucide-react";
import SmallLoading from "@/components/ui/SmallLoading";

import { JobStatus } from "@/utils/enums.utils";
import { formatDateTime, formatCurrency } from "@/utils/functions.utils";
import { ISelectedJobDetails } from "@/views/admin/AdminJobPage";
import JobStatusBadge from "../features/admin/admin-job-page/AdminJobStatusBadge";
import ReadOnlyOverview from "../ui/ReadOnlyOverview";

interface JobDetailsModalProps {
    details: ISelectedJobDetails | null;
    loading: boolean;
    onClose: () => void;
    onStatusChange?: (jobId: string, status: JobStatus) => void;
    onDeleteJob?: (jobId: string) => void;
}

export default function AdminJobDetailsModal({
    details,
    loading,
    onClose,
    onStatusChange,
    onDeleteJob,
}: JobDetailsModalProps) {
    if (!details && !loading) return null;

    const job = details?.job;
    const skills = details?.skills || [];
    const client = job?.client;

    const profileHref = client?._id ? `/profile/${client._id}` : "#";
    const clientFullName = client
        ? `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || "Unknown Client"
        : "Unknown Client";

    // Format budget / rate display
    const renderBudgetContent = () => {
        if (!job) return "N/A";

        if (job.type?.toString().toLowerCase() === "hourly") {
            if (job.hourlyRateFrom || job.hourlyRateTo) {
                const from = job.hourlyRateFrom ? formatCurrency(job.hourlyRateFrom) : "$0";
                const to = job.hourlyRateTo ? formatCurrency(job.hourlyRateTo) : "N/A";
                return `${from} - ${to} / hr`;
            }
        }

        return typeof job.budget === "number" ? formatCurrency(job.budget) : "N/A";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! max-w-2xl space-y-4 relative w-full overflow-hidden my-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        Job Details
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

                {loading || !job ? (
                    <div className="min-h-60 flex items-center justify-center p-8">
                        <SmallLoading />
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                        {/* Overview Banner */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-md border border-outline-variant">
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-body-md font-semibold text-on-surface">
                                        {job.title}
                                    </h4>
                                    <JobStatusBadge status={job.status as JobStatus} />
                                    {job.featured && (
                                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 text-label-sm font-medium px-2 py-0.5 rounded-full border border-amber-500/20">
                                            <Star size={12} className="fill-amber-500" />
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-body-sm text-on-surface-variant flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <Building2 size={14} />
                                        {client?._id ? (
                                            <Link
                                                href={profileHref}
                                                className="hover:text-primary hover:underline transition-colors font-medium"
                                            >
                                                {clientFullName}
                                            </Link>
                                        ) : (
                                            clientFullName
                                        )}
                                    </span>
                                    {job.paymentVerified && (
                                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                            <CheckCircle2 size={14} />
                                            Payment Verified
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        Posted {job.createdAt ? formatDateTime(job.createdAt).date : "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* Status Change Controls */}
                            <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/30">
                                <label
                                    htmlFor="job-status-select"
                                    className="text-label-sm font-medium text-on-surface-variant block mb-1"
                                >
                                    Change Status
                                </label>
                                <select
                                    id="job-status-select"
                                    value={job.status}
                                    onChange={(e) =>
                                        onStatusChange?.(job._id, e.target.value as JobStatus)
                                    }
                                    className="w-full sm:w-auto bg-surface-container-high border border-outline-variant rounded-md px-3 py-1.5 text-body-sm text-on-surface outline-none focus:border-primary cursor-pointer"
                                >
                                    {Object.values(JobStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Job Parameters Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-surface-container-low p-3.5 rounded-md border border-outline-variant">
                                <span className="text-body-sm font-medium text-on-surface-variant block mb-1">
                                    Budget & Type
                                </span>
                                <p className="text-body-md font-medium text-on-surface flex items-center gap-1.5 capitalize">
                                    <DollarSign size={15} className="text-on-surface-variant" />
                                    {renderBudgetContent()} ({job.type || "Fixed"})
                                </p>
                            </div>

                            <div className="bg-surface-container-low p-3.5 rounded-md border border-outline-variant">
                                <span className="text-body-sm font-medium text-on-surface-variant block mb-1">
                                    Experience & Visibility
                                </span>
                                <p className="text-body-md font-medium text-on-surface flex items-center gap-1.5 capitalize">
                                    <Briefcase size={15} className="text-on-surface-variant" />
                                    {job.experienceLevel || "N/A"}
                                    <span className="text-on-surface-variant/50">•</span>
                                    <Eye size={14} className="text-on-surface-variant" />
                                    {job.visibility || "Public"}
                                </p>
                            </div>

                            <div className="bg-surface-container-low p-3.5 rounded-md border border-outline-variant">
                                <span className="text-body-sm font-medium text-on-surface-variant block mb-1">
                                    Project Duration
                                </span>
                                <p className="text-body-md font-medium text-on-surface flex items-center gap-1.5">
                                    <Clock size={15} className="text-on-surface-variant" />
                                    {job.duration || "N/A"}
                                </p>
                            </div>

                            <div className="bg-surface-container-low p-3.5 rounded-md border border-outline-variant">
                                <span className="text-body-sm font-medium text-on-surface-variant block mb-1">
                                    Location Requirement
                                </span>
                                <p className="text-body-md font-medium text-on-surface flex items-center gap-1.5">
                                    <MapPin size={15} className="text-on-surface-variant" />
                                    {job.location || "Remote / Worldwide"}
                                </p>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant space-y-2">
                            <h4 className="text-body-md font-semibold text-on-surface flex items-center gap-2">
                                <FileText size={18} className="text-primary" />
                                Description
                            </h4>
                            <p className="text-body-sm text-on-surface/90 whitespace-pre-line leading-relaxed">
                                <ReadOnlyOverview content={job.description || "No description provided."} width="100%" tabletWidth="100%" clampLines={true} />
                            </p>
                        </div>

                        {/* Required Skills Section */}
                        {skills.length > 0 && (
                            <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant space-y-2">
                                <h4 className="text-body-md font-semibold text-on-surface flex items-center gap-2">
                                    <Tag size={18} className="text-primary" />
                                    Required Skills ({skills.length})
                                </h4>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {skills.map((item) => {
                                        const skillName =
                                            typeof item.skill === "object"
                                                ? item.skill.name
                                                : item.skill;

                                        return (
                                            <span
                                                key={item._id}
                                                className={`inline-flex items-center gap-1.5 border text-label-md px-2.5 py-1 rounded-md ${item.isRequired
                                                    ? "bg-primary-container/20 border-primary/30 text-primary font-medium"
                                                    : "bg-surface-container-high border-outline-variant text-on-surface"
                                                    }`}
                                            >
                                                {skillName}
                                                {item.isRequired && (
                                                    <span className="text-[10px] bg-primary/10 px-1 rounded">
                                                        Required
                                                    </span>
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Job Statistics Section */}
                        <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant space-y-3">
                            <h4 className="text-body-md font-semibold text-on-surface flex items-center gap-2">
                                <Globe size={18} className="text-primary" />
                                Job Activity & Engagement
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                    <span className="text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                        <Send size={12} /> Proposals
                                    </span>
                                    <span className="text-title-medium font-bold text-on-surface">
                                        {job.proposalsCount ?? 0}
                                        {job.maxProposals ? (
                                            <span className="text-body-sm font-normal text-on-surface-variant">
                                                {" "}/ {job.maxProposals}
                                            </span>
                                        ) : null}
                                    </span>
                                </div>
                                <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                    <span className="text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                        <MailCheck size={12} /> Invites
                                    </span>
                                    <span className="text-title-medium font-bold text-on-surface">
                                        {job.invitesCount ?? 0}
                                    </span>
                                </div>
                                <div className="bg-surface-container p-3 rounded-md border border-outline-variant/50">
                                    <span className="text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                        <UserCheck size={12} /> Hired
                                    </span>
                                    <span className="text-title-medium font-bold text-on-surface">
                                        {job.hiresCount ?? 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                            {onDeleteJob ? (
                                <button
                                    type="button"
                                    onClick={() => onDeleteJob(job._id)}
                                    className="flex items-center gap-2 bg-error text-on-error text-label-md rounded-md px-4 py-2.5 hover:bg-error/90 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                    Delete Job
                                </button>
                            ) : (
                                <div />
                            )}

                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors cursor-pointer"
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