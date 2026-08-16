'use client';

import EmptyState from '@/components/ui/Emptystate';
import { ILanguage } from '@/services/language.service';
import { IProfile } from '@/services/profile.service';
import { IProfileSkill } from '@/services/profileSkill.service';
import { IUserListItem } from '@/services/user.service';
import { LanguageLevel, UserRole } from '@/utils/enums.utils';
import { Globe, Pencil, Share2, Terminal, Users } from 'lucide-react';
import { useState } from 'react';

interface SidebarSectionProps {
    profile: IProfile;
    me: IUserListItem;
    profileSkills?: IProfileSkill[];
    languages?: ILanguage[];
}

export default function SidebarSection({
    profile,
    me,
    profileSkills = [],
    languages = [],
}: SidebarSectionProps) {
    const [isHiring, setIsHiring] = useState(false);
    const [isMessaging, setIsMessaging] = useState(false);

    // Safely map social links with their corresponding icon and target URL
    const socialLinks = [
        { label: 'Portfolio', icon: Globe, href: profile?.socialLinks?.portfolio },
        { label: 'GitHub', icon: Terminal, href: profile?.socialLinks?.github },
        { label: 'LinkedIn', icon: Users, href: profile?.socialLinks?.linkedin },
        { label: 'Facebook', icon: Share2, href: profile?.socialLinks?.facebook },
        { label: 'Twitter', icon: Share2, href: profile?.socialLinks?.twitter },
        { label: 'Website', icon: Globe, href: profile?.socialLinks?.website },
    ].filter((link) => Boolean(link.href));

    return (
        <aside className="w-full lg:w-[320px] space-y-8">
            {/* Rate & Action Buttons */}
            <section
                className="card border border-outline-variant rounded-xl p-6 transition-shadow"
                style={{ boxShadow: 'var(--shadow-level-2)' }}
            >
                <h3 className="font-['Geist'] font-semibold text-[24px] leading-8 text-on-surface mb-2">
                    ${profile?.hourlyRate || 0}.00/hr
                </h3>
                <p className="text-on-surface-variant text-[14px] leading-5 font-['Inter'] mb-6">
                    Expert level rate for senior consulting and development.
                </p>

                <div className="space-y-3">
                    {me?.role === UserRole.ADMIN && (
                        <>
                            <button
                                className="w-full text-on-primary py-3 rounded-lg font-bold transition-all hover:opacity-90 active:scale-95 flex justify-center items-center h-12"
                                style={{
                                    background:
                                        'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
                                }}
                                onClick={() => {
                                    setIsHiring(true);
                                    setTimeout(() => setIsHiring(false), 1000);
                                }}
                            >
                                {isHiring ? (
                                    <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                                ) : (
                                    'Hire Me'
                                )}
                            </button>

                            <button
                                className="w-full bg-surface-container-high hover:bg-surface-container-highest transition-all py-3 rounded-lg font-bold text-on-surface active:scale-95 flex justify-center items-center h-12"
                                onClick={() => {
                                    setIsMessaging(true);
                                    setTimeout(() => setIsMessaging(false), 1000);
                                }}
                            >
                                {isMessaging ? (
                                    <div className="w-5 h-5 border-2 border-on-surface/30 border-t-on-surface rounded-full animate-spin" />
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </section>

            {/* Dynamic Skills */}
            <section
                className="card border border-outline-variant rounded-xl p-6"
                style={{ boxShadow: 'var(--shadow-level-2)' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[18px] leading-7 font-['Inter'] text-on-surface">
                        Skills
                    </h3>
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <Pencil size={18} />
                    </button>
                </div>

                {profileSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {profileSkills.map((ps) => {
                            const skillName = typeof ps.skill === 'object' && ps.skill !== null ? ps.skill.name : 'Skill';

                            return (
                                <span
                                    key={ps._id}
                                    className={`px-3 py-1 rounded-full text-[12px] leading-4 font-['Geist'] font-medium cursor-default transition-all ${ps.isPrimary
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5'
                                        }`}
                                >
                                    {skillName}
                                </span>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState title="No skills added yet." size="compact" />
                )}
            </section>

            {/* Dynamic Languages */}
            <section
                className="card border border-outline-variant rounded-xl p-6"
                style={{ boxShadow: 'var(--shadow-level-2)' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[18px] leading-7 font-['Inter'] text-on-surface">
                        Languages
                    </h3>
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <Pencil size={18} />
                    </button>
                </div>

                {languages.length > 0 ? (
                    <div className="space-y-3">
                        {languages.map((item) => {
                            const isHighlighted =
                                item.level === LanguageLevel.NATIVE || item.level === LanguageLevel.FLUENT;

                            return (
                                <div
                                    key={item._id}
                                    className="flex justify-between items-center group cursor-default hover:bg-primary/5 p-1 -mx-1 rounded transition-colors"
                                >
                                    <span className="text-on-surface-variant text-[14px] leading-5 font-['Inter'] group-hover:text-on-surface">
                                        {item.name}
                                    </span>
                                    <span
                                        className={`text-[12px] leading-4 font-['Geist'] capitalize ${isHighlighted ? 'text-primary font-bold' : 'text-on-surface-variant'
                                            }`}
                                    >
                                        {item.level.toLowerCase()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState title="No languages added yet." size="compact" />
                )}
            </section>

            {/* Social Links */}
            {socialLinks.length > 0 && (
                <section
                    className="card border border-outline-variant rounded-xl p-6"
                    style={{ boxShadow: 'var(--shadow-level-2)' }}
                >
                    <h3 className="font-bold text-[18px] leading-7 font-['Inter'] text-on-surface mb-4">
                        On the Web
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {socialLinks.map(({ label, icon: Icon, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded-lg border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group active:scale-95"
                            >
                                <Icon size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                                <span className="text-[12px] leading-4 font-['Geist'] font-bold text-on-surface">
                                    {label}
                                </span>
                            </a>
                        ))}
                    </div>
                </section>
            )}
        </aside>
    );
}