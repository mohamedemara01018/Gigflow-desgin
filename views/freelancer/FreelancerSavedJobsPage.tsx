/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { IJob } from "@/services/jobs.service";
import { savedJobService, ISavedJobItem } from "@/services/savedJob.service";
import JobPostingCard from "@/components/features/client/client-jobs-page/JobPostingCard";
import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import Pagination from "@/components/ui/Pagination";

const DURATION = 3000;
const PAGE_SIZE = 5;

export default function FreelancerSavedJobsPage() {
    const dispatch: AppDispatch = useDispatch();
    const { me } = useSelector(selectMeSlice);

    const [query, setQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("All Types");
    const [page, setPage] = useState(1);

    const [savedJobsList, setSavedJobsList] = useState<ISavedJobItem[]>([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    const fetchSavedJobs = useCallback(async () => {
        const userId = me?._id;
        if (!userId) return;

        setIsLoading(true);

        try {
            const response = await savedJobService.getUserSavedJobs({
                user: userId,
                page,
                limit: PAGE_SIZE,
            });

            setSavedJobsList(response.data.savedJobs);
            setTotalJobs(response.data.totalSavedJobs);
            setTotalPages(response.data.totalPages || 1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMessage = err?.message || "Failed to fetch saved jobs.";
            handleToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    }, [me?._id, page, handleToast]);

    useEffect(() => {
        fetchSavedJobs();
    }, [fetchSavedJobs]);

    // Client-side filtering for Search Query and Job Type
    const filteredSavedJobs = savedJobsList.filter((item) => {
        const job = item.job;
        if (!job) return false;

        const matchesQuery =
            !query.trim() ||
            job.title?.toLowerCase().includes(query.toLowerCase().trim());

        const matchesType =
            selectedType === "All Types" ||
            job.type?.toLowerCase() === selectedType.toLowerCase();

        return matchesQuery && matchesType;
    });

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-headline-lg text-on-surface">Saved Jobs</h1>
                        <span className="flex items-center gap-1.5 text-label-md text-primary bg-primary-container/15 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {totalJobs} Saved
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mt-6 p-5!">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-55">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search saved jobs by title..."
                                className="w-full bg-surface-container border border-outline-variant rounded-md pl-9 pr-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <FilterSelect
                            label="All Types"
                            options={["All Types", "Hourly", "Fixed"]}
                            value={selectedType}
                            onChange={(val) => {
                                setSelectedType(val);
                                setPage(1);
                            }}
                        />

                        <button className="flex items-center gap-2 bg-surface-container border border-outline-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:border-outline transition-colors cursor-pointer">
                            <ArrowUpDown size={14} />
                            Recently Saved
                        </button>
                    </div>
                </div>

                {/* Job List State Handler */}
                {isLoading ? (
                    <SmallLoading />
                ) : (
                    <div className="flex flex-col gap-5 mt-6">
                        {filteredSavedJobs.map((item) => (
                            <JobPostingCard
                                key={item._id}
                                job={item.job as unknown as IJob}
                                onRefresh={fetchSavedJobs}
                            />
                        ))}
                        {filteredSavedJobs.length === 0 && (
                            <EmptyState
                                title="No saved jobs found matching your criteria."
                                size="compact"
                            />
                        )}
                    </div>
                )}

                {/* Pagination Controls */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={PAGE_SIZE}
                    totalItems={totalJobs}
                    onPageChange={(newPage) => setPage(newPage)}
                    isLoading={isLoading}
                    itemLabel="saved jobs"
                />
            </div>
        </main>
    );
}

function FilterSelect({
    options,
    value,
    onChange,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-surface-container border border-outline-variant rounded-md pl-4 pr-9 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
        </div>
    );
}