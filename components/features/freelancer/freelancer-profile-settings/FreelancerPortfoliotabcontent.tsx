/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PortfolioItemModal, { IPortfolioModalFormData } from "@/components/modals/PortfolioItemModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { IPortfolioItem, portfolioItemService } from "@/services/portfolioItem.service";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { PortfolioProjectStatus } from "@/utils/enums.utils";
import { FolderOpen, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PortfolioMetrics from "./freelancer-portfolio-tab-content/PortfolioMetrics";
import ProjectCard from "./freelancer-portfolio-tab-content/ProjectCard";

export default function FreelancerPortfolioTabContent() {
    const { me } = useSelector(selectMeSlice);
    const [portfolioItems, setPortfolioItems] = useState<IPortfolioItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Modal State
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<IPortfolioItem | null>(null);

    // Confirm Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = useCallback(
        (message: string, type: IToastificationType, duration?: number) => {
            dispatch(toastify({ message, type, duration }));
        },
        [dispatch]
    );

    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const fetchPortfolioItems = useCallback(async () => {
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
    }, [me?._id, handleAddToastification]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPortfolioItems();
    }, [fetchPortfolioItems]);

    // --- Direct Asset Management Functions Passed to Modal ---

    const handleChangeThumbnail = async (id: string, payload: FormData) => {
        try {
            const response = await portfolioItemService.changeThumbnail(id, payload);
            handleAddToastification(response.message || "Thumbnail updated successfully!", "success", DURATION);
            return response;
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to update thumbnail", "error", DURATION);
            throw error;
        }
    };

    const handleDeleteImage = async (id: string, publicId: string) => {
        try {
            const response = await portfolioItemService.deleteImage(id, publicId);
            handleAddToastification(response.message || "Image deleted successfully!", "success", DURATION);
            return response;
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to delete image", "error", DURATION);
            throw error;
        }
    };

    // --------------------------------------------------------

    const buildPayload = (payload: IPortfolioModalFormData): FormData => {
        const formData = new FormData();

        if (payload.freelancer) formData.append("freelancer", payload.freelancer);
        formData.append("title", payload.title || "");
        formData.append("description", payload.description || "");
        formData.append("role", payload.role || "");
        formData.append("projectUrl", payload.projectUrl || "");
        formData.append("githubUrl", payload.githubUrl || "");
        formData.append("figmaUrl", payload.figmaUrl || "");
        formData.append("status", payload.status);
        formData.append("featured", String(Boolean(payload.featured)));

        if (Array.isArray(payload.technologies)) {
            payload.technologies.forEach((tech: string) => {
                if (tech) formData.append("technologies", tech);
            });
        }

        if (payload.thumbnail instanceof File) {
            formData.append("thumbnail", payload.thumbnail);
        }

        if (Array.isArray(payload.newImages)) {
            payload.newImages.forEach((file: File) => {
                if (file instanceof File) {
                    formData.append("images", file);
                }
            });
        }

        return formData;
    };

    const handleCreatePortfolioItem = async (payload: IPortfolioModalFormData) => {
        try {
            const requestBody = buildPayload(payload);
            const response = await portfolioItemService.createPortfolioItem(requestBody as any);
            handleAddToastification(response.message || "Project created successfully!", "success", DURATION);
            await fetchPortfolioItems();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to create project", "error", DURATION);
            throw error;
        }
    };

    const handleEditPortfolioItem = async (id: string, payload: IPortfolioModalFormData) => {
        try {
            const editPayload = {
                freelancer: payload.freelancer,
                title: payload.title,
                description: payload.description,
                role: payload.role,
                projectUrl: payload.projectUrl,
                githubUrl: payload.githubUrl,
                figmaUrl: payload.figmaUrl,
                status: payload.status,
                featured: payload.featured,
                technologies: payload.technologies,
            };

            await portfolioItemService.editPortfolioItem(id, editPayload as any);

            // Append new images if present during edit submit
            if (payload.newImages && payload.newImages.length > 0) {
                const galleryFormData = new FormData();
                payload.newImages.forEach((file: File) => {
                    if (file instanceof File) {
                        galleryFormData.append("images", file);
                    }
                });
                await portfolioItemService.addImage(id, galleryFormData);
            }

            handleAddToastification("Project updated successfully!", "success", DURATION);
            await fetchPortfolioItems();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to update project", "error", DURATION);
            throw error;
        }
    };

    const handleOpenDeleteDialog = (id: string) => {
        setDeletingProjectId(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingProjectId) return;

        try {
            setIsDeleting(true);
            const response = await portfolioItemService.deletePortfolioItem(deletingProjectId);
            handleAddToastification(response.message || "Project deleted successfully!", "success", DURATION);
            setDeleteDialogOpen(false);
            setDeletingProjectId(null);
            await fetchPortfolioItems();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to delete project", "error", DURATION);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        if (isDeleting) return;
        setDeleteDialogOpen(false);
        setDeletingProjectId(null);
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

                <PortfolioMetrics
                    totalViews={metrics.totalViews}
                    liveProjects={metrics.liveProjects}
                    progressPercent={metrics.progressPercent}
                />

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
                                onDelete={handleOpenDeleteDialog}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Portfolio Project"
                description="Are you sure you want to delete this project? This action cannot be undone."
                confirmLabel="Delete"
                tone="danger"
                isLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <PortfolioItemModal
                isOpen={isOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedProject={selectedProject!}
                freelancerId={String(me?._id || "")}
                onClose={handleCloseModal}
                onSubmit={handleCreatePortfolioItem}
                onEdit={handleEditPortfolioItem}
                onChangeThumbnail={handleChangeThumbnail}
                onDeleteImage={handleDeleteImage}
            />
        </>
    );
}