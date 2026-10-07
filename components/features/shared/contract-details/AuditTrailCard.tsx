'use client'
import { History, Fingerprint, ShieldCheck } from "lucide-react";
import { AUDIT_HASH, AUDIT_TRAIL } from "@/views/contract-details/contract-details.data";

export default function AuditTrailCard() {
    return (
        <section className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-2 text-headline-md text-on-surface">
                        <History size={18} className="text-primary" />
                        Lifecycle Audit Trail
                    </h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Immutable Mongoose event logs & verifiable state transitions.
                    </p>
                </div>
                <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded shrink-0">
                    {AUDIT_TRAIL.length} Log Entries
                </span>
            </div>

            <div className="flex flex-col mt-4">
                {AUDIT_TRAIL.map((event, i) => (
                    <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${event.done ? "bg-primary" : "bg-outline-variant"}`} />
                            {i < AUDIT_TRAIL.length - 1 && (
                                <span className={`w-px flex-1 min-h-[32px] ${event.done ? "bg-primary/30" : "bg-outline-variant"}`} />
                            )}
                        </div>
                        <div className="pb-4 min-w-0">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                                <p className="text-body-md text-on-surface">{event.title}</p>
                                <p className="text-label-sm text-on-surface-variant whitespace-nowrap">{event.date}</p>
                            </div>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant">
                <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                    <Fingerprint size={13} />
                    SHA-256 Hash: {AUDIT_HASH}
                </span>
                <span className="flex items-center gap-1.5 text-label-sm text-primary">
                    <ShieldCheck size={13} />
                    Chain Verified
                </span>
            </div>
        </section>
    );
}
