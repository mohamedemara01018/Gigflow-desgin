"use client";

import {
    Landmark,
    Plus,
    ChevronDown,
    Bell,
    FileText,
    Loader2,
} from "lucide-react";
import { useState } from "react";

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
            <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-[var(--shadow-level-2)]" />
        </button>
    );
}

export default function FreelancerPaymentSettings() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    // Set to `false` once the tax documents request actually resolves.
    const [taxDocsLoading] = useState(true);

    const toggle = (id: string, key: ToggleKey) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, [key]: !n[key] } : n))
        );
    };

    return (
        <div>
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Payments &amp; Notifications
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2 max-w-[560px]">
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

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <section className="card">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-headline-md text-on-surface">
                                <Landmark size={20} className="text-primary" />
                                Withdrawal Methods
                            </span>
                            <button className="flex items-center gap-1.5 text-primary text-label-md font-medium hover:underline">
                                <Plus size={16} />
                                Add Method
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 mt-5">
                            <div className="flex items-center gap-3 bg-surface-container-low rounded-md p-4">
                                <span className="w-10 h-10 rounded-md bg-surface-container-high flex items-center justify-center">
                                    <Landmark size={18} className="text-on-surface-variant" />
                                </span>
                                <div className="flex-1">
                                    <span className="flex items-center gap-2">
                                        <p className="text-body-md font-medium text-on-surface">
                                            Chase Bank ****8921
                                        </p>
                                        <span className="text-label-sm bg-primary text-on-primary px-2 py-0.5 rounded-full">
                                            DEFAULT
                                        </span>
                                    </span>
                                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                                        USD • Checking Account
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-surface-container-low rounded-md p-4">
                                <span className="w-10 h-10 rounded-md bg-surface-container-high flex items-center justify-center text-secondary font-bold text-body-md">
                                    P
                                </span>
                                <div>
                                    <p className="text-body-md font-medium text-on-surface">
                                        alex.rivera@example.com
                                    </p>
                                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                                        EUR • PayPal Account
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="card">
                        <span className="flex items-center gap-2 text-headline-md text-on-surface">
                            <Landmark size={20} className="text-primary" />
                            Payment Preferences
                        </span>

                        <div className="grid sm:grid-cols-2 gap-6 mt-5">
                            <div>
                                <label className="text-body-sm font-medium text-on-surface block mb-2">
                                    Primary Currency
                                </label>
                                <div className="relative">
                                    <select
                                        defaultValue="USD - US Dollar"
                                        className="w-full appearance-none bg-surface-container-low rounded-md px-3.5 py-2.5 pr-9 text-body-md text-on-surface outline-none"
                                    >
                                        <option>USD - US Dollar</option>
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                                    />
                                </div>
                                <p className="text-body-sm text-on-surface-variant mt-2">
                                    Earnings will be converted to this currency before
                                    withdrawal.
                                </p>
                            </div>

                            <div>
                                <label className="text-body-sm font-medium text-on-surface block mb-2">
                                    Withdrawal Schedule
                                </label>
                                <div className="relative">
                                    <select
                                        defaultValue="Weekly (Every Wednesday)"
                                        className="w-full appearance-none bg-surface-container-low rounded-md px-3.5 py-2.5 pr-9 text-body-md text-on-surface outline-none"
                                    >
                                        <option>Weekly (Every Wednesday)</option>
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                                    />
                                </div>
                                <p className="text-body-sm text-on-surface-variant mt-2">
                                    Auto-withdraw balances over $100.00.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="card min-h-[180px] flex items-center justify-center">
                        {taxDocsLoading ? (
                            <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                                <Loader2 size={28} className="text-primary animate-spin" />
                                <p className="text-body-md font-medium text-on-surface">
                                    Loading Tax Documents…
                                </p>
                                <p className="text-body-sm">
                                    Fetching your latest W-9 and 1099 forms.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full flex items-center gap-2 text-headline-md text-on-surface">
                                <FileText size={20} className="text-primary" />
                                Tax Information
                            </div>
                        )}
                    </section>
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
        </div>
    );
}