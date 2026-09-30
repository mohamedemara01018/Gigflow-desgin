"use client";

import { Clock } from "lucide-react";
import { IProposal } from "@/services/proposal.service";

interface BidEconomicsCardProps {
    proposal?: IProposal | null;
}

export default function BidEconomicsCard({ proposal }: BidEconomicsCardProps) {
    const bidAmount = proposal?.bidAmount ?? 0;
    const platformFeePercentage = 0.10; // 10% Platform Fee
    const platformFee = bidAmount * platformFeePercentage;
    const netTakeHome = bidAmount - platformFee;

    const durationValue = proposal?.estimatedDuration?.value;
    const durationUnit = proposal?.estimatedDuration?.unit;

    const formattedDuration =
        durationValue && durationUnit
            ? `${durationValue} ${durationValue === 1 ? durationUnit.replace(/s$/, "") : durationUnit}`
            : "N/A";

    const jobType = proposal?.job?.type
        ? `${proposal.job.type.charAt(0).toUpperCase()}${proposal.job.type.slice(1)}`
        : "Fixed-Price";

    return (
        <section className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-headline-md text-on-surface">
                        Proposal Terms & Bid Economics
                    </h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Structured as a {jobType.toLowerCase()} bid with 10% platform protection.
                    </p>
                </div>
                <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded shrink-0 capitalize">
                    <Clock size={13} />
                    Duration: {formattedDuration}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="bg-surface-container-highest border border-outline-variant rounded-md p-4">
                    <p className="text-label-sm text-on-surface-variant">Total Proposed Bid</p>
                    <p className="text-headline-md text-on-surface mt-1">
                        ${bidAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1">{jobType} Bid</p>
                </div>

                <div className="bg-surface-container-highest border border-outline-variant rounded-md p-4">
                    <p className="text-label-sm text-on-surface-variant">Platform Fee (10%)</p>
                    <p className="text-headline-md text-error mt-1">
                        -${platformFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1">GigFlow Escrow & Coverage</p>
                </div>

                <div className="bg-surface-container-highest border border-outline-variant rounded-md p-4">
                    <p className="text-label-sm text-on-surface-variant">Your Estimated Take-Home</p>
                    <p className="text-headline-md text-primary mt-1">
                        ${netTakeHome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1">100% Escrow Secured</p>
                </div>
            </div>
        </section>
    );
}