"use client";

import React from "react";
import { Globe, CheckCircle2 } from "lucide-react";
import { ISocialLinks } from "@/services/profile.service";

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    badge?: string;
}

export const LINK_CONFIG = [
    { key: "website" as keyof ISocialLinks, label: "Personal Website", placeholder: "https://yoursite.com" },
    { key: "portfolio" as keyof ISocialLinks, label: "Portfolio URL", placeholder: "https://dribbble.com/you" },
    { key: "linkedin" as keyof ISocialLinks, label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
    { key: "github" as keyof ISocialLinks, label: "GitHub", placeholder: "https://github.com/you" },
    { key: "twitter" as keyof ISocialLinks, label: "Twitter / X", placeholder: "https://x.com/you" },
    { key: "facebook" as keyof ISocialLinks, label: "Facebook", placeholder: "https://facebook.com/you" },
];

export const Field: React.FC<FieldProps> = ({ label, badge, ...props }) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-body-sm font-medium text-on-surface">{label}</label>
                {badge && (
                    <span className="flex items-center gap-1 text-label-sm text-primary font-medium">
                        <CheckCircle2 size={12} />
                        {badge.toUpperCase()}
                    </span>
                )}
            </div>
            <input
                {...props}
                disabled={!!badge || props.disabled}
                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary disabled:opacity-70"
            />
        </div>
    );
};

interface DigitalPresenceSectionProps {
    socialLinks: ISocialLinks;
    onInputChange: (key: keyof ISocialLinks, value: string) => void;
}

export const DigitalPresenceSection: React.FC<DigitalPresenceSectionProps> = ({
    socialLinks,
    onInputChange,
}) => {
    return (
        <section className="card p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
            <span className="flex items-center gap-2 text-headline-md font-semibold text-on-surface">
                <Globe size={20} className="text-primary" />
                Digital Presence
            </span>
            <p className="text-body-sm text-on-surface-variant mt-1">
                Connect your profiles to build trust and showcase your network to potential clients.
            </p>

            <div className="flex flex-col gap-4 mt-5">
                {LINK_CONFIG.map(({ key, label, placeholder }) => (
                    <Field
                        key={key}
                        label={label}
                        type="url"
                        placeholder={placeholder}
                        value={socialLinks[key] || ""}
                        onChange={(e) => onInputChange(key, e.target.value)}
                    />
                ))}
            </div>
        </section>
    );
};