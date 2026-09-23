/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Zap } from "lucide-react";
import { ICreateJobDto } from "@/services/jobs.service";
import { JobType, JobDuration, ExperienceLevel } from "@/utils/enums.utils";

export enum JobCategory {
    WEB_MOBILE_DEV = "web-mobile-dev",
    DESIGN_CREATIVE = "design-creative",
    AI_DATA_SCIENCE = "ai-data-science",
    SALES_GROWTH = "sales-growth",
    WRITING_CONTENT = "writing-content",
    OPERATIONS_PM = "operations-pm",
}

export enum JobLocation {
    WORLDWIDE = "worldwide",
    NORTH_AMERICA = "north-america",
    EUROPE = "europe",
    REMOTE_US = "remote-us",
}

interface SidebarProps {
    formData: ICreateJobDto;
    onPublish: () => void;
    publishing: boolean;
    isFeatured?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
    [JobCategory.WEB_MOBILE_DEV]: "Web, Mobile & Dev",
    [JobCategory.DESIGN_CREATIVE]: "Design & Creative",
    [JobCategory.AI_DATA_SCIENCE]: "AI & Data Science",
    [JobCategory.SALES_GROWTH]: "Sales & Growth",
    [JobCategory.WRITING_CONTENT]: "Writing & Content",
    [JobCategory.OPERATIONS_PM]: "Operations & PM",
};

const EXPERIENCE_LABELS: Record<string, string> = {
    [ExperienceLevel.ENTRY]: "Entry Level",
    [ExperienceLevel.INTERMEDIATE]: "Intermediate",
    [ExperienceLevel.EXPERT]: "Expert Tier",
};

const DURATION_LABELS: Record<string, string> = {
    [JobDuration.LESS_THAN_1_MONTH]: "< 1 Month",
    [JobDuration.ONE_TO_THREE_MONTHS]: "1 to 3 Months",
    [JobDuration.THREE_TO_SIX_MONTHS]: "3 to 6 Months",
    [JobDuration.MORE_THAN_6_MONTHS]: "6+ Months",
};

const LOCATION_LABELS: Record<string, string> = {
    [JobLocation.WORLDWIDE]: "Worldwide",
    [JobLocation.NORTH_AMERICA]: "North America",
    [JobLocation.EUROPE]: "Europe",
    [JobLocation.REMOTE_US]: "United States",
};

function CircularProgress({ percent }: { percent: number }) {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);

    return (
        <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0">
            <circle cx="26" cy="26" r={radius} stroke="var(--color-outline-variant)" strokeWidth="5" fill="none" />
            <circle
                cx="26"
                cy="26"
                r={radius}
                stroke="var(--color-primary)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 26 26)"
            />
            <text
                x="26"
                y="30"
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="var(--color-on-surface)"
            >
                {percent}%
            </text>
        </svg>
    );
}

export default function JobPreviewSidebar({
    formData,
    isFeatured = false,
}: SidebarProps) {
    const rateLabel =
        formData.type === JobType.HOURLY
            ? formData.hourlyRateFrom && formData.hourlyRateTo
                ? `$${formData.hourlyRateFrom}-$${formData.hourlyRateTo}/hr`
                : "Not set"
            : formData.budget
                ? `$${formData.budget} fixed`
                : "Not set";

    const skillsCount = Array.isArray((formData as any).skills) ? (formData as any).skills.length : 0;

    return (
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="card !p-5">
                <div className="flex items-center justify-between">
                    <p className="text-label-sm text-on-surface-variant">Live Posting Preview</p>
                    <div className="flex items-center gap-1.5">
                        {isFeatured && (
                            <span className="text-label-sm text-primary bg-primary-container/15 px-2 py-0.5 rounded-full">
                                Featured
                            </span>
                        )}
                        <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full capitalize">
                            {formData.status || "Draft"}
                        </span>
                    </div>
                </div>

                <h3 className="text-headline-md text-on-surface mt-3 line-clamp-3">
                    {formData.title?.trim() || "Your job title will appear here"}
                </h3>

                <div className="flex items-center gap-2.5 mt-4">
                    <span className="w-8 h-8 rounded-full bg-primary text-on-primary text-label-sm flex items-center justify-center shrink-0">
                        MV
                    </span>
                    <div className="min-w-0">
                        <p className="text-body-sm text-on-surface truncate">Marcus Vance</p>
                        <p className="text-label-sm text-on-surface-variant truncate">$42,800 spent · 100% Hire Rate</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                        <p className="text-label-sm text-on-surface-variant">Rate / Budget</p>
                        <p className="text-body-sm text-on-surface mt-0.5">{rateLabel}</p>
                    </div>
                    <div>
                        <p className="text-label-sm text-on-surface-variant">Experience</p>
                        <p className="text-body-sm text-on-surface mt-0.5">
                            {formData.experienceLevel ? EXPERIENCE_LABELS[formData.experienceLevel] ?? formData.experienceLevel : "Not set"}
                        </p>
                    </div>
                    <div>
                        <p className="text-label-sm text-on-surface-variant">Duration</p>
                        <p className="text-body-sm text-on-surface mt-0.5">
                            {formData.duration ? DURATION_LABELS[formData.duration] ?? formData.duration : "Not set"}
                        </p>
                    </div>
                    <div>
                        <p className="text-label-sm text-on-surface-variant">Location</p>
                        <p className="text-body-sm text-on-surface mt-0.5">
                            {formData.location ? LOCATION_LABELS[formData.location] ?? formData.location : "Not set"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-outline-variant">
                    <div className="flex items-center justify-between">
                        <p className="text-label-sm text-on-surface-variant">Category</p>
                        <p className="text-body-sm text-on-surface truncate ml-2">
                            {formData.category ? CATEGORY_LABELS[formData.category] ?? formData.category : "Not set"}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-label-sm text-on-surface-variant">Max Applicants</p>
                        <p className="text-body-sm text-on-surface">
                            {formData.maxProposals ? `Cap at ${formData.maxProposals}` : "No cap"}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-label-sm text-on-surface-variant">Required Skills</p>
                        <p className="text-body-sm text-on-surface">
                            {skillsCount} Tagged
                        </p>
                    </div>
                </div>
            </div>

            <div className="card !p-5">
                <div className="flex items-center justify-between">
                    <p className="text-label-sm text-on-surface-variant">Estimated Qualified Talent</p>
                    <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                        High Density
                    </span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                    <CircularProgress percent={54} />
                    <div>
                        <p className="text-headline-md text-on-surface">1,480+</p>
                        <p className="text-body-sm text-on-surface-variant">
                            Senior talent actively matching this filter
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-outline-variant text-body-sm text-on-surface-variant">
                    <Zap size={14} className="text-primary shrink-0" />
                    Avg. response time for featured posts: 42 minutes
                </div>
            </div>
        </aside>
    );
}