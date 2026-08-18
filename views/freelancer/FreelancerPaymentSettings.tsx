"use client";

import {
    Landmark,
    Plus,
    ChevronDown,
    FileText,
    Loader2,
} from "lucide-react";
import { useState } from "react";




export default function FreelancerPaymentSettings() {

    const [taxDocsLoading] = useState(true);

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Payments &amp; Notifications
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

                <section className="card min-h-45 flex items-center justify-center">
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
        </div>
    );
}