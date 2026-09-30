'use client';

import { useState, useCallback, useRef, useEffect } from "react";
import {
    Star,
    Globe2,
    CheckCircle2,
    MessageSquare,
    Pencil,
    MoreVertical,
    Users,
    Send,
    FileCheck,
    Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IJob, jobService } from "@/services/jobs.service";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { useRouter } from "next/navigation";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { UserRole } from "@/utils/enums.utils";
import BookmarkButton from "@/components/ui/BookmarkButton";
import Link from "next/link";

const DURATION = 3000;

const accentByStatus: Record<string, string> = {
    open: "border-l-primary",
    "in-progress": "border-l-secondary",
    completed: "border-l-tertiary",
    draft: "border-l-outline",
    closed: "border-l-outline-variant",
};

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string }> = {
        open: { label: "OPEN", className: "bg-primary-container/15 text-primary" },
        "in-progress": { label: "IN PROGRESS", className: "bg-secondary-container text-on-secondary-container" },
        completed: { label: "COMPLETED", className: "bg-tertiary-container text-on-tertiary-container" },
        draft: { label: "DRAFT", className: "bg-surface-container-high text-on-surface-variant" },
        closed: { label: "CLOSED", className: "bg-surface-container-highest text-on-surface-variant" },
    };
    const currentConfig = config[status] || {
        label: status.toUpperCase(),
        className: "bg-surface-container-high text-on-surface-variant",
    };

    return (
        <span className={`text-label-sm rounded px-2 py-1 uppercase ${currentConfig.className}`}>
            {currentConfig.label}
        </span>
    );
}

export default function JobPostingCard({ job, onRefresh }: { job: IJob; onRefresh?: () => void }) {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const categoryTitle = typeof job.category === "object" ? job.category.name : "General";
    const { me } = useSelector(selectMeSlice);
    const isFreelancer = me?.role === UserRole.FREELANCER;

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    // Close options dropdown on clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await jobService.deleteJob(job._id);
            handleToast("Job posting deleted successfully.", "success");
            setIsConfirmOpen(false);
            if (onRefresh) onRefresh();
        } catch (err: unknown) {
            const error = err as Error;
            const errorMessage = error?.message || "Failed to delete job posting.";
            handleToast(errorMessage, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <article className={`card p-0! border-l-4 ${accentByStatus[job.status] || "border-l-outline"} overflow-hidden`}>
                <div className="p-5">
                    {/* Header Metadata */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
                            <StatusBadge status={job.status} />
                            <span>{categoryTitle}</span>
                            <span>· {job.type}</span>

                            {job.status === "open" && (
                                <>
                                    {job.featured && (
                                        <span className="flex items-center gap-1 text-label-sm text-on-surface bg-surface-container-high px-2 py-0.5 rounded">
                                            <Star size={12} />
                                            Featured
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Globe2 size={13} />
                                        {job.visibility === "public" ? "Public" : "Invite-Only"}
                                    </span>
                                </>
                            )}

                            {job.status === "in-progress" && (
                                <span className="flex items-center gap-1 text-primary">
                                    <CheckCircle2 size={13} />
                                    Contract Active
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {isFreelancer && (
                                <BookmarkButton
                                    jobId={job._id}
                                    variant="icon"
                                    className="w-9 h-9"
                                />
                            )}
                            <div className="text-right">
                                <p className="text-headline-md text-on-surface">
                                    {job.type === "hourly"
                                        ? `$${job.hourlyRateFrom || 0} - $${job.hourlyRateTo || 0}`
                                        : `$${job.budget}`}
                                </p>
                                <p className="text-body-sm text-on-surface-variant">
                                    {job.type === "hourly" ? "/hr" : "Fixed Price"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-headline-md text-on-surface mt-3">{job.title}</h3>

                    {/* Job Proposals & Invites Counters */}
                    {job.status === "open" && (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 bg-surface-container-highest rounded-md px-4 py-3 text-body-sm text-on-surface-variant">
                            <span className="flex items-center gap-1.5">
                                <Send size={14} />
                                {job.proposalsCount || 0} Proposals
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users size={14} />
                                {job.invitesCount || 0} Invites
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FileCheck size={14} />
                                {job.hiresCount || 0} Hires
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-outline-variant bg-surface-container-low">
                    <div className="flex items-center gap-2">
                        {job.status === "open" && (
                            <>
                                {isFreelancer ? (
                                    <button
                                        onClick={() => router.push(`/jobs/${job._id}`)}
                                        className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                                    >
                                        View Details
                                    </button>
                                ) : (
                                    <>
                                        <Link href={`/client/proposals/job/${job._id}`} className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                                            View Proposals
                                            {!!job.proposalsCount && (
                                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-on-primary/20 text-label-sm">
                                                    {job.proposalsCount}
                                                </span>
                                            )}
                                        </Link>
                                        <button
                                            onClick={() => router.push(`/jobs/${job._id}`)}
                                            className="bg-surface-variant text-on-surface-variant text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                                        >
                                            View Job
                                        </button>
                                    </>
                                )}
                            </>
                        )}

                        {job.status === "in-progress" && (
                            <>
                                <button className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                                    View Contract
                                </button>
                                <button className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                                    <MessageSquare size={15} />
                                    {isFreelancer ? "Message Client" : "Message Talent"}
                                </button>
                            </>
                        )}

                        {job.status === "draft" && !isFreelancer && (
                            <>
                                <button
                                    onClick={() => router.push(`/client/jobs/update/${job._id}`)}
                                    className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                    Continue Editing
                                </button>
                                <button
                                    onClick={() => setIsConfirmOpen(true)}
                                    disabled={isDeleting}
                                    className="text-label-md text-error hover:underline underline-offset-2 px-2 cursor-pointer disabled:opacity-50"
                                >
                                    Delete Draft
                                </button>
                            </>
                        )}
                    </div>

                    {!isFreelancer && job.status !== "draft" && (
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => router.push(`/client/jobs/update/${job._id}`)}
                                aria-label="Edit posting"
                                className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant bg-surface-container border border-outline-variant hover:border-outline transition-colors cursor-pointer"
                            >
                                <Pencil size={15} />
                            </button>

                            {/* Dropdown Menu Container */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen((prev) => !prev)}
                                    aria-label="More options"
                                    className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant bg-surface-container border border-outline-variant hover:border-outline transition-colors cursor-pointer"
                                >
                                    <MoreVertical size={15} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 bottom-full mb-2 w-44 bg-surface-container-high border border-outline-variant rounded-md shadow-lg z-20 overflow-hidden py-1">
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsConfirmOpen(true);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-label-md text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={15} />
                                            Delete Posting
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* Confirmation Modal */}
            <ConfirmDialog
                open={isConfirmOpen}
                title={job.status === "draft" ? "Delete Job Draft" : "Delete Job Posting"}
                description={
                    job.status === "draft"
                        ? "Are you sure you want to delete this job posting draft? This action cannot be undone."
                        : "Are you sure you want to delete this active job posting? All attached proposals and data will be permanently removed."
                }
                confirmLabel="Delete"
                tone="danger"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </>
    );
}