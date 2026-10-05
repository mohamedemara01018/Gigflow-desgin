/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AdminJobFilters, {
    JobFilterState,
} from "@/components/features/admin/admin-job-page/AdminJobFilters";
import AdminJobTable from "@/components/features/admin/admin-job-page/AdminJobTable";
import AdminJobDetailsModal from "@/components/modals/AdminJobDetailsModal";
import {
    IJob,
    IGetJobsQueryParams,
    jobService,
} from "@/services/jobs.service";
import { IJobSkill, jobSkillService } from "@/services/jobSkill.service";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { JobStatus } from "@/utils/enums.utils";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface ISelectedJobDetails {
    job: IJob;
    skills: IJobSkill[];
}

export default function AdminJobPage() {
    // 1. Table & List state
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [pagination, setPagination] = useState({
        totalJobs: 0,
        currentPage: 1,
        totalPages: 1,
    });

    const [filters, setFilters] = useState<JobFilterState>({
        search: "",
        category: "",
        type: "",
        experienceLevel: "",
        status: "",
        minBudget: undefined,
        maxBudget: undefined,
        page: 1,
        limit: 10,
    });

    // 2. Single Job Detail & Modal State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedJobDetail, setSelectedJobDetail] = useState<ISelectedJobDetails | null>(null);
    const [jobDetailLoading, setJobDetailLoading] = useState<boolean>(false);

    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (
        message: string,
        type: IToastificationType,
        duration?: number
    ) => {
        dispatch(toastify({ message, type, duration }));
    };

    // Debounce search input changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    // Fetch jobs list with stale-check guard
    useEffect(() => {
        let isStale = false;

        const getJobs = async () => {
            try {
                setLoading(true);

                const queryParams: IGetJobsQueryParams = {
                    search: filters.search || undefined,
                    category: filters.category || undefined,
                    type: filters.type || undefined,
                    experienceLevel: filters.experienceLevel || undefined,
                    status: filters.status || undefined,
                    minBudget: filters.minBudget,
                    maxBudget: filters.maxBudget,
                    page: filters.page,
                    limit: filters.limit,
                };

                const response = await jobService.getAllJobs(queryParams);

                if (!isStale) {
                    setJobs(response.data.jobs);
                    setPagination({
                        totalJobs: response.data.totalJobs,
                        currentPage: response.data.currentPage,
                        totalPages: response.data.totalPages,
                    });
                }
            } catch (error: any) {
                if (!isStale) {
                    handleAddToastification(
                        error.message || "Failed to load jobs",
                        "error",
                        DURATION
                    );
                }
            } finally {
                if (!isStale) {
                    setLoading(false);
                }
            }
        };

        getJobs();

        return () => {
            isStale = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    /**
     * Fetch single job details and associated job skills concurrently
     */
    const handleFetchJobById = async (jobId: string) => {
        try {
            setIsModalOpen(true);
            setJobDetailLoading(true);

            // Execute job details and job skills requests in parallel
            const [jobResponse, skillsResponse] = await Promise.all([
                jobService.getJobById(jobId),
                jobSkillService.getJobSkills({ jobId }),
            ]);

            const jobData = jobResponse.data.job;
            const skillsData = skillsResponse.data.jobSkills;

            setSelectedJobDetail({
                job: jobData,
                skills: skillsData,
            });
        } catch (error: any) {
            handleAddToastification(
                error.message || "Failed to fetch job details",
                "error",
                DURATION
            );
            setIsModalOpen(false);
        } finally {
            setJobDetailLoading(false);
        }
    };

    /**
     * Close modal and reset active job selection
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJobDetail(null);
    };

    /**
     * Update job status with optimistic state updates and rollback capability
     */
    const handleUpdateJobStatus = async (jobId: string, newStatus: JobStatus) => {
        const previousJobs = [...jobs];

        // Optimistic UI Update
        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job._id === jobId ? { ...job, status: newStatus } : job
            )
        );

        try {
            const response = await jobService.editJob(jobId, { status: newStatus });
            handleAddToastification(
                response.message || "Job status updated successfully",
                "success",
                DURATION
            );

            // Synchronize modal state if active
            if (selectedJobDetail?.job._id === jobId) {
                setSelectedJobDetail((prev) =>
                    prev ? { ...prev, job: { ...prev.job, status: newStatus } } : null
                );
            }
        } catch (error: any) {
            // Rollback on failure
            setJobs(previousJobs);
            handleAddToastification(
                error.message || "Failed to update job status",
                "error",
                DURATION
            );
        }
    };

    /**
     * Delete job handler with state removal
     */
    const handleDeleteJob = async (jobId: string) => {
        const previousJobs = [...jobs];

        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

        try {
            const response = await jobService.deleteJob(jobId);
            handleAddToastification(
                response.message || "Job deleted successfully",
                "success",
                DURATION
            );

            if (selectedJobDetail?.job._id === jobId) {
                handleCloseModal();
            }
        } catch (error: any) {
            setJobs(previousJobs);
            handleAddToastification(
                error.message || "Failed to delete job posting",
                "error",
                DURATION
            );
        }
    };

    /**
     * Unified Filter Change Handler
     */
    const handleFilterChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "search") {
            setSearchInput(value);
            return;
        }

        if (name === "minBudget" || name === "maxBudget") {
            const numericValue = value !== "" ? Number(value) : undefined;
            setFilters((prev) => ({
                ...prev,
                [name]: numericValue,
                page: 1,
            }));
            return;
        }

        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    /**
     * Pagination Handler
     */
    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <div className="wrapper py-6">
            <div className="space-y-8">
                {/* Header Action Bar */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-headline-lg text-on-surface">Job Postings</h2>
                        <p className="text-body-md text-on-surface-variant mt-2">
                            Review, filter, and monitor all active and archived job postings across the platform.
                        </p>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <AdminJobFilters
                    filters={filters}
                    searchInput={searchInput}
                    onFilterChange={handleFilterChange}
                />

                {/* Job Table */}
                <AdminJobTable
                    jobs={jobs}
                    loading={loading}
                    pagination={pagination}
                    onSelectJob={handleFetchJobById}
                    onStatusChange={handleUpdateJobStatus}
                    onDeleteJob={handleDeleteJob}
                    onPageChange={handlePageChange}
                />

                {/* Job Details Modal */}
                {isModalOpen && (
                    <AdminJobDetailsModal
                        details={selectedJobDetail}
                        loading={jobDetailLoading}
                        onClose={handleCloseModal}
                        onStatusChange={handleUpdateJobStatus}
                        onDeleteJob={handleDeleteJob}
                    />
                )}
            </div>
        </div>
    );
}