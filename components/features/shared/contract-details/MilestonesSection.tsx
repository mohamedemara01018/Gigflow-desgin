'use client'
import { Plus, Lock, Clock, CalendarClock, CheckCheck, FileArchive, Eye, FileText } from "lucide-react";
import { MILESTONES, type Milestone } from "@/views/contract-details/contract-details.data";

const statusBadgeClass: Record<Milestone["status"], string> = {
    submitted: "bg-primary-container/15 text-primary",
    "awaiting-deposit": "bg-surface-container-high text-on-surface-variant",
    planned: "bg-surface-container-high text-on-surface-variant",
};

const numberBadgeClass: Record<Milestone["status"], string> = {
    submitted: "bg-primary text-on-primary",
    "awaiting-deposit": "bg-surface-container-high text-on-surface-variant",
    planned: "bg-surface-container-high text-on-surface-variant",
};

function MilestoneCard({ milestone }: { milestone: Milestone }) {
    const expanded = milestone.status === "submitted";

    return (
        <article className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-label-md shrink-0 ${numberBadgeClass[milestone.status]}`}
                    >
                        {milestone.index}
                    </span>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-label-sm rounded px-2 py-0.5 ${statusBadgeClass[milestone.status]}`}>
                                {milestone.statusLabel}
                            </span>
                            {milestone.secondaryBadge && (
                                <span className="flex items-center gap-1 text-label-sm text-on-surface-variant bg-surface-container-high rounded px-2 py-0.5">
                                    {milestone.status === "submitted" && <Lock size={11} />}
                                    {milestone.secondaryBadge}
                                </span>
                            )}
                        </div>
                        <h3 className="text-body-lg text-on-surface mt-1.5">{milestone.title}</h3>
                        <p className="text-body-sm text-on-surface-variant mt-1">{milestone.description}</p>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-label-sm text-on-surface-variant">Milestone Value</p>
                    <p className="text-headline-md text-on-surface mt-0.5">{milestone.value}</p>
                    <p
                        className={`flex items-center justify-end gap-1 text-label-sm mt-0.5 ${milestone.dueUrgent ? "text-error" : "text-on-surface-variant"
                            }`}
                    >
                        {milestone.dueUrgent ? <Clock size={12} /> : <CalendarClock size={12} />}
                        {milestone.dueLabel}
                    </p>
                </div>
            </div>

            {expanded && milestone.deliverables && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4 mt-4">
                    <p className="text-label-sm text-on-surface-variant">PHASE DELIVERABLES & VERIFICATION SCOPE</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        {milestone.deliverables.map((item) => (
                            <p key={item} className="flex items-start gap-2 text-body-sm text-on-surface-variant">
                                <CheckCheck size={14} className="text-primary shrink-0 mt-0.5" />
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {expanded && milestone.submission && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-4 mt-3">
                    <p className="text-body-sm text-on-surface">
                        <span className="font-medium">Work Submitted by {milestone.submission.author}</span>{" "}
                        <span className="text-on-surface-variant">{milestone.submission.date}</span>
                    </p>
                    <p className="text-body-sm text-on-surface-variant italic mt-1.5">&ldquo;{milestone.submission.quote}&rdquo;</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {milestone.submission.attachments.map((file) => (
                            <span
                                key={file.name}
                                className="flex items-center gap-1.5 text-label-sm text-on-surface-variant bg-surface-container-high rounded px-2.5 py-1"
                            >
                                {file.meta ? <FileArchive size={12} className="text-primary" /> : <Eye size={12} className="text-primary" />}
                                {file.name}
                                {file.meta && <span className="text-on-surface-variant/70">({file.meta})</span>}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {milestone.status === "submitted" && (
                <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
                    <button className="bg-surface-variant text-on-surface-variant text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                        Request Revision
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                        <CheckCheck size={15} />
                        Approve & Release {milestone.value}
                    </button>
                </div>
            )}

            {milestone.status === "awaiting-deposit" && (
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                    <p className="text-body-sm text-on-surface-variant">{milestone.fundingNote}</p>
                    <button className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0">
                        <FileText size={15} />
                        {milestone.fundingAction}
                    </button>
                </div>
            )}
        </article>
    );
}

export default function MilestonesSection() {
    return (
        <section>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-headline-lg text-on-surface">Milestones Lifecycle Engine</h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Deliverables, verification steps, and escrow release controls.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface text-label-md rounded-md px-4 py-2.5 hover:bg-surface-container-low transition-colors cursor-pointer shrink-0">
                    <Plus size={15} />
                    Propose Milestone Modification
                </button>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                {MILESTONES.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                ))}
            </div>
        </section>
    );
}
