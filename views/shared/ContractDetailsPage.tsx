'use client'
import { ExternalLink, FileText } from "lucide-react";
import ContractHeaderCard from "@/components/features/shared/contract-details/Contractheadercard";
import PartyCard from "@/components/features/shared/contract-details/PartyCard";
import EscrowLedgerCard from "@/components/features/shared/contract-details/EscrowLedgerCard";
import MilestonesSection from "@/components/features/shared/contract-details/MilestonesSection";
import AuditTrailCard from "@/components/features/shared/contract-details/AuditTrailCard";
import TermsGovernanceCard from "@/components/features/shared/contract-details/TermsGovernanceCard";
import ExecutedDocumentsCard from "@/components/features/shared/contract-details/ExecutedDocumentsCard";
import { CLIENT_PARTY, CONTRACT_SUMMARY, FREELANCER_PARTY } from "@/components/features/shared/contract-details/contract-details.data";


export default function ContractDetailsPage({ contractId }: { contractId: string }) {
    return (
        <main className="bg-surface min-h-screen py-8">
            <div className="wrapper flex flex-col gap-6">
                {/* Breadcrumb */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                        Contracts
                        <span>/</span>
                        {CONTRACT_SUMMARY.title}
                        <span>/</span>
                        <span className="text-primary">#{CONTRACT_SUMMARY.shortId}</span>
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                            <ExternalLink size={14} />
                            View Job Posting
                        </button>
                        <button className="flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                            <FileText size={14} />
                            View Original Proposal
                        </button>
                    </div>
                </div>

                <ContractHeaderCard />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <PartyCard party={CLIENT_PARTY} />
                    <PartyCard party={FREELANCER_PARTY} />
                </div>

                <EscrowLedgerCard />

                <MilestonesSection />

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
                    <AuditTrailCard />
                    <div className="flex flex-col gap-5">
                        <TermsGovernanceCard />
                        <ExecutedDocumentsCard />
                    </div>
                </div>
            </div>
        </main>
    );
}