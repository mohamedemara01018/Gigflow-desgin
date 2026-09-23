import React from "react";
import {
    ShieldCheck,
    ShieldAlert,
    Star,
    StarHalf,
    MapPin,
    Briefcase,
    Calendar,
} from "lucide-react";
import UserImage from "@/components/ui/UserImage";

export interface IClientRef {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    paymentVerified?: boolean;
    rating?: number;
    reviewsCount?: number;
    location?: {
        country?: string;
        city?: string;
    };
    jobsPosted?: number;
    hireRate?: number;
    openJobs?: number;
    memberSince?: string;
    createdAt?: string;
}

interface ClientInfoCardProps {
    /** Accepts populated IClientRef object or unpopulated string ID / null */
    client?: IClientRef | string | null;
    paymentVerifiedFallback?: boolean;
    className?: string;
}

function RatingStars({ rating = 0 }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} out of 5 stars`}>
            {[...Array(5)].map((_, idx) => {
                if (idx < fullStars) {
                    return (
                        <Star
                            key={idx}
                            size={16}
                            className="text-primary fill-primary"
                        />
                    );
                }
                if (idx === fullStars && hasHalfStar) {
                    return (
                        <StarHalf
                            key={idx}
                            size={16}
                            className="text-primary fill-primary"
                        />
                    );
                }
                return (
                    <Star
                        key={idx}
                        size={16}
                        className="text-outline-variant"
                    />
                );
            })}
        </div>
    );
}

export default function ClientInfoCard({
    client,
    paymentVerifiedFallback = false,
    className = "",
}: ClientInfoCardProps) {
    // Return early if client is null, undefined, or an unpopulated string ID
    if (!client || typeof client === "string") {
        return null;
    }

    const fullName = `${client.firstName || ""} ${client.lastName || ""}`.trim() || "Client";
    const isPaymentVerified = client.paymentVerified ?? paymentVerifiedFallback;

    const rating = client.rating ?? 0;
    const reviewsCount = client.reviewsCount;

    const locationCountry = client.location?.country;
    const locationCity = client.location?.city;

    const rawDate = client.memberSince || client.createdAt;
    const formattedMemberSince = rawDate
        ? new Date(rawDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        })
        : null;

    return (
        <section className={`card ${className}`}>
            <h3 className="text-headline-md text-base leading-6 text-on-surface pb-3 border-b border-outline-variant font-semibold">
                About the Client
            </h3>

            <div className="flex flex-col gap-4 mt-4">
                {/* Client Avatar & Name */}
                <div className="flex items-center gap-3">
                    <UserImage
                        className="w-10 h-10 shrink-0"
                        avatarUrl={client.avatar!}
                        firstName={client.firstName}
                        lastName={client.lastName}
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-body-md font-semibold text-on-surface truncate">
                            {fullName}
                        </p>
                        {client.email && (
                            <p className="text-body-sm text-on-surface-variant truncate">
                                {client.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Payment Verification Status */}
                <span
                    className={`flex items-center gap-2 text-body-md font-medium ${isPaymentVerified ? "text-primary" : "text-on-surface-variant"
                        }`}
                >
                    {isPaymentVerified ? (
                        <>
                            <ShieldCheck size={18} />
                            Payment Verified
                        </>
                    ) : (
                        <>
                            <ShieldAlert size={18} />
                            Payment Unverified
                        </>
                    )}
                </span>

                {/* Rating & Reviews */}
                {client.rating !== undefined && (
                    <div className="flex items-center gap-1.5">
                        <RatingStars rating={rating} />
                        <span className="text-body-sm text-on-surface-variant ml-1">
                            {rating.toFixed(1)}
                            {reviewsCount !== undefined && ` of ${reviewsCount} reviews`}
                        </span>
                    </div>
                )}

                {/* Location */}
                {(locationCountry || locationCity) && (
                    <div className="flex items-start gap-2">
                        <MapPin size={18} className="text-on-surface-variant shrink-0 mt-0.5" />
                        <div>
                            <p className="text-body-md text-on-surface font-medium">
                                {locationCountry || "Worldwide"}
                            </p>
                            {locationCity && (
                                <p className="text-body-sm text-on-surface-variant">
                                    {locationCity}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Job Posting Statistics */}
                {client.jobsPosted !== undefined && (
                    <div className="flex items-start gap-2">
                        <Briefcase size={18} className="text-on-surface-variant shrink-0 mt-0.5" />
                        <div>
                            <p className="text-body-md text-on-surface font-medium">
                                {client.jobsPosted} {client.jobsPosted === 1 ? "Job" : "Jobs"} Posted
                            </p>
                            <p className="text-body-sm text-on-surface-variant">
                                {client.hireRate !== undefined && `${client.hireRate}% hire rate`}
                                {client.hireRate !== undefined && client.openJobs !== undefined && ", "}
                                {client.openJobs !== undefined && `${client.openJobs} open jobs`}
                            </p>
                        </div>
                    </div>
                )}

                {/* Member Since Date */}
                {formattedMemberSince && (
                    <div className="flex items-center gap-2 pt-1">
                        <Calendar size={16} className="text-on-surface-variant" />
                        <p className="text-body-sm text-on-surface-variant italic">
                            Member since {formattedMemberSince}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}