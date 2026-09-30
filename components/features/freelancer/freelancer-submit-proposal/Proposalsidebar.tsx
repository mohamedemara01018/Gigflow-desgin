'use client'
import ClientInfoCard from "@/components/ui/ClientInfoCard";
import { IJob } from "@/services/jobs.service";
import { CheckCircle2 } from "lucide-react";



const PROPOSAL_TIPS = [
    "Reference Aura's multi-platform component ecosystem.",
    "Set realistic milestones with clear sprint demo gates.",
    "Attach tangible design docs or Figma previews.",
];

export default function ProposalSidebar({ job }: { job: IJob }) {
    return (
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">

            <ClientInfoCard client={job.client} />

            <div className="card p-5!">
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