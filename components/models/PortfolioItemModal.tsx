"use client";

import React, { useEffect, useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import SelectField, { Option } from "../ui/SelectFeild";
import { PortfolioProjectStatus } from "@/utils/enums.utils";
import { IPortfolioItem } from "@/services/portfolioItem.service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toastify, IToastificationType } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

export interface IPortfolioModalFormData {
    freelancer: string;
    title: string;
    description: string;
    role: string;
    projectUrl: string;
    githubUrl: string;
    figmaUrl: string;
    status: PortfolioProjectStatus;
    featured: boolean;
    technologies: string[];
    thumbnail: File | null;
    newImages: File[];
}

interface PortfolioItemModalProps {
    isEdit?: boolean;
    setIsEdit?: (isEdit: boolean) => void;
    selectedProject?: IPortfolioItem;
    isOpen: boolean;
    freelancerId: string;
    onClose: () => void;
    onSubmit: (payload: IPortfolioModalFormData) => Promise<void> | void;
    onEdit?: (id: string, payload: IPortfolioModalFormData) => Promise<void> | void;
}

const STATUS_OPTIONS: Option[] = Object.values(PortfolioProjectStatus).map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
}));

export default function PortfolioItemModal({
    isEdit = false,
    setIsEdit,
    selectedProject,
    freelancerId,
    isOpen,
    onClose,
    onSubmit,
    onEdit,
}: PortfolioItemModalProps) {
    const dispatch: AppDispatch = useDispatch();

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [projectUrl, setProjectUrl] = useState<string>("");
    const [githubUrl, setGithubUrl] = useState<string>("");
    const [figmaUrl, setFigmaUrl] = useState<string>("");
    const [status, setStatus] = useState<PortfolioProjectStatus>(PortfolioProjectStatus.DRAFT);
    const [featured, setFeatured] = useState<boolean>(false);
    const [techInput, setTechInput] = useState<string>("");
    const [technologies, setTechnologies] = useState<string[]>([]);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [newImages, setNewImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleAddToastification = (
        message: string,
        type: IToastificationType,
        duration?: number
    ) => {
        dispatch(toastify({ message, type, duration }));
    };

    // Sync modal state whenever opening or switching between create/edit modes
    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedProject) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTitle(selectedProject.title || "");
                setDescription(selectedProject.description || "");
                setRole(selectedProject.role || "");
                setProjectUrl(selectedProject.projectUrl || "");
                setGithubUrl(selectedProject.githubUrl || "");
                setFigmaUrl(selectedProject.figmaUrl || "");
                setStatus(selectedProject.status || PortfolioProjectStatus.DRAFT);
                setFeatured(!!selectedProject.featured);
                setTechnologies(
                    selectedProject.technologies?.map((t: any) =>
                        typeof t === "string" ? t : t._id || t.name
                    ) || []
                );
                setThumbnailPreview(selectedProject.thumbnail?.image || "");
                setThumbnail(null);
                setNewImages([]);
            } else {
                // Reset form fields for create mode
                setTitle("");
                setDescription("");
                setRole("");
                setProjectUrl("");
                setGithubUrl("");
                setFigmaUrl("");
                setStatus(PortfolioProjectStatus.DRAFT);
                setFeatured(false);
                setTechInput("");
                setTechnologies([]);
                setThumbnail(null);
                setThumbnailPreview("");
                setNewImages([]);
            }
        }
    }, [isOpen, isEdit, selectedProject]);

    if (!isOpen) return null;

    const handleAddTechnology = () => {
        if (techInput.trim() && !technologies.includes(techInput.trim())) {
            setTechnologies((prev) => [...prev, techInput.trim()]);
            setTechInput("");
        }
    };

    const handleRemoveTechnology = (techToRemove: string) => {
        setTechnologies((prev) => prev.filter((tech) => tech !== techToRemove));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages((prev) => [...prev, ...filesArray]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload: IPortfolioModalFormData = {
            freelancer: freelancerId,
            title,
            description,
            role,
            projectUrl,
            githubUrl,
            figmaUrl,
            status,
            featured,
            technologies,
            thumbnail,
            newImages,
        };

        try {
            if (isEdit && selectedProject?._id && onEdit) {
                await onEdit(selectedProject._id, payload);
                if (setIsEdit) setIsEdit(false);
            } else {
                await onSubmit(payload);
            }
            onClose();
        } catch (error: any) {
            handleAddToastification(
                error?.response?.data?.message || error?.message || "An unexpected error occurred while saving the project.",
                "error",
                DURATION
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100 max-w-2xl w-full space-y-4 relative max-h-[90vh] flex flex-col my-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 shrink-0">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit Portfolio Project" : "Add Portfolio Project"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
                    {/* Title */}
                    <div className="w-full">
                        <label
                            htmlFor="project-title"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Project Title *
                        </label>
                        <input
                            id="project-title"
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. E-Commerce Redesign"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Role & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="w-full">
                            <label
                                htmlFor="project-role"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                Your Role
                            </label>
                            <input
                                id="project-role"
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Lead Frontend Engineer"
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                            />
                        </div>

                        <div className="w-full">
                            <SelectField
                                id="status-select"
                                label="Project Status"
                                name="status"
                                value={status}
                                onChange={(_name, value) => setStatus(value as PortfolioProjectStatus)}
                                options={STATUS_OPTIONS}
                                placeholder="Select status..."
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="w-full">
                        <label
                            htmlFor="project-description"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Description *
                        </label>
                        <textarea
                            id="project-description"
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the project scope and achievements..."
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary resize-none"
                        />
                    </div>

                    {/* Links Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label htmlFor="project-url" className="text-body-sm font-medium text-on-surface block mb-1.5">
                                Live URL
                            </label>
                            <input
                                id="project-url"
                                type="url"
                                value={projectUrl}
                                onChange={(e) => setProjectUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="github-url" className="text-body-sm font-medium text-on-surface block mb-1.5">
                                GitHub URL
                            </label>
                            <input
                                id="github-url"
                                type="url"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="https://github.com/..."
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="figma-url" className="text-body-sm font-medium text-on-surface block mb-1.5">
                                Figma URL
                            </label>
                            <input
                                id="figma-url"
                                type="url"
                                value={figmaUrl}
                                onChange={(e) => setFigmaUrl(e.target.value)}
                                placeholder="https://figma.com/..."
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Technologies Tag Field */}
                    <div className="w-full">
                        <label className="text-body-sm font-medium text-on-surface block mb-2">
                            Technologies / Tools
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTechnology();
                                    }
                                }}
                                placeholder="e.g. React, Next.js, TypeScript"
                                className="flex-1 bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2 text-body-md text-on-surface outline-none focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={handleAddTechnology}
                                className="bg-surface-container-high text-on-surface px-4 py-2 rounded-md hover:bg-surface-container-highest transition-colors flex items-center gap-1 text-label-md"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        {technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2.5">
                                {technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant text-label-sm px-3 py-1 rounded-full"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTechnology(tech)}
                                            className="hover:text-error transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Upload & Gallery Images */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                            <label className="text-body-sm font-medium text-on-surface block mb-2">
                                Thumbnail Image
                            </label>
                            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors overflow-hidden relative">
                                {thumbnailPreview ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-on-surface-variant text-body-sm">
                                        <Upload size={20} />
                                        <span>Click to upload thumbnail</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="text-body-sm font-medium text-on-surface block mb-2">
                                Gallery Images
                            </label>
                            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
                                <div className="flex flex-col items-center gap-1 text-on-surface-variant text-body-sm text-center px-2">
                                    <Upload size={20} />
                                    <span>
                                        {newImages.length
                                            ? `${newImages.length} image(s) selected`
                                            : "Click to add project images"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGalleryImagesChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Featured Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            id="featured-checkbox"
                            type="checkbox"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <label htmlFor="featured-checkbox" className="text-body-sm text-on-surface cursor-pointer select-none">
                            Mark as Featured Project
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : isEdit ? "Update Project" : "Save Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}