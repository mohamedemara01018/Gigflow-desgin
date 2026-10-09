/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { jobService, IJob, IGetJobsQueryParams } from "@/services/jobs.service";
import { savedJobService } from "@/services/savedJob.service";
import { useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import JobCard from "@/components/features/shared/jobs/JobCard";
import FilterSidebar from "@/components/features/shared/jobs/FilterSidebar";
import ToggleSidbar from "@/components/features/shared/jobs/ToggleSidbar";
import Pagination from "@/components/ui/Pagination";

export default function FreelancerBrowseJobsPage() {
    const { me } = useSelector(selectMeSlice);

    const [jobs, setJobs] = useState<IJob[]>([]);
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Pagination & Filter States
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalJobs, setTotalJobs] = useState<number>(0);
    const pageSize = 10;

    const [filters, setFilters] = useState<IGetJobsQueryParams>({
        page: 1,
        limit: pageSize,
    });

    // Debounce search query updates to avoid frequent API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1); // Reset to first page on search
            setFilters((prev) => ({
                ...prev,
                search: searchQuery.trim() || undefined,
            }));
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Fetch saved job IDs once user info is available
    const fetchUserSavedJobs = useCallback(async () => {
        if (!me?._id) return;
        try {
            const response = await savedJobService.getUserSavedJobs({
                user: me._id,
                limit: 100,
            });
            const savedIds = new Set(
                response.data.savedJobs.map((item) => item.job._id)
            );
            setSavedJobIds(savedIds);
        } catch {
            // Non-blocking error
        }
    }, [me?._id]);

    useEffect(() => {
        fetchUserSavedJobs();
    }, [fetchUserSavedJobs]);

    // Fetch jobs when page or filters change
    const fetchJobs = useCallback(
        async (targetPage: number, currentFilters: IGetJobsQueryParams) => {
            try {
                setLoading(true);
                setError(null);

                const response = await jobService.getAllJobs({
                    ...currentFilters,
                    page: targetPage,
                    limit: pageSize,
                });

                setJobs(response.data.jobs);
                setPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setTotalJobs(response.data.totalJobs);
            } catch (err: any) {
                setError(err.message || "Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchJobs(page, filters);
    }, [page, filters, fetchJobs]);

    // Handler for filter changes from FilterSidebar
    const handleFilterChange = (newFilters: IGetJobsQueryParams) => {
        setPage(1);
        setFilters((prev) => ({
            ...newFilters,
            search: prev.search, // Preserve active search query when changing sidebar filters
        }));
    };

    // Handler for Pagination navigation
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // Sync saved job state across cards
    const handleToggleSaveJob = useCallback((jobId: string, isSaved: boolean) => {
        setSavedJobIds((prev) => {
            const updated = new Set(prev);
            if (isSaved) {
                updated.add(jobId);
            } else {
                updated.delete(jobId);
            }
            return updated;
        });
    }, []);

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start wrapper">
                <FilterSidebar onFilterChange={handleFilterChange} />

                <section className="flex flex-col gap-6">
                    {/* Header & Controls */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ToggleSidbar />
                                <h1 className="text-headline-md lg:text-headline-lg text-on-surface font-semibold">
                                    Top Jobs for You
                                </h1>
                            </div>
                        </div>

                        {/* Search Input Bar */}
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/60">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search jobs by title, skills, or keywords..."
                                className="w-full pl-10 pr-10 py-2.5 bg-surface-container text-on-surface border border-outline-variant/60 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md placeholder:text-on-surface-variant/50 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant/60 hover:text-on-surface transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 size={36} className="animate-spin text-primary" />
                            <p className="text-body-md text-on-surface-variant">
                                Loading available jobs...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="bg-error/10 text-error p-4 rounded-xl text-center">
                            <p>{error}</p>
                            <button
                                onClick={() => fetchJobs(page, filters)}
                                className="mt-2 text-label-md underline font-semibold cursor-pointer"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && jobs.length === 0 && (
                        <div className="text-center py-16 bg-surface-variant/20 rounded-2xl">
                            <p className="text-headline-sm text-on-surface font-medium">
                                No jobs found
                            </p>
                            <p className="text-body-md text-on-surface-variant mt-1">
                                Try adjusting your search terms or clearing active filters.
                            </p>
                        </div>
                    )}

                    {/* Jobs List */}
                    {!loading &&
                        !error &&
                        jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                isJobSaved={savedJobIds.has(job._id)}
                                onToggleSave={handleToggleSaveJob}
                            />
                        ))}

                    {/* Pagination Controls */}
                    {!loading && !error && jobs.length > 0 && (
                        <div className="-mt-8">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                totalItems={totalJobs}
                                onPageChange={handlePageChange}
                                isLoading={loading}
                                itemLabel="jobs"
                            />
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}