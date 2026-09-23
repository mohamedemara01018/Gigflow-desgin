/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useCallback } from "react";
import {
    Search,
    ChevronDown,
    ArrowUpDown,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { IJob, jobService } from "@/services/jobs.service";
import JobPostingCard from "@/components/features/client/client-jobs-page/JobPostingCard";
import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import Pagination from "@/components/ui/Pagination";

const DURATION = 3000;
const PAGE_SIZE = 5;

const JOB_TABS = [
    { id: "all", label: "All Postings" },
    { id: "open", label: "Open" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "closed", label: "Closed" },
    { id: "draft", label: "Drafts" },
];

export default function ClientMyJobsPage() {
    const dispatch: AppDispatch = useDispatch();
    const { me } = useSelector(selectMeSlice);

    const [activeTab, setActiveTab] = useState<string>("open");
    const [query, setQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("All Types");
    const [selectedExperience, setSelectedExperience] = useState<string>("All Experience");
    const [page, setPage] = useState(1);

    const [jobs, setJobs] = useState<IJob[]>([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    const fetchClientJobs = useCallback(async () => {
        const clientId = me?._id;
        if (!clientId) return;

        setIsLoading(true);

        try {
            const response = await jobService.getAllJobs({
                client: clientId,
                status: activeTab !== "all" ? activeTab : undefined,
                search: query.trim() || undefined,
                type: selectedType !== "All Types" ? selectedType.toLowerCase() : undefined,
                experienceLevel: selectedExperience !== "All Experience" ? selectedExperience.toLowerCase() : undefined,
                page,
                limit: PAGE_SIZE,
            });

            setJobs(response.data.jobs);
            setTotalJobs(response.data.totalJobs);
            setTotalPages(response.data.totalPages || 1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMessage = err?.message || "Failed to fetch client jobs.";
            handleToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    }, [me?._id, activeTab, query, selectedType, selectedExperience, page, handleToast]);

    useEffect(() => {
        fetchClientJobs();
    }, [fetchClientJobs]);

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper">
                {/* Top Action Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-headline-lg text-on-surface">My Jobs</h1>
                        <span className="flex items-center gap-1.5 text-label-md text-primary bg-primary-container/15 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {totalJobs} Total
                        </span>
                    </div>
                </div>

                {/* Tabs + Search/Filters */}
                <div className="card mt-6 p-5!">
                    <div className="flex flex-wrap items-center gap-2">
                        {JOB_TABS.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setPage(1);
                                    }}
                                    className={`text-label-md rounded-md px-4 py-2 transition-colors cursor-pointer ${active
                                        ? "bg-primary-container text-on-primary"
                                        : "text-on-surface-variant hover:text-on-surface"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        <div className="relative flex-1 min-w-55">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search postings by title or keywords…"
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
                        <FilterSelect
                            label="All Experience"
                            options={["All Experience", "Entry", "Intermediate", "Expert"]}
                            value={selectedExperience}
                            onChange={(val) => {
                                setSelectedExperience(val);
                                setPage(1);
                            }}
                        />

                        <button className="flex items-center gap-2 bg-surface-container border border-outline-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:border-outline transition-colors cursor-pointer">
                            <ArrowUpDown size={14} />
                            Newest first
                        </button>
                    </div>
                </div>

                {/* Job List State Handler */}
                {isLoading ? (
                    <SmallLoading />
                ) : (
                    <div className="flex flex-col gap-5 mt-6">
                        {jobs.map((job) => (
                            <JobPostingCard key={job._id} job={job} onRefresh={fetchClientJobs} />
                        ))}
                        {jobs.length === 0 && (
                            <EmptyState title="No job postings match your filters." size="compact" />
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
                    itemLabel="job postings"
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
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
        </div>
    );
}