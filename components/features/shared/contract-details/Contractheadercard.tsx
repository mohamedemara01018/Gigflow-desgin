'use client'
import { MessageSquare, FileDown, MoreVertical, ShieldCheck, Lock } from "lucide-react";
import { CONTRACT_SUMMARY } from "./contract-details.data";

export default function ContractHeaderCard() {
    return (
        <section className="card">
            <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {CONTRACT_SUMMARY.badges[0]}
                </span>
                <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded">
                    {CONTRACT_SUMMARY.badges[1]}
                </span>
                <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded">
                    <Lock size={11} />
                    {CONTRACT_SUMMARY.badges[2]}
                </span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4 mt-2">
                <h1 className="text-headline-lg text-on-surface">{CONTRACT_SUMMARY.title}</h1>
                <div className="flex items-center gap-2 shrink-0">
                    <button className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                        <MessageSquare size={15} />
                        Message Alex
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-on-primary text-label-sm">
                            {CONTRACT_SUMMARY.unreadMessages}
                        </span>
                    </button>
                    <button className="flex items-center gap-2 bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                        <FileDown size={15} />
                        MSA Agreement (PDF)
                    </button>
                    <button
                        aria-label="More options"
                        className="w-10 h-10 flex items-center justify-center rounded-md bg-surface-variant text-on-surface-variant hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            <p className="text-body-sm text-on-surface-variant mt-2">
                {CONTRACT_SUMMARY.durationLabel} <span className="mx-1.5">·</span> Contract ID: {CONTRACT_SUMMARY.contractId}
            </p>

            <p className="flex items-center gap-1.5 text-body-sm text-primary mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {CONTRACT_SUMMARY.statusLabel}
            </p>
        </section>
    );
}