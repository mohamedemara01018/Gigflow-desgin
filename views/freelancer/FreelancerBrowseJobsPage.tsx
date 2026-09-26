/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ArrowRight, Loader2 } from "lucide-react";
import { jobService, IJob, IGetJobsQueryParams } from "@/services/jobs.service";
import { savedJobService } from "@/services/savedJob.service";
import { useSelector } from "react-redux";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import JobCard from "@/components/features/shared/jobs/JobCard";
import FilterSidebar from "@/components/features/shared/jobs/FilterSidebar";
import ToggleSidbar from "@/components/features/shared/jobs/ToggleSidbar";

export default function FreelancerBrowseJobsPage() {
    const { me } = useSelector(selectMeSlice);

    const [jobs, setJobs] = useState<IJob[]>([]);
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    // Filter parameters state
    const [filters, setFilters] = useState<IGetJobsQueryParams>({
        page: 1,
        limit: 10,
    });

    // Fetch user's saved job IDs
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const fetchUserSavedJobs = useCallback(async () => {
        if (!me?._id) return;
        try {
            const response = await savedJobService.getUserSavedJobs({ user: me._id, limit: 100 });
            const savedIds = new Set(response.data.savedJobs.map((item) => item.job._id));
            setSavedJobIds(savedIds);
        } catch {
            // Non-blocking error if saved jobs fail to fetch
        }
    }, [me?._id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUserSavedJobs();
    }, [fetchUserSavedJobs]);

    const fetchJobs = useCallback(async (isLoadMore: boolean = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const currentPage = isLoadMore ? page + 1 : 1;
            const response = await jobService.getAllJobs({
                ...filters,
                page: currentPage,
            });

            if (isLoadMore) {
                setJobs((prev) => [...prev, ...response.data.jobs]);
                setPage(currentPage);
            } else {
                setJobs(response.data.jobs);
                setPage(1);
            }

            setTotalPages(response.data.totalPages);
        } catch (err: any) {
            setError(err.message || "Failed to fetch jobs");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filters, page]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchJobs(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleLoadMore = () => {
        if (page < totalPages && !loadingMore) {
            fetchJobs(true);
        }
    };

    // Callback to synchronize saved job IDs across components
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

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start wrapper">
                <FilterSidebar
                    onFilterChange={(newFilters: IGetJobsQueryParams) =>
                        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
                    }
                />

                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ToggleSidbar />
                            <h1 className="text-headline-md lg:text-headline-lg text-on-surface font-semibold">
                                Top Jobs for You
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
                            <span>Sort by:</span>
                            <button className="flex items-center gap-1 text-primary font-medium">
                                Newest First
                                <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Initial Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 size={36} className="animate-spin text-primary" />
                            <p className="text-body-md text-on-surface-variant">Loading available jobs...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="bg-error/10 text-error p-4 rounded-xl text-center">
                            <p>{error}</p>
                            <button
                                onClick={() => fetchJobs(false)}
                                className="mt-2 text-label-md underline font-semibold"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && jobs.length === 0 && (
                        <div className="text-center py-16 bg-surface-variant/20 rounded-2xl">
                            <p className="text-headline-sm text-on-surface font-medium">No jobs found</p>
                            <p className="text-body-md text-on-surface-variant mt-1">
                                Try adjusting your filters or search terms.
                            </p>
                        </div>
                    )}

                    {/* Jobs List */}
                    {!loading && !error && jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                            isJobSaved={savedJobIds.has(job._id)}
                            onToggleSave={handleToggleSaveJob}
                        />
                    ))}

                    {/* Load More Button */}
                    {!loading && !error && page < totalPages && (
                        <div className="flex justify-center py-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="flex items-center gap-2 text-primary text-label-md font-medium hover:underline disabled:opacity-50"
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        Load More Jobs
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}