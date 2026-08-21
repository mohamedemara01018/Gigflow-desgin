/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PortfolioItemModal, { IPortfolioModalFormData } from "@/components/models/PortfolioItemModal";
import { IPortfolioItem, portfolioItemService } from "@/services/portfolioItem.service";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { PortfolioProjectStatus } from "@/utils/enums.utils";
import { Eye, FolderOpen, Loader2, Plus, Star, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ProjectCardProps {
    project: IPortfolioItem;
    onEdit: (project: IPortfolioItem) => void;
    onDelete: (id: string) => void;
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
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

                {/* Edit & Delete Actions Overlay */}
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

export default function PortfolioTabContent() {
    const { me } = useSelector(selectMeSlice);
    const [portfolioItems, setPortfolioItems] = useState<IPortfolioItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Modal State
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<IPortfolioItem | null>(null);

    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (
        message: string,
        type: IToastificationType,
        duration?: number
    ) => {
        dispatch(toastify({ message, type, duration }));
    };

    const fetchPortfolioItems = async () => {
        if (!me?._id) return;
        try {
            setLoading(true);
            const portfolioRes = await portfolioItemService.getAllPortfolioItems({
                freelancer: me._id,
            });
            setPortfolioItems(portfolioRes.data.portfolioItems || []);
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to load portfolio items", "error", DURATION);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPortfolioItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [me?._id]);

    const buildFormDataPayload = (payload: IPortfolioModalFormData): FormData => {
        const formData = new FormData();

        if (payload.freelancer) formData.append("freelancer", payload.freelancer);
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        if (payload.role) formData.append("role", payload.role);
        if (payload.projectUrl) formData.append("projectUrl", payload.projectUrl);
        if (payload.githubUrl) formData.append("githubUrl", payload.githubUrl);
        if (payload.figmaUrl) formData.append("figmaUrl", payload.figmaUrl);
        formData.append("status", payload.status);
        formData.append("featured", String(payload.featured));

        // Append technologies array
        if (Array.isArray(payload.technologies)) {
            payload.technologies.forEach((tech: string) => {
                formData.append("technologies[]", tech);
            });
        }

        // Append thumbnail file
        if (payload.thumbnail) {
            formData.append("thumbnail", payload.thumbnail);
        }

        // Append new gallery images
        if (Array.isArray(payload.newImages)) {
            payload.newImages.forEach((file: File) => {
                formData.append("images", file);
            });
        }

        return formData;
    };

    const handleCreatePortfolioItem = async (payload: IPortfolioModalFormData) => {
        try {
            const formData = buildFormDataPayload(payload);
            const response = await portfolioItemService.createPortfolioItem(formData);
            handleAddToastification(response.message || "Project created successfully!", "success", DURATION);
            await fetchPortfolioItems();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to create project", "error", DURATION);
            throw error;
        }
    };

    const handleEditPortfolioItem = async (id: string, payload: IPortfolioModalFormData) => {
        try {
            const formData = buildFormDataPayload(payload);
            const response = await portfolioItemService.editPortfolioItem(id, formData);
            handleAddToastification(response.message || "Project updated successfully!", "success", DURATION);
            await fetchPortfolioItems();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to update project", "error", DURATION);
            throw error;
        }
    };

    const handleDeletePortfolioItem = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const response = await portfolioItemService.deletePortfolioItem(id);
            handleAddToastification(response.message || "Project deleted successfully!", "success", DURATION);
            await fetchPortfolioItems();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to delete project", "error", DURATION);
        }
    };

    const handleOpenCreateModal = () => {
        setIsEdit(false);
        setSelectedProject(null);
        setIsOpen(true);
    };

    const handleOpenEditModal = (project: IPortfolioItem) => {
        setIsEdit(true);
        setSelectedProject(project);
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setIsEdit(false);
        setSelectedProject(null);
    };

    // Derived Metrics
    const metrics = useMemo(() => {
        const totalViews = portfolioItems.reduce((acc, curr) => acc + (curr.views || 0), 0);
        const liveProjects = portfolioItems.filter(
            (item) =>
                item.status === PortfolioProjectStatus.PUBLISHED || item.status === ("Published" as any)
        ).length;
        const progressPercent = portfolioItems.length
            ? Math.round((liveProjects / portfolioItems.length) * 100)
            : 0;

        return { totalViews, liveProjects, progressPercent };
    }, [portfolioItems]);

    return (
        <>
            <div className="pt-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-headline-lg text-on-surface">Portfolio</h1>
                        <p className="text-body-md text-on-surface-variant mt-2">
                            Curate your best work. High-impact projects attract premium clients.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity"
                    >
                        <Plus size={16} />
                        Add Project
                    </button>
                </div>

                {/* Metrics Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="card">
                        <span className="flex items-center gap-2 text-label-sm uppercase tracking-wide text-on-surface-variant">
                            <Eye size={14} />
                            Total Impressions
                        </span>
                        <p className="text-headline-lg text-[32px]! leading-10! font-bold text-on-surface mt-2">
                            {metrics.totalViews.toLocaleString()}
                        </p>
                        <p className="text-body-sm text-primary mt-1">Across all projects</p>
                    </div>

                    <div className="card">
                        <span className="flex items-center gap-2 text-label-sm uppercase tracking-wide text-on-surface-variant">
                            <FolderOpen size={14} />
                            Live Projects
                        </span>
                        <p className="text-headline-lg text-[32px]! leading-10! font-bold text-on-surface mt-2">
                            {metrics.liveProjects}
                        </p>
                        <div className="h-1.5 rounded-full bg-surface-container-high mt-3 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-300"
                                style={{ width: `${metrics.progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-primary text-on-primary rounded-lg p-5">
                        <span className="text-label-sm uppercase tracking-wide opacity-90">
                            Portfolio Distribution
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

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-62.5 gap-2 mt-6">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-body-md text-on-surface-variant">Loading portfolio projects...</p>
                    </div>
                ) : portfolioItems.length === 0 ? (
                    <div className="card text-center py-12 mt-6 flex flex-col items-center justify-center">
                        <FolderOpen size={48} className="text-on-surface-variant/40 mb-3" />
                        <p className="text-headline-sm font-medium text-on-surface">No projects found</p>
                        <p className="text-body-md text-on-surface-variant mt-1 max-w-md">
                            You haven&apos;t created any portfolio projects yet. Click above to add your first project.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {portfolioItems.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onEdit={handleOpenEditModal}
                                onDelete={handleDeletePortfolioItem}
                            />
                        ))}
                    </div>
                )}
            </div>

            <PortfolioItemModal
                isOpen={isOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedProject={selectedProject!}
                freelancerId={String(me?._id || "")}
                onClose={handleCloseModal}
                onSubmit={handleCreatePortfolioItem}
                onEdit={handleEditPortfolioItem}
            />
        </>
    );
}