"use client";

import {
    Globe,
    Award,
    Plus,
    TrendingUp,
    ExternalLink,
    Eye,
    User,
} from "lucide-react";

const LINK_FIELDS = [
    { key: "website", label: "Personal Website", icon: Globe, placeholder: "https://yoursite.com", value: "https://alexsterling.design" },
    { key: "portfolio", label: "Portfolio URL", icon: User, placeholder: "https://dribbble.com/you", value: "https://dribbble.com/alexs" },
    { key: "linkedin", label: "LinkedIn", icon: User, placeholder: "linkedin.com/in/you", value: "linkedin.com/in/alexsterling" },
    { key: "github", label: "GitHub", icon: User, placeholder: "github.com/you", value: "github.com/alex-s-dev" },
    { key: "twitter", label: "Twitter / X", icon: User, placeholder: "twitter.com/...", value: "" },
];

interface Certification {
    id: string;
    name: string;
    issuer: string;
    issuedDate: string;
    credentialId?: string;
    credentialUrl?: string;
    accentClass: string;
}

const CERTIFICATIONS: Certification[] = [
    {
        id: "1",
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services (AWS)",
        issuedDate: "Jun 2023",
        credentialId: "AWS-123456789",
        accentClass: "border-primary",
    },
    {
        id: "2",
        name: "Professional Cloud Developer",
        issuer: "Google Cloud",
        issuedDate: "Nov 2022",
        credentialUrl: "#",
        accentClass: "border-secondary",
    },
];

export default function CredentialsTabContent() {
    return (
        <div className="pt-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        External Links &amp; Credentials
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Manage your digital footprint and verified qualifications.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2.5 hover:bg-surface-container-highest transition-colors">
                        <Eye size={16} />
                        Preview Profile
                    </button>
                    <button className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <section className="card">
                        <span className="flex items-center gap-2 text-headline-md text-on-surface">
                            <Globe size={20} className="text-primary" />
                            Digital Presence
                        </span>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            Connect your profiles to build trust and showcase your network
                            to potential clients.
                        </p>

                        <div className="flex flex-col gap-4 mt-5">
                            {LINK_FIELDS.map(({ key, label, icon: Icon, placeholder, value }) => (
                                <div key={key}>
                                    <label className="text-body-sm font-medium text-on-surface block mb-2">
                                        {label}
                                    </label>
                                    <div className="flex items-center gap-2.5 bg-surface-container-lowest border border-outline-variant rounded-md px-3.5">
                                        <Icon size={16} className="text-on-surface-variant shrink-0" />
                                        <input
                                            defaultValue={value}
                                            placeholder={placeholder}
                                            className="w-full bg-transparent py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-primary text-on-primary rounded-lg p-5 flex items-center justify-between">
                        <div>
                            <span className="text-label-sm uppercase tracking-wide opacity-90">
                                Profile Strength
                            </span>
                            <p className="text-display-lg !text-[36px] !leading-none font-bold mt-1">
                                92%
                            </p>
                        </div>
                        <span className="w-14 h-14 rounded-full border-2 border-on-primary/40 flex items-center justify-center">
                            <TrendingUp size={22} />
                        </span>
                    </section>
                </div>

                <section className="card">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-headline-md text-on-surface">
                            <Award size={20} className="text-tertiary" />
                            Certifications
                        </span>
                        <button className="flex items-center gap-1.5 text-primary text-label-md font-medium hover:underline">
                            <Plus size={16} />
                            Add New
                        </button>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Highlight your formal training and industry credentials to stand
                        out.
                    </p>

                    <div className="flex flex-col gap-3 mt-5">
                        {CERTIFICATIONS.map((cert) => (
                            <div
                                key={cert.id}
                                className={`flex items-center gap-4 border-l-4 bg-surface-container-low rounded-md p-4 ${cert.accentClass}`}
                            >
                                <span className="w-12 h-12 rounded-md bg-surface-container-high flex items-center justify-center shrink-0">
                                    <Award size={20} className="text-on-surface-variant" />
                                </span>
                                <div>
                                    <p className="text-body-md font-semibold text-on-surface">
                                        {cert.name}
                                    </p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        {cert.issuer}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1.5 text-label-sm text-on-surface-variant">
                                        <span>Issued {cert.issuedDate}</span>
                                        {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                className="flex items-center gap-1 text-primary font-medium hover:underline"
                                            >
                                                <ExternalLink size={12} />
                                                Show Credential
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-outline-variant rounded-md py-8 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                            <span className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                                <Plus size={18} />
                            </span>
                            <span className="text-body-md font-medium">Add Certification</span>
                            <span className="text-body-sm text-center max-w-[280px]">
                                Showcase your verified skills to clients. Upload
                                certificates or link to digital badges.
                            </span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}