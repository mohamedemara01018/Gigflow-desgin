'use client'

import { ExperienceLevel, JobDuration, JobVisibility } from "@/utils/enums.utils";
import { ICreateJobDto } from "@/services/jobs.service";
import { ChevronDown, Globe2, Eye } from "lucide-react";

interface StepProps {
    formData: ICreateJobDto;
    updateForm: (patch: Partial<ICreateJobDto>) => void;
}

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; description: string; exp: string }[] = [
    {
        id: ExperienceLevel.ENTRY,
        label: "Entry Level",
        description: "Looking for talent with basic skills or fresh graduates ready to execute predefined tasks.",
        exp: "0-2 years exp",
    },
    {
        id: ExperienceLevel.INTERMEDIATE,
        label: "Intermediate",
        description: "Looking for substantial experience to independently resolve blockers and build modules.",
        exp: "3-5 years exp",
    },
    {
        id: ExperienceLevel.EXPERT,
        label: "Expert",
        description: "Comprehensive domain mastery, system design, architectural leadership, and production triage.",
        exp: "6+ years exp",
    },
];

const DURATIONS: { id: JobDuration; label: string }[] = [
    { id: JobDuration.LESS_THAN_1_MONTH, label: "< 1 Month" },
    { id: JobDuration.ONE_TO_THREE_MONTHS, label: "1 to 3 Months" },
    { id: JobDuration.THREE_TO_SIX_MONTHS, label: "3 to 6 Months" },
    { id: JobDuration.MORE_THAN_6_MONTHS, label: "6+ Months" },
];

const LOCATIONS = [
    { id: "worldwide", label: "Worldwide (Anywhere)" },
    { id: "north-america", label: "North America Only" },
    { id: "europe", label: "Europe Only" },
    { id: "remote-us", label: "United States Only" },
];

const VISIBILITY_OPTIONS = [
    { id: JobVisibility.PUBLIC, label: "Public (All Verified Freelancers)" },
    { id: JobVisibility.INVITE_ONLY, label: "Invite-Only" },
    { id: JobVisibility.PRIVATE, label: "Private" },
];

export default function ScopeDurationStep({ formData, updateForm }: StepProps) {
    return (
        <section className="card">
            <h2 className="text-headline-md text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-primary" />
                2. Scope, Duration & Experience
            </h2>

            {/* Experience Level */}
            <div className="mt-6">
                <label className="text-label-md text-on-surface">Required Experience Level *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {EXPERIENCE_LEVELS.map(({ id, label, description, exp }) => {
                        const active = formData.experienceLevel === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => updateForm({ experienceLevel: id })}
                                className={`text-left rounded-md border p-3 flex flex-col justify-between transition-colors cursor-pointer ${active
                                        ? "border-primary bg-primary-container/10"
                                        : "border-outline-variant bg-surface-container hover:border-outline"
                                    }`}
                            >
                                <div className="space-y-1">
                                    <p className="text-label-md text-on-surface font-medium">{label}</p>
                                    <p className="text-body-sm text-on-surface-variant line-clamp-3">{description}</p>
                                </div>
                                <span className={`text-label-sm mt-3 ${active ? "text-primary font-semibold" : "text-on-surface-variant"}`}>
                                    {exp}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Duration */}
            <div className="mt-6">
                <label className="text-label-md text-on-surface">Estimated Engagement Duration *</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {DURATIONS.map(({ id, label }) => {
                        const active = formData.duration === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => updateForm({ duration: id })}
                                className={`text-label-md rounded-md px-4 py-2.5 transition-colors cursor-pointer ${active
                                        ? "bg-primary text-on-primary font-medium"
                                        : "bg-surface-container text-on-surface-variant border border-outline-variant hover:border-outline"
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Location and Visibility Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                    <label htmlFor="location" className="text-label-md text-on-surface">
                        Preferred Freelancer Location
                    </label>
                    <div className="relative mt-2">
                        <Globe2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                        <select
                            id="location"
                            value={formData.location || "worldwide"}
                            onChange={(e) => updateForm({ location: e.target.value })}
                            className="w-full appearance-none bg-surface-container border border-outline-variant rounded-md pl-9 pr-9 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
                        >
                            {LOCATIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label htmlFor="visibility" className="text-label-md text-on-surface">
                        Job Visibility & Access
                    </label>
                    <div className="relative mt-2">
                        <Eye size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                        <select
                            id="visibility"
                            value={formData.visibility || JobVisibility.PUBLIC}
                            onChange={(e) => updateForm({ visibility: e.target.value as JobVisibility })}
                            className="w-full appearance-none bg-surface-container border border-outline-variant rounded-md pl-9 pr-9 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
                        >
                            {VISIBILITY_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}