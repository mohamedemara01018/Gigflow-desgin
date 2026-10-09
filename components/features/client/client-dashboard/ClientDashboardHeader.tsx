"use client";

import { Building2, MapPin, Star, ShieldCheck, Calendar, Briefcase, CheckCircle2, Wallet, UserCheck } from "lucide-react";
import UserImage from "@/components/ui/UserImage";
import { IUserListItem } from "@/services/user.service";
import { IClientStats, IClientLocation } from "@/services/clientStats.service";
import { formatCurrency, formatDateTime } from "@/utils/functions.utils";

interface ClientDashboardHeaderProps {
    me: IUserListItem | null;
    stats: IClientStats | null;
    location: IClientLocation | null;
    isLoading?: boolean;
}

export default function ClientDashboardHeader({
    me,
    stats,
    location,
    isLoading = false,
}: ClientDashboardHeaderProps) {
    if (!me) return null;

    const firstName = me.firstName || "";
    const lastName = me.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Client";
    const avatarUrl = me.avatar || "";

    // Location formatting
    const countryName =
        typeof location?.country === "object" && location?.country !== null
            ? location.country.name
            : typeof location?.country === "string"
            ? location.country
            : me.country || "";

    const cityName =
        typeof location?.city === "object" && location?.city !== null
            ? location.city.name
            : typeof location?.city === "string"
            ? location.city
            : me.city || "";

    const locationString = [cityName, countryName].filter(Boolean).join(", ") || "Location verified";

    const memberSince = me.createdAt
        ? formatDateTime(me.createdAt).date
        : "Recently";

    const isPaymentVerified = stats?.paymentVerified || Boolean(me.stripeCustomerId);
    const rating = stats?.rating !== undefined && stats.rating > 0 ? stats.rating.toFixed(1) : "5.0";
    const reviewCount = stats?.totalReviews || 0;
    const totalSpent = stats?.totalSpent || 0;
    const totalJobsPosted = stats?.totalJobsPosted || 0;
    const hireRate = stats?.hireRate !== undefined ? stats.hireRate : 0;

    return (
        <section className="card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6!">
            {/* Left: Client Identity */}
            <div className="flex items-center gap-4 min-w-0">
                <UserImage
                    avatarUrl={avatarUrl}
                    firstName={firstName}
                    lastName={lastName}
                    className="w-16 h-16 shrink-0 ring-2 ring-primary/20"
                />

                <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-headline-md font-bold text-on-surface truncate">
                            {fullName}
                        </h1>

                        <span
                            className={`inline-flex items-center gap-1 text-label-sm px-2.5 py-0.5 rounded-full font-medium ${
                                isPaymentVerified
                                    ? "bg-primary/10 text-primary"
                                    : "bg-surface-container-high text-on-surface-variant"
                            }`}
                        >
                            <ShieldCheck size={13} className={isPaymentVerified ? "text-primary" : "text-on-surface-variant"} />
                            {isPaymentVerified ? "Payment Verified" : "Verification Pending"}
                        </span>
                    </div>

                    <div className="flex items-center gap-3.5 mt-2 flex-wrap text-body-sm text-on-surface-variant">
                        {locationString && (
                            <span className="flex items-center gap-1">
                                <MapPin size={13} />
                                {locationString}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            Member since {memberSince}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-on-surface">
                            <Star size={13} className="text-primary fill-primary" />
                            {rating} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Key Profile Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-outline-variant/60">
                <div className="text-left lg:text-center px-2">
                    <p className="text-headline-md !text-[22px] !leading-7 font-bold text-on-surface">
                        {isLoading ? "—" : totalJobsPosted}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">Jobs Posted</p>
                </div>

                <div className="text-left lg:text-center px-2">
                    <p className="text-headline-md !text-[22px] !leading-7 font-bold text-primary">
                        {isLoading ? "—" : `${hireRate}%`}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">Hire Rate</p>
                </div>

                <div className="text-left lg:text-center px-2">
                    <p className="text-headline-md !text-[22px] !leading-7 font-bold text-on-surface">
                        {isLoading ? "—" : formatCurrency(totalSpent)}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">Total Spent</p>
                </div>

                <div className="text-left lg:text-center px-2">
                    <p className="flex items-center lg:justify-center gap-1 text-headline-md !text-[22px] !leading-7 font-bold text-on-surface">
                        {isLoading ? "—" : rating}
                        <Star size={14} className="text-primary fill-primary" />
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">Client Score</p>
                </div>
            </div>
        </section>
    );
}
