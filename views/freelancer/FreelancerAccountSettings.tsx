
"use client";

import SelectField from "@/components/ui/SelectFeild";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { formatDateTime } from "@/utils/functions.utils";
import {

    Contact,
    ShieldCheck,
    Globe,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
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
            </div>

            <div className="flex flex-col gap-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="card">
                        <span className="flex items-center gap-2 text-headline-md text-on-surface">
                            <Contact size={22} className="text-primary" />
                            Contact Information
                        </span>

                        <div className="grid sm:grid-cols-1 gap-4 mt-5">
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
                                    {me?.role}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-body-md text-on-surface">
                                    Member Since
                                </span>
                                <span className="text-body-md font-medium text-on-surface">
                                    {formatDateTime(String(me?.createdAt)).date}
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
                </div>


                {/* <div className="flex justify-end">
                    <button className="flex items-center gap-1.5 text-label-md text-error hover:underline">
                        <AlertTriangle size={16} />
                        Deactivate Account
                    </button>
                </div> */}
            </div>
        </div>
    );
}