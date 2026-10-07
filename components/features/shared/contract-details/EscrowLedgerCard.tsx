'use client'
import { Landmark, ShieldCheck, CreditCard } from "lucide-react";
import { ESCROW_LEDGER } from "@/views/contract-details/contract-details.data";

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const segmentTone: Record<string, string> = {
    secured: "bg-primary",
    pending: "bg-primary/40",
    planned: "bg-surface-container-high",
};

const legendDotTone: Record<string, string> = {
    secured: "bg-primary",
    pending: "bg-primary/40",
    planned: "bg-outline-variant",
};

export default function EscrowLedgerCard() {
    const l = ESCROW_LEDGER;
    const total = l.segments.reduce((sum, s) => sum + s.amount, 0);

    return (
        <section className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-2 text-headline-md text-on-surface">
                        <Landmark size={18} className="text-primary" />
                        SafePay Escrow Ledger
                    </h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Immutable client deposits held in trust until explicit milestone approvals.
                    </p>
                </div>
                <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded shrink-0">
                    <ShieldCheck size={13} />
                    FDIC-Insured Custodial Account
                </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                    <p className="text-label-sm text-on-surface-variant">Agreed Contract Total</p>
                    <p className="text-headline-md text-on-surface mt-1">
                        {money(l.contractTotal)} <span className="text-label-sm text-on-surface-variant">USD</span>
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1">Across {l.milestoneCount} Milestones</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                    <p className="text-label-sm text-on-surface-variant">Secured in Escrow</p>
                    <p className="text-headline-md text-primary mt-1">
                        {money(l.secured)} <span className="text-label-sm text-on-surface-variant">USD</span>
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1">Milestone 1 Funded ({l.securedPercent}%)</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                    <p className="text-label-sm text-on-surface-variant">Released / Paid to Date</p>
                    <p className="text-headline-md text-on-surface mt-1">
                        {money(l.released)} <span className="text-label-sm text-on-surface-variant">USD</span>
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1">{l.releasedNote}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4">
                    <p className="text-label-sm text-on-surface-variant">Scheduled Future Funding</p>
                    <p className="text-headline-md text-on-surface mt-1">
                        {money(l.scheduled)} <span className="text-label-sm text-on-surface-variant">USD</span>
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1">{l.scheduledNote}</p>
                </div>
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between">
                    <p className="text-label-sm text-on-surface-variant">Escrow Capital Allocation Status</p>
                    <p className="text-label-sm text-on-surface-variant">
                        {l.securedPercent}% Funded · {l.plannedPercent}% Planned
                    </p>
                </div>
                <div className="flex w-full h-2.5 rounded-full overflow-hidden mt-1.5 bg-surface-container-high">
                    {l.segments.map((seg) => (
                        <div
                            key={seg.label}
                            className={segmentTone[seg.tone]}
                            style={{ width: `${(seg.amount / total) * 100}%` }}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                    {l.segments.map((seg) => (
                        <span key={seg.label} className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            <span className={`w-2 h-2 rounded-full ${legendDotTone[seg.tone]}`} />
                            {seg.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-5 bg-primary-container/10 rounded-md p-4">
                <div className="flex items-center gap-3 min-w-0">
                    <CreditCard size={18} className="text-primary shrink-0" />
                    <div className="min-w-0">
                        <p className="text-body-md text-on-surface">Freelancer Net Yield Transparency</p>
                        <p className="text-body-sm text-on-surface-variant">
                            GigFlow {l.feePercent.toFixed(1)}% fixed commission fee deducted upon milestone release.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                        <p className="text-label-sm text-on-surface-variant">Platform Fee ({l.feePercent}%)</p>
                        <p className="text-body-md text-error">-{money(l.feeAmount)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-label-sm text-on-surface-variant">Estimated Net Payout</p>
                        <p className="text-body-lg text-primary font-semibold">{money(l.netPayout)}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
