'use client';

import EmptyState from '@/components/ui/Emptystate';
import { ICertification } from '@/services/certification.service';
import { ILanguage } from '@/services/language.service';
import { IProfile } from '@/services/profile.service';
import { IProfileSkill } from '@/services/profileSkill.service';
import { IUserListItem } from '@/services/user.service';
import { LanguageLevel, SkillLevel, UserRole } from '@/utils/enums.utils';
import { formatDateTime } from '@/utils/functions.utils';
import { Award, ExternalLink, Globe, Pencil, Share2, Star, Terminal, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SidebarSectionProps {
    profile: IProfile;
    me: IUserListItem;
    profileSkills?: IProfileSkill[];
    languages?: ILanguage[];
    certifications?: ICertification[];
}

const SKILL_LEVEL_CLASSES: Record<string, string> = {
    [SkillLevel.BEGINNER]: "bg-surface-container-high text-on-surface-variant",
    [SkillLevel.INTERMEDIATE]: "bg-tertiary/20 text-tertiary font-medium",
    [SkillLevel.ADVANCED]: "bg-secondary/15 text-secondary font-medium",
    [SkillLevel.EXPERT]: "bg-primary text-on-primary font-medium",
};

const SKILL_BAR_WIDTH: Record<string, string> = {
    [SkillLevel.BEGINNER]: "25%",
    [SkillLevel.INTERMEDIATE]: "50%",
    [SkillLevel.ADVANCED]: "75%",
    [SkillLevel.EXPERT]: "100%",
};

export default function SidebarSection({
    profile,
    me,
    profileSkills = [],
    languages = [],
    certifications = [],
}: SidebarSectionProps) {
    const [isHiring, setIsHiring] = useState(false);
    const [isMessaging, setIsMessaging] = useState(false);
    const router = useRouter();

    const isFreelancer = me.role === UserRole.FREELANCER;
    const isAdmin = me.role === UserRole.ADMIN;

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
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Geist'] font-semibold text-[24px] leading-8 text-on-surface">
                        ${profile?.hourlyRate || 0}.00/hr
                    </h3>

                    {isFreelancer && (
                        <button
                            onClick={() => router.push('/settings/profile')}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <Pencil size={18} />
                        </button>
                    )}
                </div>

                <p className="text-on-surface-variant text-[14px] leading-5 font-['Inter'] mb-6">
                    Expert level rate for senior consulting and development.
                </p>

                <div className="space-y-3">
                    {isAdmin && (
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

            {/* Dynamic Certifications */}
            <section
                className="card border border-outline-variant rounded-xl p-6"
                style={{ boxShadow: 'var(--shadow-level-2)' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[18px] leading-7 font-['Inter'] text-on-surface flex items-center gap-2">
                        <Award size={20} className="text-primary" />
                        Certifications
                    </h3>
                    {isFreelancer && (
                        <button
                            onClick={() => router.push('/settings/profile')}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <Pencil size={18} />
                        </button>
                    )}
                </div>

                {certifications.length > 0 ? (
                    <div className="space-y-4">
                        {certifications.map((cert) => (
                            <div
                                key={cert._id}
                                className="p-3 border border-outline-variant/50 rounded-lg hover:border-primary/40 transition-colors bg-surface-container-high"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-medium text-body-md text-on-surface leading-tight">
                                        {cert.name}
                                    </h4>
                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
                                            title="Verify Credential"
                                        >
                                            <ExternalLink size={15} />
                                        </a>
                                    )}
                                </div>
                                <p className="text-body-sm font-medium text-primary mt-1">
                                    {cert.issuer}
                                </p>
                                <div className="flex items-center justify-between mt-2 text-label-sm text-on-surface-variant">
                                    <span>
                                        Issued {formatDateTime(String(cert.issueDate)).date}
                                    </span>
                                    {cert.expirationDate && (
                                        <span>
                                            Expires {formatDateTime(cert.expirationDate).date}
                                        </span>
                                    )}
                                </div>
                                {cert.credentialId && (
                                    <p className="text-[11px] font-mono text-on-surface-variant/70 mt-1 truncate">
                                        ID: {cert.credentialId}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState title="No certifications added yet." size="compact" />
                )}
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

                    {isFreelancer && (
                        <button
                            onClick={() => router.push('/settings/profile')}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <Pencil size={18} />
                        </button>
                    )}
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    {profileSkills.map((item) => {
                        const skillName =
                            typeof item?.skill === 'object' && item?.skill !== null
                                ? item.skill.name
                                : 'Unknown Skill';

                        const level = item?.level || SkillLevel.BEGINNER;
                        const barWidth = SKILL_BAR_WIDTH[level] || '25%';
                        const levelClass =
                            SKILL_LEVEL_CLASSES[level] || SKILL_LEVEL_CLASSES[SkillLevel.BEGINNER];

                        return (
                            <div
                                key={item._id}
                                className="group relative border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-body-md font-medium text-on-surface">
                                        {skillName}
                                        {item.isPrimary && (
                                            <Star size={13} className="text-primary fill-primary" />
                                        )}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-label-sm px-2.5 py-0.5 rounded-full ${levelClass}`}
                                        >
                                            {level}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-body-sm text-on-surface-variant mt-0.5">
                                    {item.yearsOfExperience}{' '}
                                    {item.yearsOfExperience === 1 ? 'Year' : 'Years'} of Experience
                                </p>
                                <div className="h-1.5 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-primary"
                                        style={{ width: barWidth }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
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
                    {isFreelancer && (
                        <button
                            onClick={() => router.push('/settings/profile')}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <Pencil size={18} />
                        </button>
                    )}
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
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[18px] leading-7 font-['Inter'] text-on-surface">
                            On the Web
                        </h3>
                        {isFreelancer && (
                            <button
                                onClick={() => router.push('/settings/profile')}
                                className="text-on-surface-variant hover:text-primary transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
                        )}
                    </div>

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