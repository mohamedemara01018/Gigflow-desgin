"use client";

import { Eye, FolderOpen, Plus, Star } from "lucide-react";

interface Project {
    id: string;
    title: string;
    role: string;
    status: "Published" | "Draft";
    tags: string[];
    views?: string;
    featured?: boolean;
    imageUrl: string;
}

const PROJECTS: Project[] = [
    {
        id: "1",
        title: "Aura Financial Platform",
        role: "Complete redesign of a high-frequency trading platform...",
        status: "Published",
        tags: ["React", "Figma", "D3.js"],
        views: "45.2k",
        featured: true,
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA-jYpvrrKHWq6QH0bEtD4yMSO5a8vX04LmXrNWNHQLXqiFjY4bQpqBti1DQGRg6OCFZCgtDViQabvIiy-spv4XaT8x35xqJPgwXdTGmvZ1vUsKTM8Kv2FOC3Ip4JtN8yX-6Nm_eOvunzubqcns7VCDZR9FiOPRVLwqhMZDvQQMOAN2JRoRLa5v3OwNMwQ-hg9qP0Pf96pYto8xQ6rO1hlPnP6XY-YJgKAXdouE4FACRvBUOmK7s2moHdeSvRkFrWfCXBPzD0kRjKM",
    },
    {
        id: "2",
        title: "Lumina E-Commerce",
        role: "Lead UI/UX Designer",
        status: "Draft",
        tags: ["Shopify"],
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBnQJOVzDpn4HRUQ995oDK8vNKEldnD0Vb_ZKIOFY-5251x_rTcJi3UMcPejacZ6ha9vAvgsnoW77j0mfzWS5-A5LkmhDKDHbynaLIPourfV2xS9bn2CdCZhFvwV91CcMAGbQKV_iMxq_9UcSMXqIxCcxf7jZu-SuWIc0KLd2FJu2cJHwd3uFonwt8Gzqizy9w9tBiuwlyef-4kXv_YtQ1tfeh2W2NmQHcRVZSyMXA3HtxRDHWznYSvknNbzV5N6aol7B-Ghwdf82c",
    },
];

function ProjectCard({ project }: { project: Project }) {
    const isLarge = project.featured;

    return (
        <div
            className={`card !p-0 overflow-hidden flex ${isLarge ? "md:col-span-2 flex-col md:flex-row" : "flex-col"
                }`}
        >
            <div className={`relative shrink-0 ${isLarge ? "md:w-1/2 h-64 md:h-auto" : "h-48"}`}>
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                {project.featured && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 bg-surface-container-lowest text-on-surface text-label-sm px-2.5 py-1 rounded-full">
                        <Star size={12} className="text-primary fill-primary" />
                        Featured
                    </span>
                )}
            </div>

            <div className="p-5 flex-1">
                <span
                    className={`inline-block text-label-sm px-2.5 py-1 rounded-full ${project.status === "Published"
                            ? "bg-primary/10 text-primary"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                >
                    {project.status}
                </span>
                <p
                    className={`font-semibold text-on-surface mt-2 ${isLarge ? "text-headline-md !text-[26px] !leading-8" : "text-body-lg"
                        }`}
                >
                    {project.title}
                </p>
                <p className="text-body-sm text-on-surface-variant mt-1.5">{project.role}</p>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span className="flex items-center gap-1 text-body-sm text-on-surface-variant shrink-0">
                        <Eye size={14} />
                        {project.views ?? "--"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function PortfolioTabContent() {
    return (
        <div className="pt-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">Portfolio</h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Curate your best work. High-impact projects attract premium
                        clients.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity">
                    <Plus size={16} />
                    Add Project
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="card">
                    <span className="flex items-center gap-2 text-label-sm uppercase tracking-wide text-on-surface-variant">
                        <Eye size={14} />
                        Total Impressions
                    </span>
                    <p className="text-headline-lg !text-[32px] !leading-10 font-bold text-on-surface mt-2">
                        148.2k
                    </p>
                    <p className="text-body-sm text-primary mt-1">+12% this month</p>
                </div>
                <div className="card">
                    <span className="flex items-center gap-2 text-label-sm uppercase tracking-wide text-on-surface-variant">
                        <FolderOpen size={14} />
                        Live Projects
                    </span>
                    <p className="text-headline-lg !text-[32px] !leading-10 font-bold text-on-surface mt-2">
                        12
                    </p>
                    <div className="h-1.5 rounded-full bg-surface-container-high mt-3 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: "80%" }} />
                    </div>
                </div>
                <div className="bg-primary text-on-primary rounded-lg p-5">
                    <span className="text-label-sm uppercase tracking-wide opacity-90">
                        Weekly Engagement
                    </span>
                    <div className="flex items-end gap-2 h-16 mt-3">
                        {[40, 65, 35, 90, 55, 70].map((h, i) => (
                            <span
                                key={i}
                                className="flex-1 rounded-sm bg-on-primary/40"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {PROJECTS.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}