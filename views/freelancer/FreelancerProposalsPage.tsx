/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useState } from "react";
import {
    Search,
    ChevronDown,
    Loader2,
} from "lucide-react";
import ProposalCard from "@/components/features/freelancer/freelancer-proposals/Proposalcard";
import { proposalService, IProposal } from "@/services/proposal.service";



export default function FreelancerProposalsPage() {
    const [proposals, setProposals] = useState<IProposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [selectedDurationUnit, setSelectedDurationUnit] = useState("All");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest">("newest");

    // Fetch dynamic proposals on mount
    useEffect(() => {
        const fetchProposals = async () => {
            try {
                setLoading(true);
                const response = await proposalService.getAllProposals();
                setProposals(response.data.proposals);
            } catch (err: any) {
                setError(err.message || "Failed to load proposals.");
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, []);


    // Filtered and sorted proposals list
    const filteredProposals = useMemo(() => {

        return proposals
            .filter((proposal) => {


                // Search query matching
                const jobTitle = typeof proposal.job === "object" ? proposal.job.title : "";
                const clientObj = typeof proposal.job === "object" ? proposal.job.client : null;
                const clientName = typeof clientObj === "object" && clientObj ? `${clientObj.firstName} ${clientObj.lastName}` : "";

                const matchesQuery =
                    query.trim().length === 0 ||
                    jobTitle.toLowerCase().includes(query.trim().toLowerCase()) ||
                    clientName.toLowerCase().includes(query.trim().toLowerCase()) ||
                    proposal.coverLetter.toLowerCase().includes(query.trim().toLowerCase());

                // Duration filter matching
                const matchesDuration =
                    selectedDurationUnit === "All" ||
                    proposal.estimatedDuration?.unit?.toLowerCase() === selectedDurationUnit.toLowerCase();

                return matchesQuery && matchesDuration;
            })
            .sort((a, b) => {
                if (sortOrder === "oldest") {
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                }
                if (sortOrder === "highest") {
                    return b.bidAmount - a.bidAmount;
                }
                // Default: Newest first
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            });
    }, [proposals, query, selectedDurationUnit, sortOrder]);

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper">
                <div className="flex flex-wrap items-start justify-between gap-4 mt-2">
                    <div className="max-w-160">
                        <h1 className="text-headline-lg text-on-surface">My Proposals & Bids</h1>
                        <p className="text-body-md text-on-surface-variant mt-2">
                            Track active bids, client views, submitted attachments, and offer statuses across your
                            submitted proposals.
                        </p>
                    </div>
                </div>

                {/* Tabs + Search/Filters */}
                <div className="card mt-6 p-5!">


                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        <div className="relative flex-1 min-w-55">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search proposals by job title, client, or details…"
                                className="w-full bg-surface-container-highest border border-outline-variant rounded-md pl-9 pr-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <FilterSelect
                            value={selectedDurationUnit}
                            onChange={(e) => setSelectedDurationUnit(e.target.value)}
                            options={[
                                { label: "Duration: All Units", value: "All" },
                                { label: "Hours", value: "hours" },
                                { label: "Days", value: "days" },
                                { label: "Weeks", value: "weeks" },
                                { label: "Months", value: "months" },
                            ]}
                        />

                        <FilterSelect
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as any)}
                            options={[
                                { label: "Sort: Newest First", value: "newest" },
                                { label: "Sort: Oldest First", value: "oldest" },
                                { label: "Sort: Highest Bid", value: "highest" },
                            ]}
                        />
                    </div>
                </div>

                {/* Proposals List State Handling */}
                <div className="flex flex-col gap-5 mt-6">
                    {loading && (
                        <div className="card flex items-center justify-center text-body-md text-on-surface-variant py-12! gap-3">
                            <Loader2 className="animate-spin text-primary" size={20} />
                            Fetching your submitted proposals...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="card text-center text-body-md text-error py-12!">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredProposals.map((proposal) => (
                        <ProposalCard key={proposal._id} proposal={proposal} />
                    ))}

                    {!loading && !error && filteredProposals.length === 0 && (
                        <div className="card text-center text-body-md text-on-surface-variant py-12!">
                            No proposals match your current filters.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}


function FilterSelect({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { label: string; value: string }[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="appearance-none bg-surface-container-highest border border-outline-variant rounded-md pl-4 pr-9 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
        </div>
    );
}