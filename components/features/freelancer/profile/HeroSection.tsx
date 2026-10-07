/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { IProfile } from "@/services/profile.service";
import { IUserListItem } from "@/services/user.service";
import { selectOnlineUsers } from "@/store/slices/socketSlice";
import { UserRole } from "@/utils/enums.utils";
import { formatDateTime, getInitials } from "@/utils/functions.utils";
import { socket } from "@/utils/socket";
import { BadgeCheck, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export enum AvailabilityStatus {
    AVAILABLE = "available",
    BUSY = "busy",
    NOT_AVAILABLE = "not_available",
}

const getAvailabilityBadgeConfig = (availability?: AvailabilityStatus | string) => {
    switch (availability) {
        case AvailabilityStatus.AVAILABLE:
            return {
                label: "Available",
                className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
                dotClass: "bg-emerald-500 shadow-xs shadow-emerald-500/50",
            };
        case AvailabilityStatus.BUSY:
            return {
                label: "Busy",
                className: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
                dotClass: "bg-amber-500 shadow-xs shadow-amber-500/50",
            };
        case AvailabilityStatus.NOT_AVAILABLE:
            return {
                label: "Not Available",
                className: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
                dotClass: "bg-rose-500 shadow-xs shadow-rose-500/50",
            };
        default:
            return {
                label: availability || "Unknown",
                className: "bg-surface-container text-on-surface-variant border-outline-variant",
                dotClass: "bg-gray-400",
            };
    }
};

function HeroSection({ profile, freelancer, me }: { profile: IProfile; freelancer: IUserListItem; me: IUserListItem }) {
    const router = useRouter();
    const onlineUsers = useSelector(selectOnlineUsers);

    const freelancerId = freelancer?._id ? String(freelancer._id) : "";
    const isOnline = Boolean(freelancerId && onlineUsers[freelancerId]);

    useEffect(() => {
        if (freelancerId) {
            socket.emit("check_presence", { userIds: [freelancerId] });
        }
    }, [freelancerId]);

    // Helper function to resolve city & country names whether populated or unpopulated string/ID
    const getLocationText = () => {
        const countryName = typeof freelancer?.country === "object" ? freelancer?.country?.name : freelancer?.country;
        const cityName = typeof freelancer?.city === "object" ? freelancer?.city?.name : freelancer?.city;

        if (cityName && countryName) {
            return `${cityName}, ${countryName}`;
        }
        return cityName || countryName || null;
    };

    const locationText = getLocationText();
    const availabilityBadge = getAvailabilityBadgeConfig(profile?.availability);

    return (
        <section className="relative ">
            <div className="card px-6 md:px-12 pt-8 flex flex-col md:flex-row items-end md:items-center gap-4 relative z-10">
                <div className="relative shrink-0">
                    {freelancer?.avatar ? (
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surface overflow-hidden bg-surface" style={{ boxShadow: 'var(--shadow-level-2)' }}>
                            <img className="w-full h-full object-cover" alt={freelancer?.firstName} src={freelancer?.avatar} />
                        </div>
                    ) : (
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surface overflow-hidden bg-primary/10 flex items-center justify-center text-primary text-3xl md:text-4xl font-bold font-['Geist']" style={{ boxShadow: 'var(--shadow-level-2)' }}>
                            {getInitials(String(freelancer?.firstName || ""), String(freelancer?.lastName || ""))}
                        </div>
                    )}

                    {/* Live Presence indicator dot on avatar */}
                    <span
                        className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-surface transition-colors duration-300 ${isOnline ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-gray-400"
                            }`}
                        title={isOnline ? "Online" : "Offline"}
                    />
                </div>
                <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-['Geist'] font-semibold text-[32px] leading-10 text-on-surface">
                            {freelancer?.firstName + ' ' + freelancer?.lastName}
                        </h1>

                        {/* Online / Offline Presence Badge */}
                        <span
                            className={`px-3 py-1 rounded-full text-[12px] leading-4 font-['Geist'] font-semibold flex items-center gap-1.5 transition-colors duration-300 ${isOnline
                                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                : "bg-surface-container text-on-surface-variant border border-outline-variant"
                                }`}
                            title={isOnline ? "User is currently online" : "User is currently offline"}
                        >
                            <span
                                className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? "bg-green-500 shadow-xs shadow-green-500/50" : "bg-gray-400"
                                    }`}
                            />
                            {isOnline ? "Online" : "Offline"}
                        </span>

                        {freelancer?.isEmailVerified && freelancer.isIdentityVerified && (
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] leading-4 font-['Geist'] font-semibold flex items-center gap-1">
                                <BadgeCheck size={14} /> Verified
                            </span>
                        )}

                        {/* Dynamic Availability Status Badge */}
                        <span
                            className={`px-3 py-1 rounded-full text-[12px] leading-4 font-['Geist'] font-semibold border flex items-center gap-1.5 transition-colors duration-300 ${availabilityBadge.className}`}
                        >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${availabilityBadge.dotClass}`} />
                            {availabilityBadge.label}
                        </span>
                    </div>
                    <p className="font-['Geist'] font-semibold text-[24px] leading-8 text-on-surface-variant mt-1">
                        {profile.title}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-on-surface-variant">
                        {locationText && (
                            <div className="flex items-center gap-1">
                                <MapPin size={18} />
                                <span className="text-[14px] leading-5 font-['Geist'] font-medium">
                                    {locationText}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock size={18} />
                            <span className="text-[14px] leading-5 font-['Geist'] font-medium">
                                {formatDateTime(String(new Date())).time} time
                            </span>
                        </div>
                    </div>
                </div>
                <div className="pb-2 flex gap-3 w-full md:w-auto">
                    {me.role === UserRole.FREELANCER && (
                        <button
                            onClick={() => router.push('/settings/personal-info')}
                            className="flex-1 md:flex-none text-on-primary px-6 py-2.5 rounded-lg text-[14px] leading-5 font-['Geist'] font-medium transition-all hover:opacity-90 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
                                boxShadow: 'var(--shadow-level-2)',
                            }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;