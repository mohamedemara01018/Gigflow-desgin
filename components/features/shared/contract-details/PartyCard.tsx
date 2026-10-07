'use client'
import Link from "next/link";
import { MapPin, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import type { ContractParty } from "@/views/contract-details/contract-details.data";

export default function PartyCard({ party }: { party: ContractParty }) {
    const isFreelancer = party.role === "freelancer";

    return (
        <section className="card">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="w-12 h-12 rounded-full bg-secondary text-on-secondary text-label-md flex items-center justify-center shrink-0">
                        {party.initials}
                    </span>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-body-lg text-on-surface truncate">{party.name}</p>
                            <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded shrink-0">
                                {party.role === "client" ? "Client" : "Freelancer"}
                            </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant truncate">{party.title}</p>
                        <p className="flex items-center gap-1 text-label-sm text-on-surface-variant mt-0.5">
                            <MapPin size={11} />
                            {party.location} · {party.localTime}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {party.tierBadge}
                    </span>
                    {isFreelancer && (
                        <Link
                            href="#"
                            className="flex items-center gap-1 text-label-sm text-primary hover:underline underline-offset-2"
                        >
                            Profile
                            <ArrowRight size={12} />
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
                {party.stats.map((stat) => (
                    <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-md p-3 text-center">
                        <p className="text-body-lg text-on-surface">{stat.value}</p>
                        <p className="text-label-sm text-on-surface-variant mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-outline-variant text-label-sm">
                <span className="flex items-center gap-1.5 text-primary">
                    {party.role === "client" ? <CheckCircle2 size={13} /> : <ShieldCheck size={13} />}
                    {party.footerLeft}
                </span>
                <span className="text-on-surface-variant">{party.footerRight}</span>
            </div>
        </section>
    );
}
