/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import {
    Search,
    ArrowUpDown,
} from "lucide-react";
import FilterSelect from "@/components/ui/FilterSelect";
import JobProposalCard from "@/components/features/client/client-job-proposals/JobProposalCard";
import { proposalService, IProposal } from "@/services/proposal.service";
import { jobService, IJob } from "@/services/jobs.service";
import JobHeaderCard from "@/components/features/client/client-job-proposals/Jobheadercard";
import SmallLoading from "@/components/ui/SmallLoading";
import Pagination from "@/components/ui/Pagination";
import { ProposalStatus } from "@/utils/enums.utils";

const PAGE_SIZE = 4;
const DURATION = 3000;

const PROPOSAL_TABS = [
    { id: "all", label: "All Proposals" },
    { id: ProposalStatus.PENDING, label: "Pending" },
    { id: ProposalStatus.SHORTLISTED, label: "Shortlisted" },
    { id: ProposalStatus.ACCEPTED, label: "Accepted" },
    { id: ProposalStatus.REJECTED, label: "Rejected" },
    { id: ProposalStatus.WITHDRAWN, label: "Withdrawn" },
];

export default function ClientJobProposalsPage({ jobId }: { jobId: string }) {
    const dispatch: AppDispatch = useDispatch();

    const [activeTab, setActiveTab] = useState<string>("all");
    const [query, setQuery] = useState("");
    const [selectedSort, setSelectedSort] = useState("Sort: Best Match");
    const [page, setPage] = useState(1);

    // Dynamic Data State
    const [job, setJob] = useState<IJob | null>(null);
    const [proposals, setProposals] = useState<IProposal[]>([]);
    const [totalProposals, setTotalProposals] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingProposalId, setUpdatingProposalId] = useState<string | null>(null);

    const handleToast = useCallback(
        (message: string, type: IToastificationType) => {
            dispatch(toastify({ message, type, duration: DURATION }));
        },
        [dispatch]
    );

    const fetchPageData = useCallback(async () => {
        if (!jobId) return;

        setIsLoading(true);

        try {
            const [jobRes, proposalsRes] = await Promise.all([
                jobService.getJobById(jobId),
                proposalService.getAllProposals({
                    job: jobId,
                    status: activeTab !== "all" ? (activeTab as ProposalStatus) : undefined,
                    page,
                    limit: PAGE_SIZE,
                }),
            ]);

            setJob(jobRes.data.job);
            setProposals(proposalsRes.data.proposals);

            const total = proposalsRes.data.totalProposals ?? proposalsRes.data.proposals.length;
            const pages = proposalsRes.data.totalPages ?? Math.ceil(total / PAGE_SIZE) ?? 1;

            setTotalProposals(total);
            setTotalPages(pages);
        } catch (err: any) {
            const errorMessage = err?.message || "Failed to load proposals data.";
            handleToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    }, [jobId, activeTab, page, handleToast]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    // Accept Proposal / Hire Candidate
    const handleAcceptProposal = async (proposalId: string) => {
        setUpdatingProposalId(proposalId);
        try {
            await proposalService.updateProposalStatus(proposalId, {
                status: ProposalStatus.ACCEPTED,
            });
            handleToast("Proposal accepted and offer sent successfully!", "success");
            await fetchPageData();
        } catch (err: any) {
            handleToast(err?.message || "Failed to accept proposal.", "error");
        } finally {
            setUpdatingProposalId(null);
        }
    };

    // Reject Proposal
    const handleRejectProposal = async (proposalId: string) => {
        setUpdatingProposalId(proposalId);
        try {
            await proposalService.updateProposalStatus(proposalId, {
                status: ProposalStatus.REJECTED,
            });
            handleToast("Proposal rejected.", "info");
            await fetchPageData();
        } catch (err: any) {
            handleToast(err?.message || "Failed to reject proposal.", "error");
        } finally {
            setUpdatingProposalId(null);
        }
    };

    // Client-side search filtering over fetched proposals
    const filteredProposals = useMemo(() => {
        const searchTerm = query.trim().toLowerCase();
        if (!searchTerm) return proposals;

        return proposals.filter((proposal) => {
            const freelancer = typeof proposal.freelancer === "object" ? proposal.freelancer : null;
            const firstName = (freelancer as any)?.firstName || "";
            const lastName = (freelancer as any)?.lastName || "";
            const fullName = `${firstName} ${lastName}`.toLowerCase();
            const coverLetter = proposal.coverLetter?.toLowerCase() || "";

            return fullName.includes(searchTerm) || coverLetter.includes(searchTerm);
        });
    }, [proposals, query]);

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper space-y-6">

                {/* Job Header Card */}
                <JobHeaderCard job={job} loading={isLoading} />

                {/* Proposal Status Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {PROPOSAL_TABS.map((tab) => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setPage(1);
                                }}
                                className={`text-label-md rounded-md px-4 py-2 transition-colors cursor-pointer capitalize ${active
                                    ? "bg-primary text-on-primary"
                                    : "bg-surface-container text-on-surface-variant border border-outline-variant hover:border-outline"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search & Filters Bar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-55">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by candidate name or proposal text…"
                            className="w-full bg-surface-container border border-outline-variant rounded-md pl-9 pr-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <FilterSelect
                        label={selectedSort}
                        options={["Sort: Best Match", "Sort: Lowest Bid", "Sort: Highest Rating"]}
                        icon={ArrowUpDown}
                        onSelect={(val) => setSelectedSort(val)}
                    />

                </div>

                {/* Candidate Proposals List / Loading State */}
                {isLoading ? (
                    <SmallLoading />
                ) : (
                    <div className={`gap-5 flex flex-col`}>
                        {filteredProposals.map((proposal) => (
                            <JobProposalCard
                                key={proposal._id}
                                proposal={proposal}
                                onAccept={handleAcceptProposal}
                                onReject={handleRejectProposal}
                                isUpdating={updatingProposalId === proposal._id}
                            />
                        ))}

                        {filteredProposals.length === 0 && (
                            <div className="card text-center text-body-md text-on-surface-variant py-12!">
                                No candidates match your current search or filter settings.
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination Controls */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={PAGE_SIZE}
                    totalItems={totalProposals}
                    onPageChange={(newPage) => setPage(newPage)}
                    isLoading={isLoading}
                    itemLabel="proposals"
                />

            </div>
        </main>
    );
}