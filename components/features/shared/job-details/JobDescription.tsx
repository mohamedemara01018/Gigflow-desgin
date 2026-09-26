import React from "react";
import { IJob } from "@/services/jobs.service";
import { IJobSkill } from "@/services/jobSkill.service";
import ReadOnlyOverview from "@/components/ui/ReadOnlyOverview";

interface JobDescriptionProps {
    job: IJob;
    responsibilities?: string[];
    skills?: IJobSkill[] | string[];
}

export default function JobDescription({
    job,
    responsibilities = [],
    skills = [],
}: JobDescriptionProps) {
    // Helper function to extract display name and required status
    const getSkillMeta = (
        skillItem: IJobSkill | string,
        index: number
    ): { id: string; name: string; isRequired: boolean } => {
        if (typeof skillItem === "string") {
            return {
                id: `string-skill-${index}-${skillItem}`,
                name: skillItem,
                isRequired: true,
            };
        }

        const isRequired = skillItem.isRequired ?? true;
        let name = "Skill";

        if (typeof skillItem.skill === "object" && skillItem.skill !== null) {
            name = skillItem.skill.name || "Skill";
        } else if (typeof skillItem.skill === "string") {
            name = skillItem.skill;
        }

        return {
            id: skillItem._id || `job-skill-${index}`,
            name,
            isRequired,
        };
    };

    return (
        <section className="card">
            <div className="flex justify-between items-center ">
                <h2 className="text-headline-md text-on-surface">
                    Job Description
                </h2>

                {job?.proposalsCount !== undefined && (
                    <div className="  flex justify-between items-center text-body-sm text-on-surface-variant">
                        <span>Proposals Submitted: </span>
                        <span className="font-semibold text-on-surface">
                            {job.proposalsCount}
                        </span>
                    </div>
                )}

            </div>

            {/* Main Body Description */}
            <div className="flex flex-col gap-4 mt-4 text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                <ReadOnlyOverview content={job.description} width="100%" tabletWidth="100%" />
            </div>

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
                <>
                    <h3 className="text-body-md font-semibold text-on-surface mt-6">
                        Key Responsibilities:
                    </h3>
                    <ul className="flex flex-col gap-2 mt-3">
                        {responsibilities.map((item, index) => (
                            <li
                                key={index}
                                className="flex gap-2 text-body-md text-on-surface-variant leading-relaxed"
                            >
                                <span className="text-primary mt-0.5">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* Required & Optional Skills */}
            {skills.length > 0 && (
                <>
                    <h3 className="text-body-md font-semibold text-on-surface mt-6">
                        Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {skills.map((skillItem, index) => {
                            const { id, name, isRequired } = getSkillMeta(
                                skillItem,
                                index
                            );

                            return (
                                <span
                                    key={id}
                                    className={`text-label-md px-3 py-1 rounded-full border transition-colors ${isRequired
                                        ? "bg-surface-container-high text-on-surface-variant border-transparent"
                                        : "bg-transparent text-on-surface-variant border-outline-variant"
                                        }`}
                                >
                                    {name}
                                    {!isRequired && (
                                        <span className="text-xs text-on-surface-variant/70 ml-1.5 font-normal">
                                            (Optional)
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
}