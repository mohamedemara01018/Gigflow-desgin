"use client";

import { Award, Globe, Briefcase, GraduationCap, Plus, Star, Landmark } from "lucide-react";

interface SkillItem {
    id: string;
    name: string;
    years: string;
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    primary?: boolean;
}

const SKILLS: SkillItem[] = [
    { id: "1", name: "Frontend Development", years: "5 Years", level: "Expert", primary: true },
    { id: "2", name: "UI/UX Design", years: "3 Years", level: "Advanced" },
    { id: "3", name: "Backend (Node.js)", years: "2 Years", level: "Intermediate" },
];

const LEVEL_CLASSES: Record<SkillItem["level"], string> = {
    Beginner: "bg-surface-container-high text-on-surface-variant",
    Intermediate: "bg-tertiary text-on-tertiary",
    Advanced: "bg-secondary/15 text-secondary",
    Expert: "bg-primary text-on-primary",
};

const LEVEL_BAR_WIDTH: Record<SkillItem["level"], string> = {
    Beginner: "25%",
    Intermediate: "45%",
    Advanced: "70%",
    Expert: "100%",
};

const LEVEL_BAR_COLOR: Record<SkillItem["level"], string> = {
    Beginner: "bg-on-surface-variant",
    Intermediate: "bg-tertiary",
    Advanced: "bg-secondary",
    Expert: "bg-primary",
};

const LANGUAGES = [
    { code: "EN", name: "English", level: "Native" },
    { code: "ES", name: "Spanish", level: "Professional" },
];

const EXPERIENCE = [
    {
        id: "1",
        title: "Senior Frontend Engineer",
        company: "TechNova Solutions",
        period: "Jan 2021 - Present",
        description:
            "Led the migration of a legacy monolithic application to a modern micro-frontend architecture using React and Module Federation. Managed a team of 4 developers and improved overall application performance by 40%.",
        tags: ["React", "TypeScript", "Webpack"],
    },
    {
        id: "2",
        title: "UI Developer",
        company: "Creative Spark Agency",
        period: "Mar 2018 - Dec 2020",
        description:
            "Developed responsive, accessible web interfaces for various high-profile e-commerce clients. Collaborated closely with the design team to ensure pixel-perfect implementation of Figma prototypes.",
        tags: ["Vue.js", "SASS", "Figma"],
    },
];

export default function SkillsExperienceTabContent() {
    return (
        <div className="pt-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">
                        Skills &amp; Experience
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2 max-w-[560px]">
                        Manage your professional profile. Highlighting your expertise
                        helps match you with the right opportunities.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2.5 hover:bg-surface-container-highest transition-colors">
                        Export Resume
                    </button>
                    <button className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <section className="card">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-headline-md text-on-surface">
                                <Award size={20} className="text-primary" />
                                Core Skills
                            </span>
                            <button
                                aria-label="Add skill"
                                className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 mt-4">
                            {SKILLS.map((skill) => (
                                <div key={skill.id}>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-body-md font-medium text-on-surface">
                                            {skill.name}
                                            {skill.primary && (
                                                <Star size={13} className="text-primary fill-primary" />
                                            )}
                                        </span>
                                        <span
                                            className={`text-label-sm px-2.5 py-1 rounded-full ${LEVEL_CLASSES[skill.level]}`}
                                        >
                                            {skill.level}
                                        </span>
                                    </div>
                                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                                        {skill.years}
                                    </p>
                                    <div className="h-1.5 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${LEVEL_BAR_COLOR[skill.level]}`}
                                            style={{ width: LEVEL_BAR_WIDTH[skill.level] }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-headline-md text-on-surface">
                                <Globe size={20} className="text-primary" />
                                Languages
                            </span>
                            <button
                                aria-label="Add language"
                                className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2.5 mt-4">
                            {LANGUAGES.map((lang) => (
                                <div
                                    key={lang.code}
                                    className="flex items-center justify-between bg-surface-container-low rounded-md p-3.5"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-label-sm font-semibold">
                                            {lang.code}
                                        </span>
                                        <span className="text-body-md text-on-surface">{lang.name}</span>
                                    </div>
                                    <span className="text-body-sm text-on-surface-variant">
                                        {lang.level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="flex flex-col gap-6">
                    <section className="card">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-headline-md text-on-surface">
                                <Briefcase size={20} className="text-primary" />
                                Experience
                            </span>
                            <button className="flex items-center gap-1.5 bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors">
                                <Plus size={16} />
                                Add Role
                            </button>
                        </div>

                        <div className="flex flex-col mt-5">
                            {EXPERIENCE.map((exp, i) => (
                                <div key={exp.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="w-3 h-3 rounded-full border-2 border-primary bg-surface-container-lowest shrink-0 mt-1.5" />
                                        {i < EXPERIENCE.length - 1 && (
                                            <span className="w-0.5 flex-1 bg-outline-variant my-1" />
                                        )}
                                    </div>
                                    <div className="pb-6 flex-1">
                                        <div className="bg-surface-container-low rounded-md p-4">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <p className="text-body-lg font-semibold text-on-surface">
                                                    {exp.title}
                                                </p>
                                                <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full">
                                                    {exp.period.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-body-sm text-primary font-medium mt-0.5">
                                                {exp.company}
                                            </p>
                                            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                                                {exp.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {exp.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-headline-md text-on-surface">
                                <GraduationCap size={20} className="text-tertiary" />
                                Education
                            </span>
                            <button className="flex items-center gap-1.5 bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors">
                                <Plus size={16} />
                                Add Education
                            </button>
                        </div>

                        <div className="flex items-center gap-4 bg-surface-container-low rounded-md p-4 mt-4">
                            <span className="w-11 h-11 rounded-md bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                                <Landmark size={20} />
                            </span>
                            <div>
                                <p className="text-body-lg font-semibold text-on-surface">
                                    B.S. Computer Science
                                </p>
                                <p className="text-body-sm text-on-surface-variant">
                                    University of Technology
                                </p>
                                <p className="text-label-sm text-on-surface-variant mt-1">
                                    2014 - 2018
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}