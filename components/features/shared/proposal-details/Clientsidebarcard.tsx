'use client'
import { MapPin, MessageCircle } from "lucide-react";

const CLIENT_STATS = [
    { label: "Total Spend", value: "$148,000+" },
    { label: "Hire Rate", value: "88%" },
    { label: "Rating", value: "5.0★", sub: "38 Reviews" },
    { label: "Avg Response", value: "~2 Hours" },
];

export default function ClientSidebarCard() {
    return (
        <section className="card !p-5">
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
                        San Francisco, CA (PST)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                {CLIENT_STATS.map(({ label, value, sub }) => (
                    <div key={label} className="bg-surface-container-lowest border border-outline-variant rounded-md p-3">
                        <p className="text-body-lg text-primary">{value}</p>
                        <p className="text-label-sm text-on-surface-variant mt-0.5">{sub ?? label}</p>
                    </div>
                ))}
            </div>

            <button className="flex items-center justify-center gap-2 w-full bg-surface-variant text-on-surface-variant text-label-md rounded-md px-4 py-2.5 mt-4 hover:opacity-90 transition-opacity cursor-pointer">
                <MessageCircle size={15} />
                Open Conversation History
            </button>
        </section>
    );
}