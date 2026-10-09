"use client";

import { FileText, ShieldCheck, Scale } from "lucide-react";
import { IContract } from "@/services/contract.service";

const icons = [FileText, ShieldCheck, Scale];

const DEFAULT_TERMS = [
    {
        title: "Full IP Transfer on Release",
        description:
            "All custom code, deliverables, and documentation transfer unconditionally to client immediately upon milestone escrow release.",
    },
    {
        title: "Mutual Confidentiality Active",
        description:
            "Both parties are bound by the standard GigFlow Master Confidentiality Agreement protecting proprietary code & data.",
    },
    {
        title: "SafePay 14-Day Dispute Arbitration",
        description:
            "Unresolved disputes are subject to binding GigFlow mediation before funds can be reversed or forfeited.",
    },
];

export default function TermsGovernanceCard({
    contract,
}: {
    contract?: IContract;
}) {
    const shortId = contract?._id ? `#CT-${contract._id.slice(-4).toUpperCase()}` : "#CONTRACT";

    return (
        <section className="card">
            <h2 className="flex items-center gap-2 text-headline-md text-on-surface">
                <FileText size={18} className="text-primary" />
                Terms &amp; Governance
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
                Legally binding covenants under contract {shortId}.
            </p>

            <div className="flex flex-col gap-3 mt-4">
                {DEFAULT_TERMS.map((term, i) => {
                    const Icon = icons[i % icons.length];
                    return (
                        <div
                            key={term.title}
                            className="flex items-start gap-3 bg-surface-container-high border border-outline-variant rounded-md p-3.5"
                        >
                            <span className="w-8 h-8 rounded-md bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
                                <Icon size={15} />
                            </span>
                            <div>
                                <p className="text-body-md text-on-surface font-medium">{term.title}</p>
                                <p className="text-body-sm text-on-surface-variant mt-0.5">{term.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
