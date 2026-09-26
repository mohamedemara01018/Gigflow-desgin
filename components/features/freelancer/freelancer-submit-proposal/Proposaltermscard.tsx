'use client';

import { ShieldCheck } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { DeliveryDurationUnit } from "@/utils/enums.utils";

interface ProposalTermsCardProps {
    projectBid: string;
    setProjectBid: Dispatch<SetStateAction<string>>;
    durationValue: string;
    setDurationValue: Dispatch<SetStateAction<string>>;
    durationUnit: DeliveryDurationUnit;
    setDurationUnit: Dispatch<SetStateAction<DeliveryDurationUnit>>;
    platformFee: number;
    netReceive: number;
}

function formatCurrency(value: number) {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ProposalTermsCard({
    projectBid,
    setProjectBid,
    durationValue,
    setDurationValue,
    durationUnit,
    setDurationUnit,
    platformFee,
    netReceive,
}: ProposalTermsCardProps) {
    return (
        <section className="card">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-headline-md text-on-surface">Proposal Terms</h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Define your project pricing, platform escrow fees, and delivery timeline.
                    </p>
                </div>
                <span className="flex items-center gap-1.5 text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded shrink-0">
                    <ShieldCheck size={13} />
                    Escrow Protected
                </span>
            </div>

            {/* Price Calculations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                <div>
                    <label htmlFor="totalBid" className="text-label-md text-on-surface">
                        Total Bid Price
                    </label>
                    <div className="relative mt-2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                        <input
                            id="totalBid"
                            type="number"
                            min={0}
                            value={projectBid}
                            onChange={(e) => setProjectBid(e.target.value)}
                            className="w-full bg-surface-container-high border border-outline-variant rounded-md pl-8 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <p className="text-label-sm text-on-surface-variant mt-1.5">Client proposal budget</p>
                </div>

                <div>
                    <p className="text-label-md text-on-surface">GigFlow Fee (10%)</p>
                    <p className="text-body-lg text-error mt-2 py-3">-{formatCurrency(platformFee)}</p>
                    <p className="text-label-sm text-on-surface-variant mt-1.5">Platform handling & insurance</p>
                </div>

                <div>
                    <p className="text-label-md text-on-surface">You&apos;ll Receive (Net)</p>
                    <p className="text-body-lg text-primary mt-2 py-3">{formatCurrency(netReceive)}</p>
                    <p className="text-label-sm text-on-surface-variant mt-1.5">Transferred to your linked vault</p>
                </div>
            </div>

            {/* Delivery Duration */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                <div>
                    <label htmlFor="duration" className="text-label-md text-on-surface">
                        Estimated Delivery Duration
                    </label>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">How long will it take to finish the scope?</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <input
                        id="duration"
                        type="number"
                        min={1}
                        value={durationValue}
                        onChange={(e) => setDurationValue(e.target.value)}
                        className="w-16 text-center bg-surface-container-high border border-outline-variant rounded-md px-2 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                    />
                    <select
                        aria-label="Delivery Duration Unit"
                        value={durationUnit}
                        onChange={(e) => setDurationUnit(e.target.value as DeliveryDurationUnit)}
                        className="bg-surface-container-high border border-outline-variant rounded-md px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    >

                        {
                            Object.values(DeliveryDurationUnit).map((option) => {
                                return <> <option value={option}>{option}</option></>
                            })
                        }

                    </select>
                </div>
            </div>
        </section>
    );
}