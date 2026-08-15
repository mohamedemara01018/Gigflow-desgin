"use client";

import { Briefcase, Flag, Inbox } from "lucide-react";
import { useState } from "react";

type FeedState = "live" | "loading" | "empty";

interface ActivityItem {
    id: string;
    timestamp: string;
    title: React.ReactNode;
    description: string;
    avatar:
    | { type: "image"; src: string; alt: string }
    | { type: "icon"; icon: typeof Briefcase; toneClass: string };
}

const ACTIVITY_ITEMS: ActivityItem[] = [
    {
        id: "1",
        timestamp: "2 min ago",
        title: (
            <>
                <strong className="font-semibold">Sarah Jenkins</strong> submitted a
                verification request
            </>
        ),
        description: "Identity verification document uploaded. Pending manual review.",
        avatar: {
            type: "image",
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnQJOVzDpn4HRUQ995oDK8vNKEldnD0Vb_ZKIOFY-5251x_rTcJi3UMcPejacZ6ha9vAvgsnoW77j0mfzWS5-A5LkmhDKDHbynaLIPourfV2xS9bn2CdCZhFvwV91CcMAGbQKV_iMxq_9UcSMXqIxCcxf7jZu-SuWIc0KLd2FJu2cJHwd3uFonwt8Gzqizy9w9tBiuwlyef-4kXv_YtQ1tfeh2W2NmQHcRVZSyMXA3HtxRDHWznYSvknNbzV5N6aol7B-Ghwdf82c",
            alt: "Sarah Jenkins",
        },
    },
    {
        id: "2",
        timestamp: "15 min ago",
        title: (
            <>
                <strong className="font-semibold">New Job Posted</strong> by TechCorp
                Inc.
            </>
        ),
        description: '"Senior React Developer for Enterprise SaaS" - Budget: $8,000',
        avatar: { type: "icon", icon: Briefcase, toneClass: "bg-primary text-on-primary" },
    },
    {
        id: "3",
        timestamp: "1 hour ago",
        title: (
            <>
                <strong className="font-semibold">Report Filed</strong> on user
                @dev_ninja
            </>
        ),
        description: "Reason: Suspected plagiarized portfolio items.",
        avatar: {
            type: "icon",
            icon: Flag,
            toneClass: "bg-error-container text-on-error-container",
        },
    },
];

const TOGGLES: { id: FeedState; label: string }[] = [
    { id: "live", label: "Live Feed" },
    { id: "loading", label: "Loading State" },
    { id: "empty", label: "Empty State" },
];

function ActivityRow({ item }: { item: ActivityItem }) {
    return (
        <div className="flex items-start gap-4 py-4">
            {item.avatar.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={item.avatar.src}
                    alt={item.avatar.alt}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                />
            ) : (
                <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.avatar.toneClass}`}
                >
                    <item.avatar.icon size={18} />
                </span>
            )}

            <div className="flex-1 min-w-0">
                <p className="text-body-md text-on-surface">{item.title}</p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">
                    {item.description}
                </p>
            </div>

            <span className="text-body-sm text-on-surface-variant shrink-0">
                {item.timestamp}
            </span>
        </div>
    );
}

function LoadingRows() {
    return (
        <div className="flex flex-col divide-y divide-outline-variant">
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start gap-4 py-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="h-3.5 w-2/5 rounded bg-surface-container-high" />
                        <div className="h-3 w-3/5 rounded bg-surface-container-high" />
                    </div>
                    <div className="h-3 w-16 rounded bg-surface-container-high shrink-0" />
                </div>
            ))}
        </div>
    );
}

function EmptyRows() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-on-surface-variant">
            <Inbox size={28} />
            <p className="text-body-md">No recent activity to show.</p>
        </div>
    );
}

function RecentActivity() {
    const [state, setState] = useState<FeedState>("live");

    return (
        <section className="card">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-headline-md text-on-surface">Recent Activity</h2>
                <div className="flex items-center gap-2">
                    {TOGGLES.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setState(id)}
                            className={`text-body-sm px-3.5 py-1.5 rounded-full transition-colors ${state === id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-on-surface-variant hover:bg-surface-container-low"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 divide-y divide-outline-variant">
                {state === "live" &&
                    ACTIVITY_ITEMS.map((item) => <ActivityRow key={item.id} item={item} />)}
                {state === "loading" && <LoadingRows />}
                {state === "empty" && <EmptyRows />}
            </div>
        </section>
    );
}

export default RecentActivity;