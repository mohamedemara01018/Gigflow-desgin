"use client";

import { Landmark, ShieldCheck, CreditCard } from "lucide-react";
import { IContract } from "@/services/contract.service";
import { IMilestone } from "@/services/milestone.service";
import { formatCurrency, calculateNetAmount } from "@/utils/functions.utils";

interface Props {
    contract: IContract;
    milestones: IMilestone[];
}

// Reusable Metric Card Sub-component
function MetricCard({ label, amount, subtitle, highlight = false }: { label: string; amount: number; subtitle: string; highlight?: boolean }) {
    return (
        <div className="bg-surface-container-high border border-outline-variant rounded-md p-4">
            <p className="text-label-sm text-on-surface-variant">{label}</p>
            <p className={`text-headline-md mt-1 ${highlight ? "text-primary" : "text-on-surface"}`}>
                {formatCurrency(amount)} <span className="text-label-sm text-on-surface-variant">USD</span>
            </p>
            <p className="text-label-sm text-on-surface-variant mt-1">{subtitle}</p>
        </div>
    );
}

export default function EscrowLedgerCard({ contract, milestones }: Props) {
    const contractTotal = contract.totalAmount || 0;

    // Accumulate milestone sums in a single pass
    const { released, secured, scheduled } = milestones.reduce(
        (acc, m) => {
            const st = (m.status || "").toLowerCase();
            const amt = m.amount || 0;
            if (st === "completed") acc.released += amt;
            else if (st === "in_progress") acc.secured += amt;
            else acc.scheduled += amt;
            return acc;
        },
        { released: 0, secured: 0, scheduled: milestones.length === 0 ? contractTotal : 0 }
    );

    const getPercent = (amt: number) => (contractTotal > 0 ? Math.round((amt / contractTotal) * 100) : 0);
    const releasedPercent = getPercent(released);
    const securedPercent = getPercent(secured);
    const scheduledPercent = Math.max(0, 100 - securedPercent - releasedPercent);

    const feePercent = 10;
    const feeAmount = (contractTotal * feePercent) / 100;
    const netPayout = calculateNetAmount(contractTotal, feePercent / 100);

    const metrics = [
        { label: "Agreed Contract Total", amount: contractTotal, subtitle: `Across ${milestones.length} Milestones` },
        { label: "Active in Progress", amount: secured, subtitle: `Funded Escrow (${securedPercent}%)`, highlight: true },
        { label: "Released / Paid to Date", amount: released, subtitle: "Released to Freelancer Account" },
        { label: "Scheduled Future Funding", amount: scheduled, subtitle: "Upcoming Milestone Phases" },
    ];

    const legendItems = [
        { label: "Released", amount: released, bg: "bg-primary" },
        { label: "Active in Progress", amount: secured, bg: "bg-primary/50" },
        { label: "Scheduled", amount: scheduled, bg: "bg-outline-variant" },
    ];

    return (
        <section className="card">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-2 text-headline-md text-on-surface">
                        <Landmark size={18} className="text-primary" /> SafePay Escrow Ledger
                    </h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Immutable client deposits held in trust until explicit milestone approvals.
                    </p>
                </div>
                <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded shrink-0">
                    <ShieldCheck size={13} /> Direct Stripe Connect Custodial Account
                </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                {metrics.map((item, idx) => (
                    <MetricCard key={idx} {...item} />
                ))}
            </div>

            {/* Allocation Bar & Legend */}
            <div className="mt-5">
                <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
                    <p>Escrow Capital Allocation Status</p>
                    <p>{releasedPercent}% Released · {securedPercent}% Active · {scheduledPercent}% Scheduled</p>
                </div>
                <div className="flex w-full h-2.5 rounded-full overflow-hidden mt-1.5 bg-surface-container-high">
                    {releasedPercent > 0 && <div className="bg-primary" style={{ width: `${releasedPercent}%` }} />}
                    {securedPercent > 0 && <div className="bg-primary/50" style={{ width: `${securedPercent}%` }} />}
                    {scheduledPercent > 0 && <div className="bg-surface-container-highest" style={{ width: `${scheduledPercent}%` }} />}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                    {legendItems.map(({ label, amount, bg }, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            <span className={`w-2 h-2 rounded-full ${bg}`} />
                            {label} ({formatCurrency(amount)})
                        </span>
                    ))}
                </div>
            </div>

            {/* Net Yield Transparency Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-5 bg-primary-container/10 rounded-md p-4">
                <div className="flex items-center gap-3 min-w-0">
                    <CreditCard size={18} className="text-primary shrink-0" />
                    <div className="min-w-0">
                        <p className="text-body-md text-on-surface font-medium">Freelancer Net Yield Transparency</p>
                        <p className="text-body-sm text-on-surface-variant">
                            GigFlow {feePercent}% fixed platform commission fee deducted upon milestone release.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-right">
                    <div>
                        <p className="text-label-sm text-on-surface-variant">Platform Fee ({feePercent}%)</p>
                        <p className="text-body-md text-error font-medium">-{formatCurrency(feeAmount)}</p>
                    </div>
                    <div>
                        <p className="text-label-sm text-on-surface-variant">Estimated Net Payout</p>
                        <p className="text-body-lg text-primary font-semibold">{formatCurrency(netPayout)}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}