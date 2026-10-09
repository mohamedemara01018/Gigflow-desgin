/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ExternalLink, FileText, ArrowLeft } from "lucide-react";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { contractService, IContract } from "@/services/contract.service";
import { milestoneService, IMilestone } from "@/services/milestone.service";
import ContractHeaderCard from "@/components/features/shared/contract-details/Contractheadercard";
import PartyCard from "@/components/features/shared/contract-details/PartyCard";
import EscrowLedgerCard from "@/components/features/shared/contract-details/EscrowLedgerCard";
import MilestonesSection from "@/components/features/shared/contract-details/MilestonesSection";
import AuditTrailCard from "@/components/features/shared/contract-details/AuditTrailCard";
import TermsGovernanceCard from "@/components/features/shared/contract-details/TermsGovernanceCard";
import EmptyState from "@/components/ui/Emptystate";
import Loading from "@/components/ui/Loading";
import { IUserRef } from "@/services/contactSupport.service";

export default function ContractDetailsPage({ contractId }: { contractId: string }) {
    const router = useRouter();
    const { me } = useSelector(selectMeSlice);

    const [contract, setContract] = useState<IContract | null>(null);
    const [milestones, setMilestones] = useState<IMilestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!contractId) return;
        try {
            setLoading(true);
            setError(null);
            const contractRes = await contractService.getContractById(contractId);
            const contractData = contractRes.data.contract;
            setContract(contractData);

            if (contractData.milestones && contractData.milestones.length > 0) {
                setMilestones(contractData.milestones);
            } else {
                try {
                    const milestonesRes = await milestoneService.getContractMilestones(contractId);
                    setMilestones(milestonesRes.data.milestones || []);
                } catch (milestoneErr) {
                    console.error("Failed to load milestones:", milestoneErr);
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Failed to load contract details");
        } finally {
            setLoading(false);
        }
    }, [contractId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error || !contract) {
        return (
            <main className="bg-surface min-h-screen py-16">
                <div className="wrapper max-w-xl mx-auto card text-center p-8!">
                    <EmptyState
                        title="Contract Not Found"
                        description={error || "The requested contract does not exist or you do not have permission to view it."}
                    />
                    <button
                        onClick={() => router.push("/contracts")}
                        className="mt-4 inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-md text-label-md cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Back to Contracts
                    </button>
                </div>
            </main>
        );
    }

    const jobObj = typeof contract.job === "object" && contract.job !== null ? contract.job : null;
    const proposalId =
        typeof contract.proposal === "object" && contract.proposal !== null
            ? contract.proposal._id
            : contract.proposal;

    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper flex flex-col gap-6">
                {/* Breadcrumb */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push("/contracts")}
                            className="flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={14} />
                            Contracts
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        {jobObj?._id && (
                            <button
                                onClick={() => router.push(`/jobs/${jobObj._id}`)}
                                className="flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            >
                                <ExternalLink size={14} />
                                View Job Posting
                            </button>
                        )}
                        {proposalId && (
                            <button
                                onClick={() => router.push(`/proposals/${proposalId}`)}
                                className="flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            >
                                <FileText size={14} />
                                View Original Proposal
                            </button>
                        )}
                    </div>
                </div>

                <ContractHeaderCard contract={contract} currentUserId={me?._id} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <PartyCard role="client" user={contract.client as IUserRef} />
                    <PartyCard role="freelancer" user={contract.freelancer as IUserRef} />
                </div>

                <EscrowLedgerCard contract={contract} milestones={milestones} />

                <MilestonesSection
                    contract={contract}
                    milestones={milestones}
                    currentUserId={me?._id}
                    currentUserRole={me?.role}
                    onSuccess={loadData}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
                    <AuditTrailCard contract={contract} milestones={milestones} />
                    <div className="flex flex-col gap-5">
                        <TermsGovernanceCard contract={contract} />
                    </div>
                </div>
            </div>
        </main>
    );
}