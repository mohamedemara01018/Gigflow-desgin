/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import SelectField, { Option } from "../ui/SelectFeild";
import { PortfolioProjectStatus } from "@/utils/enums.utils";
import { IPortfolioItem } from "@/services/portfolioItem.service";
import { skillService } from "@/services/skill.service";
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
    existingImages?: any[];
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
    onChangeThumbnail?: (id: string, payload: FormData) => Promise<any>;
    onDeleteImage?: (id: string, publicId: string) => Promise<any>;
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
    onChangeThumbnail,
    onDeleteImage,
}: PortfolioItemModalProps) {
    const dispatch: AppDispatch = useDispatch();

    const [skillOptions, setSkillOptions] = useState<Option[]>([]);
    const [isLoadingSkills, setIsLoadingSkills] = useState<boolean>(false);

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [projectUrl, setProjectUrl] = useState<string>("");
    const [githubUrl, setGithubUrl] = useState<string>("");
    const [figmaUrl, setFigmaUrl] = useState<string>("");
    const [status, setStatus] = useState<PortfolioProjectStatus>(PortfolioProjectStatus.DRAFT);
    const [featured, setFeatured] = useState<boolean>(false);

    const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
    const [selectedTechSelect, setSelectedTechSelect] = useState<string>("");

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [isUpdatingThumbnail, setIsUpdatingThumbnail] = useState<boolean>(false);

    // Existing uploaded gallery images (objects containing image & publicId)
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [deletingImagePublicId, setDeletingImagePublicId] = useState<string | null>(null);

    // Newly selected gallery image files
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleAddToastification = (
        message: string,
        type: IToastificationType,
        duration?: number
    ) => {
        dispatch(toastify({ message, type, duration }));
    };

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;

        const fetchSkills = async () => {
            setIsLoadingSkills(true);
            try {
                const response = await skillService.getAllSkills();
                if (isMounted) {
                    const fetched = response.data.skills.map((s) => ({
                        value: s._id,
                        label: s.name,
                    }));
                    setSkillOptions(fetched);
                }
            } catch (err: any) {
                handleAddToastification(err.message || "Failed to fetch skills list", "error", DURATION);
            } finally {
                if (isMounted) setIsLoadingSkills(false);
            }
        };

        fetchSkills();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedProject) {
                setTitle(selectedProject.title || "");
                setDescription(selectedProject.description || "");
                setRole(selectedProject.role || "");
                setProjectUrl(selectedProject.projectUrl || "");
                setGithubUrl(selectedProject.githubUrl || "");
                setFigmaUrl(selectedProject.figmaUrl || "");
                setStatus(selectedProject.status || PortfolioProjectStatus.DRAFT);
                setFeatured(!!selectedProject.featured);
                setSelectedTechIds(
                    selectedProject.technologies?.map((t: any) =>
                        typeof t === "string" ? t : t._id
                    ) || []
                );
                setThumbnailPreview(selectedProject.thumbnail?.image || "");
                setThumbnail(null);

                // Populate existing remote gallery images
                const remoteImgs = selectedProject.images || [];
                setExistingImages(remoteImgs);
                setNewImages([]);
                setNewImagePreviews([]);
            } else {
                setTitle("");
                setDescription("");
                setRole("");
                setProjectUrl("");
                setGithubUrl("");
                setFigmaUrl("");
                setStatus(PortfolioProjectStatus.DRAFT);
                setFeatured(false);
                setSelectedTechIds([]);
                setThumbnail(null);
                setThumbnailPreview("");
                setExistingImages([]);
                setNewImages([]);
                setNewImagePreviews([]);
            }
            setSelectedTechSelect("");
        }
    }, [isOpen, isEdit, selectedProject]);

    if (!isOpen) return null;

    const handleSelectTechnology = (_name: string, value: string | string[]) => {
        const selectedVal = Array.isArray(value) ? value[0] : value;

        if (selectedVal && !selectedTechIds.includes(selectedVal)) {
            setSelectedTechIds((prev) => [...prev, selectedVal]);
        }
        setSelectedTechSelect("");
    };

    const handleRemoveTechnology = (techIdToRemove: string) => {
        setSelectedTechIds((prev) => prev.filter((id) => id !== techIdToRemove));
    };

    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));

        // Direct update on backend if editing existing project
        if (isEdit && selectedProject?._id && onChangeThumbnail) {
            try {
                setIsUpdatingThumbnail(true);
                const formData = new FormData();
                formData.append("thumbnail", file);
                formData.append("publicId", String(selectedProject.thumbnail.publicId))
                await onChangeThumbnail(selectedProject._id, formData);
            } catch (error: any) {
                // Error toastification handled inside parent function
            } finally {
                setIsUpdatingThumbnail(false);
            }
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const objectUrls = filesArray.map((file) => URL.createObjectURL(file));

            setNewImages((prev) => [...prev, ...filesArray]);
            setNewImagePreviews((prev) => [...prev, ...objectUrls]);
        }
    };

    const handleRemoveExistingImage = async (indexToRemove: number, imageObj: any) => {
        if (isEdit && selectedProject?._id && onDeleteImage && imageObj?.publicId) {
            try {
                setDeletingImagePublicId(imageObj.publicId);
                await onDeleteImage(selectedProject._id, imageObj.publicId);
                setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
            } catch (error: any) {
                // Error toastification handled inside parent function
            } finally {
                setDeletingImagePublicId(null);
            }
        } else {
            setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        }
    };

    const handleRemoveNewImage = (indexToRemove: number) => {
        setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setNewImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
            technologies: selectedTechIds,
            thumbnail,
            newImages,
            existingImages,
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

                    {/* Technologies */}
                    <div className="w-full">
                        <label className="text-body-sm font-medium text-on-surface block mb-2">
                            Technologies / Tools
                        </label>
                        <div className="relative">
                            <SelectField
                                id="technologies-select"
                                label=""
                                name="technologies"
                                value={selectedTechSelect}
                                onChange={handleSelectTechnology}
                                options={skillOptions.filter((opt) => !selectedTechIds.includes(opt.value))}
                                placeholder={
                                    isLoadingSkills
                                        ? "Loading technologies..."
                                        : "Select technology..."
                                }
                                disabled={isLoadingSkills}
                            />
                            {isLoadingSkills && (
                                <div className="absolute right-3 top-3 flex items-center">
                                    <Loader2 size={16} className="animate-spin text-primary" />
                                </div>
                            )}
                        </div>

                        {selectedTechIds.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2.5">
                                {selectedTechIds.map((techId) => {
                                    const skillObj = skillOptions.find((opt) => opt.value === techId);
                                    const label = skillObj ? skillObj.label : techId;

                                    return (
                                        <span
                                            key={techId}
                                            className="inline-flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant text-label-sm px-3 py-1 rounded-full"
                                        >
                                            {label}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTechnology(techId)}
                                                className="hover:text-error transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail & Gallery Image Uploader */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        {/* Thumbnail Upload */}
                        <div>
                            <label className="text-body-sm font-medium text-on-surface block mb-2">
                                Thumbnail Image
                            </label>
                            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors overflow-hidden relative">
                                {isUpdatingThumbnail ? (
                                    <div className="flex flex-col items-center gap-1 text-primary text-body-sm">
                                        <Loader2 size={24} className="animate-spin" />
                                        <span>Updating thumbnail...</span>
                                    </div>
                                ) : thumbnailPreview ? (
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
                                    disabled={isUpdatingThumbnail}
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Gallery Images Upload Button */}
                        <div>
                            <label className="text-body-sm font-medium text-on-surface block mb-2">
                                Add Gallery Images
                            </label>
                            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
                                <div className="flex flex-col items-center gap-1 text-on-surface-variant text-body-sm text-center px-2">
                                    <Upload size={20} />
                                    <span>Click to add project images</span>
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

                    {/* Gallery Preview Section */}
                    {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                        <div className="pt-2">
                            <label className="text-body-sm font-medium text-on-surface block mb-2">
                                Gallery Previews ({existingImages.length + newImagePreviews.length})
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {/* Remote/Existing Images */}
                                {existingImages.map((imgObj, index) => {
                                    const imgUrl = typeof imgObj === "string" ? imgObj : imgObj?.image;
                                    const publicId = imgObj?.publicId;
                                    const isDeletingThis = deletingImagePublicId === publicId;

                                    return (
                                        <div key={`existing-${index}`} className="relative h-20 rounded-md overflow-hidden group border border-outline-variant/40">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={imgUrl} alt={`Gallery existing ${index}`} className="w-full h-full object-cover" />
                                            {isDeletingThis ? (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                                                    <Loader2 size={16} className="animate-spin" />
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(index, imgObj)}
                                                    className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-90 group-hover:opacity-100 hover:bg-error transition-all"
                                                    title="Remove image"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Local/New Images */}
                                {newImagePreviews.map((previewUrl, index) => (
                                    <div key={`new-${index}`} className="relative h-20 rounded-md overflow-hidden group border border-outline-variant/40">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt={`Gallery new ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(index)}
                                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-90 group-hover:opacity-100 hover:bg-error transition-all"
                                            title="Remove image"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Featured Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            id="featured-checkbox"
                            type="checkbox"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
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