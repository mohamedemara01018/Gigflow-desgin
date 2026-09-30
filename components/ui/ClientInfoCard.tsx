/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { MapPin, CheckCircle2, AlertCircle, Star } from "lucide-react";
import UserImage from "@/components/ui/UserImage";
import {
    clientStatsService,
    IClientStats,
    IClientLocation,
} from "@/services/clientStats.service"; // Adjust path if needed
import { IClientRef } from "@/services/jobs.service";

interface ClientInfoCardProps {
    client: IClientRef;
    className?: string;
}

interface StatRow {
    label: string;
    value: string;
    tone?: "primary" | "default" | "error";
    isVerifiedBadge?: boolean;
    isUnverifiedBadge?: boolean;
    isStar?: boolean;
}

export default function ClientInfoCard({
    client,
    className = "",
}: ClientInfoCardProps) {
    const [stats, setStats] = useState<IClientStats | null>(null);
    const [apiLocation, setApiLocation] = useState<IClientLocation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Safely cast client to object if populated
    const clientObj = typeof client === "object" ? client : null;
    const clientId = clientObj?._id || (typeof client === "string" ? client : null);

    useEffect(() => {
        if (!clientId) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const response = await clientStatsService.getClientStats(clientId);
                if (isMounted && response?.data) {
                    setStats(response.data.stats);
                    if (response.data.location) {
                        setApiLocation(response.data.location);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch client stats:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchStats();

        return () => {
            isMounted = false;
        };
    }, [clientId]);

    if (!clientObj) return null;

    // Header Details derived strictly from IClientRef
    const fullName =
        `${clientObj.firstName || ""} ${clientObj.lastName || ""}`.trim() || "Client";

    // Extract location dynamically from API response based on IClientLocation types
    const city =
        typeof apiLocation?.city === "object" && apiLocation?.city !== null
            ? apiLocation.city.name
            : typeof apiLocation?.city === "string"
                ? apiLocation.city
                : null;

    const country =
        typeof apiLocation?.country === "object" && apiLocation?.country !== null
            ? apiLocation.country.name
            : typeof apiLocation?.country === "string"
                ? apiLocation.country
                : null;

    const locationParts = [city, country].filter(Boolean);
    const formattedLocation = locationParts.join(", ");

    // Dynamic Key-Value Stats rows built strictly from API state
    const statRows: StatRow[] = [
        {
            label: "Payment Method",
            value: stats?.paymentVerified ? "Payment Verified" : "Payment Unverified",
            tone: stats?.paymentVerified ? "primary" : "error",
            isVerifiedBadge: stats?.paymentVerified,
            isUnverifiedBadge: !stats?.paymentVerified,
        },
        {
            label: "Rating",
            value: stats?.rating
                ? `${stats.rating.toFixed(1)} of ${stats.totalReviews ?? 0} reviews`
                : "No reviews yet",
            isStar: Boolean(stats?.rating),
        },
        {
            label: "Jobs Posted",
            value: `${stats?.totalJobsPosted ?? 0} jobs`,
        },
        {
            label: "Hire Rate",
            value: `${stats?.hireRate ?? 0}% hire rate`,
        },
        {
            label: "Total Spent",
            value: `$${(stats?.totalSpent ?? 0).toLocaleString()} spent`,
        },
    ];

    return (
        <section className={`card !p-5 ${className}`}>
            <h2 className="text-headline-md text-on-surface">About the Client</h2>

            {/* Client Profile Header */}
            <div className="flex items-center gap-3 mt-4">
                <UserImage
                    className="w-11 h-11 shrink-0"
                    avatarUrl={clientObj.avatar!}
                    firstName={clientObj.firstName}
                    lastName={clientObj.lastName}
                />
                <div className="min-w-0 flex-1">
                    <p className="text-body-md text-on-surface font-semibold truncate">
                        {fullName}
                    </p>
                    {clientObj.email && (
                        <p className="text-label-sm text-on-surface-variant truncate">
                            {clientObj.email}
                        </p>
                    )}
                    {formattedLocation && (
                        <p className="flex items-center gap-1 text-label-sm text-on-surface-variant mt-0.5 truncate">
                            <MapPin size={11} className="shrink-0" />
                            {formattedLocation}
                        </p>
                    )}
                </div>
            </div>

            {/* Structured Stats List */}
            <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-outline-variant">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-4 w-full bg-outline-variant/30 animate-pulse rounded"
                        />
                    ))
                    : statRows.map(
                        ({
                            label,
                            value,
                            tone,
                            isVerifiedBadge,
                            isUnverifiedBadge,
                            isStar,
                        }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between gap-3"
                            >
                                <p className="text-label-sm text-on-surface-variant">
                                    {label}
                                </p>
                                <p
                                    className={`flex items-center gap-1 text-body-sm font-medium ${tone === "primary"
                                            ? "text-primary"
                                            : tone === "error"
                                                ? "text-error"
                                                : "text-on-surface"
                                        }`}
                                >
                                    {isVerifiedBadge && <CheckCircle2 size={13} />}
                                    {isUnverifiedBadge && <AlertCircle size={13} />}
                                    {isStar && (
                                        <Star
                                            size={12}
                                            className="fill-tertiary text-tertiary shrink-0"
                                        />
                                    )}
                                    {value}
                                </p>
                            </div>
                        )
                    )}
            </div>
        </section>
    );
}