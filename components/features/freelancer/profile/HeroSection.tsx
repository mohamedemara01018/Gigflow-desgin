/* eslint-disable @next/next/no-img-element */
import { IProfile } from "@/services/profile.service";
import { IUserListItem } from "@/services/user.service";
import { UserRole } from "@/utils/enums.utils";
import { formatDateTime, getInitials } from "@/utils/functions.utils";
import { BadgeCheck, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

function HeroSection({ profile, freelancer, me }: { profile: IProfile; freelancer: IUserListItem; me: IUserListItem }) {
    const router = useRouter();

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

    return (
        <section className="relative">
            <div className="px-6 md:px-12 pt-8 flex flex-col md:flex-row items-end md:items-center gap-4 relative z-10">
                <div className="relative">
                    {freelancer?.avatar ? (
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surface overflow-hidden bg-surface" style={{ boxShadow: 'var(--shadow-level-2)' }}>
                            <img className="w-full h-full object-cover" alt={freelancer?.firstName} src={freelancer?.avatar} />
                        </div>
                    ) : (
                        <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-primary border-4 border-surface" title="Online Status">
                            {getInitials(String(freelancer?.firstName), String(freelancer?.lastName))}
                        </div>
                    )}
                </div>
                <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-['Geist'] font-semibold text-[32px] leading-10 text-on-surface">
                            {freelancer?.firstName + ' ' + freelancer?.lastName}
                        </h1>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] leading-4 font-['Geist'] font-semibold flex items-center gap-1">
                            {freelancer?.isEmailVerified && freelancer.isIdentityVerified && (
                                <>
                                    <BadgeCheck size={14} /> Verified
                                </>
                            )}
                        </span>
                        <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-[12px] leading-4 font-['Geist'] font-bold">
                            Available Now
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