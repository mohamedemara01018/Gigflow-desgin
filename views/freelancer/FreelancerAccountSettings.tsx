
"use client";

import SelectField from "@/components/ui/SelectFeild";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import {
    User,
    UserCog,
    Briefcase,
    Lock,
    CreditCard,
    Bell,
    Contact,
    ShieldCheck,
    Globe,
    ChevronDown,
    PhoneCall,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

function VerifiedBadge() {
    return (
        <span className="flex items-center gap-1 text-label-sm bg-primary text-on-primary px-2.5 py-1 rounded-full">
            <CheckCircle2 size={12} />
            Verified
        </span>
    );
}


export default function FreelancerAccountSettings() {
    const { me } = useSelector(selectMeSlice);
    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Account Information
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Manage your basic account details and regional preferences.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors">
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity">
                        Save Changes
                        <CheckCircle2 size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <section className="card">
                    <span className="flex items-center gap-2 text-headline-md text-on-surface">
                        <Contact size={22} className="text-primary" />
                        Contact Information
                    </span>

                    <div className="grid sm:grid-cols-2 gap-4 mt-5">
                        <div className="bg-surface-container-low rounded-md p-4">
                            <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                                Email Address
                            </p>
                            <div className="flex items-center gap-2.5 mt-1.5">
                                <p className="text-body-md text-on-surface">
                                    {me?.email}
                                </p>
                                <VerifiedBadge />
                            </div>
                        </div>
                        {
                            me?.phone && (
                                <div className="bg-surface-container-low rounded-md p-4">
                                    <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                                        Phone Number
                                    </p>
                                    <div className="flex items-center gap-2.5 mt-1.5">
                                        <p className="text-body-md text-on-surface">{me.phone}</p>
                                        {

                                            me.isPhoneVerified ? <VerifiedBadge /> : ''
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>

                </section>

                <div className="grid sm:grid-cols-2 gap-6">
                    <section className="card">
                        <span className="flex items-center gap-2 text-headline-md text-on-surface">
                            <ShieldCheck size={22} className="text-on-surface" />
                            Account Status
                        </span>

                        <div className="flex flex-col divide-y divide-outline-variant mt-4">
                            <div className="flex items-center justify-between py-3">
                                <span className="text-body-md text-on-surface">
                                    Account Type
                                </span>
                                <span className="text-label-md bg-surface-container-high text-on-surface px-3 py-1 rounded-full">
                                    Freelancer
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-body-md text-on-surface">
                                    Member Since
                                </span>
                                <span className="text-body-md font-medium text-on-surface">
                                    October 2023
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-body-md text-on-surface">
                                    Standing
                                </span>
                                <span className="flex items-center gap-1.5 text-label-md text-primary font-medium">
                                    <CheckCircle2 size={14} />
                                    Good Standing
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="card">
                        <span className="flex items-center gap-2 text-headline-md text-on-surface">
                            <Globe size={22} className="text-tertiary" />
                            Regional Settings
                        </span>

                        <div className="flex flex-col gap-4 mt-4">
                            {/* <SelectField label="Primary Language" id="language" options={[]} />
                            <SelectField label="Date Format" id="Date" options={[]} /> */}
                        </div>
                    </section>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center gap-1.5 text-label-md text-error hover:underline">
                        <AlertTriangle size={16} />
                        Deactivate Account
                    </button>
                </div>
            </div>
        </div>
    );
}