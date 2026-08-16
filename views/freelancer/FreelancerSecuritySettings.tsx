"use client";

import ConfirmDialog from "@/components/features/freelancer/freelancer-security-settings/ConfirmDialog";
import {
    ShieldCheck,
    CheckCircle2,
    Smartphone,
    Laptop,
    LogOut,
    Briefcase,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";
import { useState } from "react";


interface Session {
    id: string;
    device: string;
    location: string;
    detail: string;
    current?: boolean;
}

const SESSIONS: Session[] = [
    {
        id: "1",
        device: "MacBook Pro",
        location: "San Francisco, CA",
        detail: "Chrome • IP: 192.168.1.1",
        current: true,
    },
    {
        id: "2",
        device: "iPhone 14 Pro",
        location: "San Jose, CA",
        detail: "Safari • Last active: 2 hours ago",
    },
];

const RECENT_LOGINS = [
    { location: "San Francisco, CA", detail: "Mac OS • Chrome", when: "Today", time: "09:41 AM" },
    { location: "San Jose, CA", detail: "iOS • Safari", when: "Yesterday", time: "08:22 PM" },
    { location: "San Francisco, CA", detail: "Mac OS • Chrome", when: "Oct 24", time: "11:05 AM" },
];

export default function FreelancerSecuritySettings() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [confirmAction, setConfirmAction] = useState<
        null | "disable2fa" | "logoutAll" | "deactivate" | "delete"
    >(null);

    const closeDialog = () => setConfirmAction(null);

    return (
        <div>
            <section className="rounded-lg bg-surface-container-low p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                    <div>
                        <h1 className="text-headline-lg text-on-surface">
                            Security &amp; Identity
                        </h1>
                        <p className="text-body-md text-on-surface-variant mt-2 max-w-[520px]">
                            Manage your account security, two-factor authentication, and
                            verify your identity to build trust with clients.
                        </p>
                    </div>

                    <div className="bg-surface-container-lowest rounded-lg p-5 w-full md:w-[280px]">
                        <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                            Overall Status
                        </p>
                        <p className="flex items-center gap-2 text-body-lg font-semibold text-on-surface mt-2">
                            <ShieldCheck size={20} className="text-primary" />
                            Level 3 Verified
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                            All requirements met
                        </p>
                        <div className="flex flex-col gap-1.5 mt-3">
                            {["Email", "Phone", "Government ID"].map((item) => (
                                <span
                                    key={item}
                                    className="flex items-center gap-2 text-body-sm text-on-surface"
                                >
                                    <CheckCircle2 size={15} className="text-primary" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <section className="card">
                        <div className="flex items-center justify-between">
                            <h2 className="text-headline-md text-on-surface">
                                Two-Factor Authentication (2FA)
                            </h2>
                            <span
                                className={`flex items-center gap-1.5 text-label-md px-3 py-1 rounded-full ${twoFactorEnabled
                                    ? "bg-primary text-on-primary"
                                    : "bg-surface-container-high text-on-surface-variant"
                                    }`}
                            >
                                <ShieldCheck size={13} />
                                {twoFactorEnabled ? "Enabled" : "Disabled"}
                            </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            Add an extra layer of security to your account.
                        </p>

                        <div className="flex items-center justify-between bg-surface-container-low rounded-md p-4 mt-5">
                            <div className="flex items-center gap-3">
                                <Smartphone size={20} className="text-primary" />
                                <div>
                                    <p className="text-body-md font-medium text-on-surface">
                                        Authenticator App
                                    </p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        Google Authenticator or Authy
                                    </p>
                                </div>
                            </div>
                            {twoFactorEnabled ? (
                                <button
                                    onClick={() => setConfirmAction("disable2fa")}
                                    className="text-label-md text-error hover:underline"
                                >
                                    Disable
                                </button>
                            ) : (
                                <button
                                    onClick={() => setTwoFactorEnabled(true)}
                                    className="text-label-md text-primary hover:underline"
                                >
                                    Enable
                                </button>
                            )}
                        </div>
                    </section>

                    <section className="card">
                        <h2 className="text-headline-md text-on-surface">Change Password</h2>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            Ensure your account is using a long, random password to stay
                            secure.
                        </p>

                        <div className="flex flex-col gap-3 mt-5">
                            <input
                                type="password"
                                placeholder="Current Password"
                                className="bg-surface-container-low rounded-md px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="bg-surface-container-low rounded-md px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="bg-surface-container-low rounded-md px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <button className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 mt-5 hover:opacity-90 transition-opacity">
                            Update Password
                        </button>
                    </section>

                    <section className="card">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h2 className="text-headline-md text-on-surface">
                                    Active Sessions
                                </h2>
                                <p className="text-body-sm text-on-surface-variant mt-1">
                                    Devices currently logged into your account.
                                </p>
                            </div>
                            <button
                                onClick={() => setConfirmAction("logoutAll")}
                                className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors"
                            >
                                Log out all other devices
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 mt-5">
                            {SESSIONS.map((session) => {
                                const Icon = session.device.includes("iPhone") ? Smartphone : Laptop;
                                return (
                                    <div
                                        key={session.id}
                                        className={`flex items-center justify-between rounded-md p-4 ${session.current
                                            ? "bg-surface-container-low"
                                            : "border border-outline-variant"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={20} className="text-on-surface-variant" />
                                            <div>
                                                <span className="flex items-center gap-2">
                                                    <p className="text-body-md font-medium text-on-surface">
                                                        {session.device}
                                                    </p>
                                                    {session.current && (
                                                        <span className="text-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                            CURRENT
                                                        </span>
                                                    )}
                                                </span>
                                                <p className="text-body-sm text-on-surface-variant mt-0.5">
                                                    {session.location} • {session.detail}
                                                </p>
                                            </div>
                                        </div>
                                        {!session.current && (
                                            <button
                                                aria-label={`Log out ${session.device}`}
                                                className="text-on-surface-variant hover:text-error transition-colors"
                                            >
                                                <LogOut size={18} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <aside className="flex flex-col gap-6">
                    <section className="card">
                        <h2 className="text-headline-md !text-[18px] !leading-6 text-on-surface">
                            Identity Verification
                        </h2>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            Verified freelancers get 3x more profile views.
                        </p>

                        <div className="flex items-center gap-3 bg-surface-container-low rounded-md p-4 mt-4">
                            <span className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                                <Briefcase size={18} />
                            </span>
                            <div>
                                <p className="text-body-md font-medium text-on-surface">
                                    Government ID
                                </p>
                                <p className="text-body-sm text-primary">Verified</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                                    Type
                                </p>
                                <p className="text-body-md text-on-surface mt-1">Passport</p>
                            </div>
                            <div>
                                <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                                    Verified On
                                </p>
                                <p className="text-body-md text-on-surface mt-1">Oct 12, 2023</p>
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 border border-outline-variant text-on-surface text-label-md rounded-md py-2.5 mt-5 hover:bg-surface-container-low transition-colors">
                            <RefreshCw size={15} />
                            Update Documents
                        </button>
                    </section>

                    <section className="card">
                        <h2 className="text-headline-md !text-[18px] !leading-6 text-on-surface">
                            Recent Logins
                        </h2>
                        <div className="flex flex-col divide-y divide-outline-variant mt-3">
                            {RECENT_LOGINS.map((login, i) => (
                                <div key={i} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-body-sm font-medium text-on-surface">
                                            {login.location}
                                        </p>
                                        <p className="text-label-sm text-on-surface-variant">
                                            {login.detail}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-body-sm text-on-surface">{login.when}</p>
                                        <p className="text-label-sm text-on-surface-variant">
                                            {login.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="text-label-md text-primary hover:underline mt-3">
                            View Full History
                        </button>
                    </section>

                    <section className="border border-error/30 bg-error-container/30 rounded-lg p-5">
                        <span className="flex items-center gap-2 text-body-md font-semibold text-error">
                            <AlertTriangle size={18} />
                            Danger Zone
                        </span>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            Irreversible actions related to your account data.
                        </p>

                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <p className="text-body-sm font-medium text-on-surface">
                                    Deactivate Account
                                </p>
                                <p className="text-label-sm text-on-surface-variant">
                                    Temporarily hide your profile. You can reactivate later.
                                </p>
                            </div>
                            <button
                                onClick={() => setConfirmAction("deactivate")}
                                className="shrink-0 border border-outline-variant text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-low transition-colors"
                            >
                                Deactivate
                            </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <p className="text-body-sm font-medium text-error">
                                    Delete Account
                                </p>
                                <p className="text-label-sm text-on-surface-variant">
                                    Permanently remove all data. This cannot be undone.
                                </p>
                            </div>
                            <button
                                onClick={() => setConfirmAction("delete")}
                                className="shrink-0 bg-error text-on-error text-label-md rounded-md px-4 py-2 hover:opacity-90 transition-opacity"
                            >
                                Delete
                            </button>
                        </div>
                    </section>
                </aside>
            </div>

            {/* <ConfirmDialog
                open={confirmAction === "disable2fa"}
                title="Disable two-factor authentication?"
                description="This will make your account easier to access, but less secure."
                confirmLabel="Disable 2FA"
                onCancel={closeDialog}
                onConfirm={() => {
                    setTwoFactorEnabled(false);
                    closeDialog();
                }}
            />
            <ConfirmDialog
                open={confirmAction === "logoutAll"}
                title="Log out all other devices?"
                description="You'll stay signed in here, but every other session will be ended immediately."
                confirmLabel="Log Out Devices"
                onCancel={closeDialog}
                onConfirm={closeDialog}
            />
            <ConfirmDialog
                open={confirmAction === "deactivate"}
                title="Deactivate your account?"
                description="Your profile will be hidden from search and clients immediately. You can reactivate anytime by logging back in."
                confirmLabel="Deactivate Account"
                onCancel={closeDialog}
                onConfirm={closeDialog}
            />
            <ConfirmDialog
                open={confirmAction === "delete"}
                title="Permanently delete your account?"
                description="This will erase your profile, proposals, contracts, and message history. This action cannot be undone."
                confirmLabel="Delete Account"
                onCancel={closeDialog}
                onConfirm={closeDialog}
            /> */}
        </div>
    );
}