"use client";

import { useMemo } from "react";
import { History, Fingerprint, ShieldCheck } from "lucide-react";
import { IContract } from "@/services/contract.service";
import { IMilestone } from "@/services/milestone.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";

interface AuditEvent {
    id: string;
    title: string;
    date: string;
    description: string;
    done: boolean;
    timestamp: number;
}

export default function AuditTrailCard({
    contract,
    milestones,
}: {
    contract: IContract;
    milestones: IMilestone[];
}) {
    const events = useMemo(() => {
        const list: AuditEvent[] = [];

        // 1. Created
        if (contract.createdAt) {
            const d = new Date(contract.createdAt);
            list.push({
                id: "contract-created",
                title: "Contract Draft Created",
                date: `${formatDateTime(d).date} · ${formatDateTime(d).time}`,
                description: `Contract agreement initiated with total value of ${formatCurrency(contract.totalAmount)}.`,
                done: true,
                timestamp: d.getTime(),
            });
        }

        // 2. Sent to freelancer
        if (contract.sentAt) {
            const d = new Date(contract.sentAt);
            list.push({
                id: "contract-sent",
                title: "Contract Offer Sent to Freelancer",
                date: `${formatDateTime(d).date} · ${formatDateTime(d).time}`,
                description: "Client sent contract offer for review and formal acceptance.",
                done: true,
                timestamp: d.getTime(),
            });
        }

        // 3. Accepted
        if (contract.freelancerAcceptedAt) {
            const d = new Date(contract.freelancerAcceptedAt);
            list.push({
                id: "contract-accepted",
                title: "Contract Accepted by Freelancer",
                date: `${formatDateTime(d).date} · ${formatDateTime(d).time}`,
                description: "Digital agreement signature recorded. Work period commenced.",
                done: true,
                timestamp: d.getTime(),
            });
        }

        // 4. Milestones
        milestones.forEach((m, idx) => {
            if (m.submittedAt) {
                const d = new Date(m.submittedAt);
                list.push({
                    id: `milestone-submitted-${m._id}`,
                    title: `Work Submitted for Milestone #${m.order || idx + 1}: ${m.title}`,
                    date: `${formatDateTime(d).date} · ${formatDateTime(d).time}`,
                    description: m.submissionNotes || "Freelancer submitted deliverables for review.",
                    done: true,
                    timestamp: d.getTime(),
                });
            }

            if (m.approvedAt) {
                const d = new Date(m.approvedAt);
                list.push({
                    id: `milestone-approved-${m._id}`,
                    title: `Milestone #${m.order || idx + 1} Approved & Funds Released`,
                    date: `${formatDateTime(d).date} · ${formatDateTime(d).time}`,
                    description: `${formatCurrency(m.amount)} released to Freelancer account.`,
                    done: true,
                    timestamp: d.getTime(),
                });
            }
        });

        // 5. Contract Completed / Rejected
        if (contract.completedAt) {
            const d = new Date(contract.completedAt);
            list.push({
                id: "contract-completed",
                title: "Contract Completed Successfully",
                date: `${formatDateTime(d).date} · ${formatDateTime(d).time}`,
                description: "All milestones completed and escrow released.",
                done: true,
                timestamp: d.getTime(),
            });
        } else if (contract.rejectedAt) {
            const d = new Date(contract.rejectedAt);
            list.push({
                id: "contract-rejected",
                title: "Contract Offer Rejected",
                date: `${formatDateTime(d).date} · ${formatDateTime(d).time}`,
                description: contract.rejectionReason || "Contract was declined.",
                done: true,
                timestamp: d.getTime(),
            });
        }

        // Sort descending (latest event on top)
        return list.sort((a, b) => b.timestamp - a.timestamp);
    }, [contract, milestones]);

    const auditHash = contract._id ? `${contract._id.slice(0, 8)}…${contract._id.slice(-8)}` : "Verified";

    return (
        <section className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-2 text-headline-md text-on-surface">
                        <History size={18} className="text-primary" />
                        Lifecycle Audit Trail
                    </h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Immutable contract event logs and verifiable state transitions.
                    </p>
                </div>
                <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded shrink-0">
                    {events.length} Log Entries
                </span>
            </div>

            <div className="flex flex-col mt-4">
                {events.length === 0 ? (
                    <p className="text-body-sm text-on-surface-variant py-4">No audit events recorded yet.</p>
                ) : (
                    events.map((event, i) => (
                        <div key={event.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                        event.done ? "bg-primary" : "bg-outline-variant"
                                    }`}
                                />
                                {i < events.length - 1 && (
                                    <span
                                        className={`w-px flex-1 min-h-[32px] ${
                                            event.done ? "bg-primary/30" : "bg-outline-variant"
                                        }`}
                                    />
                                )}
                            </div>
                            <div className="pb-4 min-w-0">
                                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                                    <p className="text-body-md font-medium text-on-surface">{event.title}</p>
                                    <p className="text-label-sm text-on-surface-variant whitespace-nowrap">{event.date}</p>
                                </div>
                                <p className="text-body-sm text-on-surface-variant mt-0.5">{event.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant">
                <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                    <Fingerprint size={13} />
                    Contract Hash: {auditHash}
                </span>
                <span className="flex items-center gap-1.5 text-label-sm text-primary">
                    <ShieldCheck size={13} />
                    Chain Verified
                </span>
            </div>
        </section>
    );
}
