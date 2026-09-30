"use client";

import { Check, X } from "lucide-react";
import { IProposal } from "@/services/proposal.service";
import { ProposalStatus } from "@/utils/enums.utils";

interface LifecycleCardProps {
    proposal?: IProposal | null;
}

type StepState = "done" | "active" | "pending" | "rejected";

interface LifecycleStep {
    title: string;
    detail: string[];
    state: StepState;
}

export default function LifecycleCard({ proposal }: LifecycleCardProps) {
    if (!proposal) return null;

    const statusStr = (proposal.status || "PENDING").toString().toUpperCase();
    const isWithdrawn = statusStr === ProposalStatus.WITHDRAWN || statusStr === "WITHDRAWN";
    const isRejected = statusStr === ProposalStatus.REJECTED || statusStr === "REJECTED";
    const isAccepted = statusStr === ProposalStatus.ACCEPTED || statusStr === "ACCEPTED";
    const isShortlisted = statusStr === ProposalStatus.SHORTLISTED || statusStr === "SHORTLISTED";

    const submittedDate = proposal.createdAt
        ? new Date(proposal.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : null;

    const viewedDate = proposal.viewedAt
        ? new Date(proposal.viewedAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : null;

    const getStepState = (
        isCurrentDone: boolean,
        isPreviousDone: boolean,
        isTerminalFailed: boolean
    ): StepState => {
        if (isTerminalFailed) return "rejected";
        if (isCurrentDone) return "done";
        if (isPreviousDone) return "active";
        return "pending";
    };

    const isStep1Done = true;
    const isStep2Done = Boolean(proposal.clientViewed || proposal.viewedAt);
    const isStep3Done = isShortlisted || isAccepted;
    const isStep4Done = isAccepted;

    const steps: LifecycleStep[] = [
        {
            title: "Proposal Submitted",
            detail: submittedDate ? [submittedDate] : ["Submitted to client"],
            state: "done",
        },
        {
            title: "Opened & Reviewed",
            detail: isStep2Done
                ? viewedDate
                    ? [`Reviewed on ${viewedDate}`]
                    : ["Client opened proposal"]
                : ["Awaiting client review"],
            state: getStepState(isStep2Done, isStep1Done, isWithdrawn || isRejected),
        },
        {
            title: "Candidate Shortlisted",
            detail: isStep3Done
                ? ["Profile flagged for interviews"]
                : isRejected
                    ? ["Proposal declined by client"]
                    : isWithdrawn
                        ? ["Proposal withdrawn by freelancer"]
                        : ["Pending client evaluation"],
            state: isRejected || isWithdrawn
                ? "rejected"
                : getStepState(isStep3Done, isStep2Done, false),
        },
        {
            title: "Contract Offer & Escrow",
            detail: isStep4Done
                ? ["Offer accepted & escrow funded"]
                : ["Pending contract offer"],
            state: getStepState(isStep4Done, isStep3Done, isWithdrawn || isRejected),
        },
    ];

    const getStatusBadge = () => {
        if (isAccepted) return { label: "Accepted", className: "text-primary bg-primary-container/15" };
        if (isShortlisted) return { label: "Shortlisted", className: "text-primary bg-primary-container/15" };
        if (isWithdrawn) return { label: "Withdrawn", className: "text-on-surface-variant bg-surface-container-high" };
        if (isRejected) return { label: "Rejected", className: "text-error bg-error-container/20" };
        return { label: "In Review", className: "text-primary bg-primary-container/15" };
    };

    const badge = getStatusBadge();

    return (
        <section className="card !p-5">
            <div className="flex items-center justify-between">
                <h2 className="text-headline-md text-on-surface">Proposal Lifecycle</h2>
                <span className={`text-label-sm px-2.5 py-1 rounded capitalize ${badge.className}`}>
                    {badge.label}
                </span>
            </div>

            <div className="flex flex-col mt-4">
                {steps.map((step, i) => (
                    <div key={step.title} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.state === "done"
                                        ? "bg-primary text-on-primary"
                                        : step.state === "active"
                                            ? "bg-surface-container-lowest border-2 border-primary"
                                            : step.state === "rejected"
                                                ? "bg-error text-on-error"
                                                : "bg-surface-container-lowest border border-outline-variant"
                                    }`}
                            >
                                {step.state === "done" && <Check size={12} />}
                                {step.state === "rejected" && <X size={12} />}
                                {step.state === "active" && (
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                )}
                            </span>
                            {i < steps.length - 1 && (
                                <span
                                    className={`w-0.5 flex-1 min-h-[28px] ${step.state === "done" ? "bg-primary" : "bg-outline-variant"
                                        }`}
                                />
                            )}
                        </div>
                        <div className="pb-4">
                            <p
                                className={`text-body-md ${step.state === "pending"
                                        ? "text-on-surface-variant"
                                        : step.state === "rejected"
                                            ? "text-error"
                                            : "text-on-surface"
                                    }`}
                            >
                                {step.title}
                            </p>
                            {step.detail.map((line) => (
                                <p key={line} className="text-label-sm text-on-surface-variant">
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}