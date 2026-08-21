"use client";

import SkillSection from "./freelancer-skills-experience-tab-content/SkillSection";
import LanguageSection from "./freelancer-skills-experience-tab-content/LanguageSection";
import EmploymentHistorySection from "./freelancer-skills-experience-tab-content/EmploymentHistorySection";
import EducationSection from "./freelancer-skills-experience-tab-content/EducationSection";

interface SkillsExperienceTabContentProps {
    profileId: string;
}

export default function FreelancerSkillsexperiencetabcontent({
    profileId,
}: SkillsExperienceTabContentProps) {
    return (
        <div className="pt-6">
            <div>
                <h1 className="text-headline-lg text-on-surface font-semibold">
                    Skills &amp; Experience
                </h1>
                <p className="text-body-md text-on-surface-variant mt-2 max-w-140">
                    Manage your skills, languages, professional work history, and education.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <SkillSection profileId={profileId} />
                    <LanguageSection profileId={profileId} />
                </div>

                <div className="flex flex-col gap-6">
                    <EmploymentHistorySection profileId={profileId} />
                    <EducationSection profileId={profileId} />
                </div>
            </div>
        </div>
    );
}