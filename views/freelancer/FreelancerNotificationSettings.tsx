'use client'

import { Bell } from 'lucide-react';
import { useState } from 'react'


type ToggleKey = "inApp" | "email";

interface NotificationRow {
    id: string;
    label: string;
    description: string;
    inApp: boolean;
    email: boolean;
}


const INITIAL_NOTIFICATIONS: NotificationRow[] = [
    {
        id: "new_jobs",
        label: "New Job Recommendations",
        description: "Based on your saved searches and skills.",
        inApp: true,
        email: false,
    },
    {
        id: "messages",
        label: "Messages",
        description: "Direct messages from clients and admins.",
        inApp: true,
        email: true,
    },
    {
        id: "proposals",
        label: "Proposal Updates",
        description: "Viewed, interviewed, accepted, or declined.",
        inApp: true,
        email: true,
    },
    {
        id: "contracts",
        label: "Contract Updates",
        description: "Milestones, terms, or contract changes.",
        inApp: true,
        email: true,
    },
    {
        id: "payments",
        label: "Payment Notifications",
        description: "Funded milestones and completed withdrawals.",
        inApp: true,
        email: true,
    },
    {
        id: "announcements",
        label: "Announcements",
        description: "Product updates and platform news.",
        inApp: true,
        email: false,
    },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${checked ? "bg-primary justify-end" : "bg-surface-container-high justify-start"
                }`}
        >
            <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-(--shadow-level-2)" />
        </button>
    );
}



function FreelancerNotificationSettings() {

    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    // Set to `false` once the tax documents request actually resolves.

    const toggle = (id: string, key: ToggleKey) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, [key]: !n[key] } : n))
        );
    };


    return (

        <div className='space-y-8'>
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Notifications
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2 max-w-140">
                        Manage your earnings flow and control how GigFlow communicates
                        with you.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors">
                        Discard Changes
                    </button>
                    <button className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity">
                        Save Preferences
                    </button>
                </div>
            </div>
            <section className="card">
                <span className="flex items-center gap-2 text-headline-md text-on-surface">
                    <Bell size={20} className="text-primary" />
                    Notifications
                </span>
                <p className="text-body-sm text-on-surface-variant mt-1">
                    Control how and when you receive alerts.
                </p>

                <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center mt-5 pb-3 border-b border-outline-variant">
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Event Type
                    </span>
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant text-center">
                        In-App
                    </span>
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant text-center">
                        Email
                    </span>
                </div>

                <div className="flex flex-col divide-y divide-outline-variant">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center py-4"
                        >
                            <div>
                                <p className="text-body-md font-medium text-on-surface">
                                    {n.label}
                                </p>
                                <p className="text-body-sm text-on-surface-variant mt-0.5">
                                    {n.description}
                                </p>
                            </div>
                            <Toggle checked={n.inApp} onChange={() => toggle(n.id, "inApp")} />
                            <Toggle checked={n.email} onChange={() => toggle(n.id, "email")} />
                        </div>
                    ))}
                </div>
            </section>
        </div>

    )
}

export default FreelancerNotificationSettings