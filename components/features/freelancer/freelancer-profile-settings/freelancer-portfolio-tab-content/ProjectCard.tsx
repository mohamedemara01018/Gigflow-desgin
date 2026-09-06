/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IPortfolioItem } from "@/services/portfolioItem.service";
import { PortfolioProjectStatus } from "@/utils/enums.utils";
import { Edit, Eye, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
    project: IPortfolioItem;
    onEdit: (project: IPortfolioItem) => void;
    onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
    const isLarge = project.featured;
    const imageSrc = project.thumbnail?.image || "/placeholder-project.png";
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/settings/profile/portfolio/${project._id}`)}
            className={`card p-0! overflow-hidden flex cursor-pointer transition-all hover:border-primary/50 relative group ${isLarge ? "md:col-span-2 flex-col md:flex-row" : "flex-col"
                }`}
        >
            <div className={`relative shrink-0 ${isLarge ? "md:w-1/2 h-64 md:h-auto" : "h-48"}`}>
                <img
                    src={imageSrc}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                {project.featured && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 bg-surface-container-lowest text-on-surface text-label-sm px-2.5 py-1 rounded-full shadow-sm z-10">
                        <Star size={12} className="text-primary fill-primary" />
                        Featured
                    </span>
                )}

                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                        type="button"
                        title="Edit Project"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(project);
                        }}
                        className="p-2 rounded-full bg-surface-container-lowest/90 text-on-surface hover:bg-primary hover:text-on-primary transition-colors shadow-sm"
                    >
                        <Edit size={14} />
                    </button>
                    <button
                        type="button"
                        title="Delete Project"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(project._id);
                        }}
                        className="p-2 rounded-full bg-surface-container-lowest/90 text-on-surface hover:bg-error hover:text-on-error transition-colors shadow-sm"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <span
                        className={`inline-block text-label-sm px-2.5 py-1 rounded-full ${project.status === PortfolioProjectStatus.PUBLISHED
                                ? "bg-primary/10 text-primary"
                                : "bg-surface-container-high text-on-surface-variant"
                            }`}
                    >
                        {project.status}
                    </span>
                    <p
                        className={`font-semibold text-on-surface mt-2 ${isLarge ? "text-headline-md text-[26px]! leading-8!" : "text-body-lg"
                            }`}
                    >
                        {project.title}
                    </p>
                    {project.role && (
                        <p className="text-body-sm text-on-surface-variant mt-1.5">{project.role}</p>
                    )}
                    <p className="text-body-sm text-on-surface-variant/80 mt-2 line-clamp-2">
                        {project.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/30">
                    <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                        {project.technologies?.map((tech: any) => (
                            <span
                                key={tech._id || tech.name || tech}
                                className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-0.5 rounded-full"
                            >
                                {typeof tech === "string" ? tech : tech.name}
                            </span>
                        ))}
                    </div>
                    <span className="flex items-center gap-1 text-body-sm text-on-surface-variant shrink-0">
                        <Eye size={14} />
                        {project.views ?? 0}
                    </span>
                </div>
            </div>
        </div>
    );
}