"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { IUserRef } from "@/services/contract.service";
import UserImage from "@/components/ui/UserImage";

export default function PartyCard({
    role,
    user,
    stats,
}: {
    role: "client" | "freelancer";
    user?: IUserRef;
    stats?: { label: string; value: string }[];
}) {
    const isFreelancer = role === "freelancer";
    const firstName = user?.firstName || (isFreelancer ? "Freelancer" : "Client");
    const lastName = user?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();


    const tierBadge = isFreelancer ? "Top Rated Talent" : "Verified Enterprise";

    const defaultStats = isFreelancer
        ? [
            { label: "Role", value: "Freelancer" },
            { label: "Status", value: "Active" },
            { label: "Verification", value: "100%" },
        ]
        : [
            { label: "Role", value: "Client" },
            { label: "Status", value: "Active" },
            { label: "Payment", value: "Verified" },
        ];

    const displayStats = stats || defaultStats;

    return (
        <section className="card">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">


                    <UserImage
                        className="w-12 h-12 shrink-0"
                        firstName={firstName}
                        lastName={lastName}
                        avatarUrl={user?.avatar || ""}
                    />


                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-body-lg text-on-surface truncate font-semibold">{fullName}</p>
                            <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded shrink-0 capitalize">
                                {role}
                            </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant truncate">{user?.email || "Account Active"}</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-label-sm text-primary bg-primary-container/15 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {tierBadge}
                    </span>
                    {user?._id && isFreelancer && (
                        <Link
                            href={`/profile/${user._id}`}
                            className="flex items-center gap-1 text-label-sm text-primary hover:underline underline-offset-2"
                        >
                            Profile
                            <ArrowRight size={12} />
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
                {displayStats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-surface-container-high border border-outline-variant rounded-md p-3 text-center"
                    >
                        <p className="text-body-lg text-on-surface font-medium">{stat.value}</p>
                        <p className="text-label-sm text-on-surface-variant mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-outline-variant text-label-sm">
                <span className="flex items-center gap-1.5 text-primary">
                    {role === "client" ? <CheckCircle2 size={13} /> : <ShieldCheck size={13} />}
                    {role === "client" ? "Verified Billing Account" : "Identity Verified"}
                </span>
                <span className="text-on-surface-variant">GigFlow Escrow Protected</span>
            </div>
        </section>
    );
}
