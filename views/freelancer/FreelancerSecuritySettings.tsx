"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SecurityHeader } from "@/components/features/freelancer/freelancer-security-settings/SecurityHeader";
import { TwoFactorSection } from "@/components/features/freelancer/freelancer-security-settings/TwoFactorSection";
import { ChangePasswordSection } from "@/components/features/freelancer/freelancer-security-settings/ChangePasswordSection";
import { ActiveSessionsSection, Session } from "@/components/features/freelancer/freelancer-security-settings/ActiveSessionsSection";
import { IdentityVerificationCard } from "@/components/features/freelancer/freelancer-security-settings/IdentityVerificationCard";
import { LoginRecord, RecentLoginsCard } from "@/components/features/freelancer/freelancer-security-settings/RecentLoginsCard";
import { DangerZoneCard } from "@/components/features/freelancer/freelancer-security-settings/DangerZoneCard";



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

const RECENT_LOGINS: LoginRecord[] = [
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
            <SecurityHeader />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <TwoFactorSection
                        enabled={twoFactorEnabled}
                        onEnable={() => setTwoFactorEnabled(true)}
                        onDisable={() => setConfirmAction("disable2fa")}
                    />
                    <ChangePasswordSection />
                    <ActiveSessionsSection
                        sessions={SESSIONS}
                        onLogoutAll={() => setConfirmAction("logoutAll")}
                    />
                </div>

                <aside className="flex flex-col gap-6">
                    <IdentityVerificationCard />
                    <RecentLoginsCard logins={RECENT_LOGINS} />
                    <DangerZoneCard
                        onDeactivate={() => setConfirmAction("deactivate")}
                        onDelete={() => setConfirmAction("delete")}
                    />
                </aside>
            </div>

            <ConfirmDialog
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
            />
        </div>
    );
}