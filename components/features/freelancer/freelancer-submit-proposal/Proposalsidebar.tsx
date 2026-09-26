'use client'
import { CheckCircle2, Star, MapPin } from "lucide-react";

const CLIENT_STATS = [
    { label: "Payment Status", value: "Payment Verified", tone: "primary" as const },
    { label: "Client Rating", value: "5.0 (38 Reviews)", tone: "neutral" as const, star: true },
    { label: "Total Spend", value: "$148k+ spent on GigFlow", tone: "neutral" as const },
    { label: "Hire Rate", value: "88% (23 Hires)", tone: "neutral" as const },
];

const PROPOSAL_TIPS = [
    "Reference Aura's multi-platform component ecosystem.",
    "Set realistic milestones with clear sprint demo gates.",
    "Attach tangible design docs or Figma previews.",
];

export default function ProposalSidebar() {
    return (
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="card !p-5">
                <h2 className="text-headline-md text-on-surface">About the Client</h2>

                <div className="flex items-center gap-3 mt-4">
                    <span className="w-11 h-11 rounded-full bg-secondary text-on-secondary text-label-md flex items-center justify-center shrink-0">
                        MV
                    </span>
                    <div className="min-w-0">
                        <p className="text-body-md text-on-surface truncate">Marcus Vance</p>
                        <p className="text-label-sm text-on-surface-variant truncate">VP of Design, Aura Technologies Inc.</p>
                        <p className="flex items-center gap-1 text-label-sm text-on-surface-variant mt-0.5">
                            <MapPin size={11} />
                            San Francisco, CA (PST UTC-8)
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-outline-variant">
                    {CLIENT_STATS.map(({ label, value, tone, star }) => (
                        <div key={label} className="flex items-center justify-between gap-3">
                            <p className="text-label-sm text-on-surface-variant">{label}</p>
                            <p
                                className={`flex items-center gap-1 text-body-sm ${tone === "primary" ? "text-primary" : "text-on-surface"
                                    }`}
                            >
                                {tone === "primary" && <CheckCircle2 size={13} />}
                                {star && <Star size={12} className="fill-tertiary text-tertiary" />}
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant">
                    <p className="text-label-md text-on-surface">Recent Freelancer Feedback</p>
                    <div className="flex items-center gap-0.5 mt-1.5 text-tertiary">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={13} className="fill-tertiary" />
                        ))}
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-2 italic">
                        &ldquo;Marcus provides the clearest specs and instant feedback during sprint milestone
                        approvals. Exceptional enterprise client.&rdquo;
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1.5">— Senior React Engineer (Jan 2025)</p>
                </div>
            </div>

            <div className="card !p-5">
                <h2 className="text-headline-md text-on-surface">Proposal Tips</h2>
                <p className="text-body-sm text-on-surface-variant mt-1">
                    Freelancers who mention specific design token tooling and provide 3 clear deliverables have a
                    4.2x higher interview conversion.
                </p>
                <ul className="flex flex-col gap-2 mt-3">
                    {PROPOSAL_TIPS.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-body-sm text-on-surface-variant">
                            <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}