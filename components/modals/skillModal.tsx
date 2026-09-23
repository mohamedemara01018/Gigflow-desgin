// src/components/features/admin/admin-skills-page/SkillModal.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import SelectField, { Option } from "@/components/ui/SelectFeild";
import { ICreateSkillDto, ISkill } from "@/services/skill.service";
import { categoryService, ICategory } from "@/services/category.service";

interface SkillModalProps {
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    selectedSkill?: ISkill | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: ICreateSkillDto) => void;
    onEdit: (id: string, payload: ICreateSkillDto) => void;
}

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};

export default function SkillModal({
    selectedSkill,
    isEdit,
    setIsEdit,
    isOpen,
    onClose,
    onSubmit,
    onEdit,
}: SkillModalProps) {
    const [name, setName] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [icon, setIcon] = useState<string>("");

    // Dynamic categories state from API
    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
    const [fetchingCategories, setFetchingCategories] = useState<boolean>(false);

    const resetForm = useCallback(() => {
        setName("");
        setSlug("");
        setCategory("");
        setDescription("");
        setIcon("");
    }, []);

    // Fetch categories from API on modal open
    useEffect(() => {
        if (!isOpen) return;

        let isSubscribed = true;

        const loadCategories = async () => {
            try {
                setFetchingCategories(true);
                const res = await categoryService.getAllCategories();

                // Extract categories depending on your response wrapper structural format
                const categoriesData: ICategory[] = res.data.categories

                if (isSubscribed) {
                    const options: Option[] = categoriesData.map((cat) => ({
                        value: cat._id,
                        label: cat.name,
                    }));
                    setCategoryOptions(options);
                }
            } catch (err) {
                console.error("Failed to load categories for select dropdown:", err);
            } finally {
                if (isSubscribed) setFetchingCategories(false);
            }
        };

        loadCategories();

        return () => {
            isSubscribed = false;
        };
    }, [isOpen]);

    // Populate or reset form fields when modal opens or edit targets change
    useEffect(() => {
        if (!isOpen) return;

        if (isEdit && selectedSkill) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(selectedSkill.name || "");
            setSlug(selectedSkill.slug || slugify(selectedSkill.name || ""));

            const catId =
                typeof selectedSkill.category === "object" && selectedSkill.category !== null
                    ? (selectedSkill.category as { _id: string })._id
                    : (selectedSkill.category as string) || "";

            setCategory(catId);
            setDescription(selectedSkill.description || "");
            setIcon(selectedSkill.icon || "");
        } else {
            resetForm();
        }
    }, [isOpen, isEdit, selectedSkill, resetForm]);

    if (!isOpen) return null;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (!isEdit) {
            setSlug(slugify(val));
        }
    };

    const handleClose = () => {
        setIsEdit(false);
        resetForm();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: ICreateSkillDto = {
            name,
            slug: slug || slugify(name),
            category: category || null,
            description,
            icon: icon || null,
        };

        if (isEdit && selectedSkill?._id) {
            onEdit(selectedSkill._id, payload);
            setIsEdit(false);
        } else {
            onSubmit(payload);
        }

        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! space-y-4 relative bg-surface p-6 rounded-xl border border-outline-variant/30 shadow-lg max-w-lg w-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit Skill" : "Add Skill"}
                    </h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Skill Name */}
                    <div className="w-full">
                        <label
                            htmlFor="skill-name"
                            className="text-body-sm font-medium text-on-surface block mb-1.5"
                        >
                            Skill Name <span className="text-error">*</span>
                        </label>
                        <input
                            id="skill-name"
                            type="text"
                            required
                            maxLength={100}
                            value={name}
                            onChange={handleNameChange}
                            placeholder="e.g. React, TypeScript, Node.js"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Slug Input */}
                    <div className="w-full">
                        <label
                            htmlFor="skill-slug"
                            className="text-body-sm font-medium text-on-surface block mb-1.5"
                        >
                            Slug <span className="text-error">*</span>
                        </label>
                        <input
                            id="skill-slug"
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. react, typescript"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary font-mono text-sm"
                        />
                    </div>

                    {/* Category Selector */}
                    <div className="w-full">
                        {fetchingCategories ? (
                            <div className="flex items-center gap-2 py-2 text-body-sm text-on-surface-variant">
                                <Loader2 size={16} className="animate-spin text-primary" />
                                <span>Loading categories...</span>
                            </div>
                        ) : (
                            <SelectField
                                id="category-select"
                                label="Category"
                                name="category"
                                value={category}
                                onChange={(_name, value) => {
                                    const selectedValue = Array.isArray(value) ? value[0] || "" : value;
                                    setCategory(selectedValue);
                                }}
                                options={categoryOptions}
                                placeholder={
                                    categoryOptions.length === 0
                                        ? "No categories available"
                                        : "Select a category..."
                                }
                            />
                        )}
                    </div>

                    {/* Icon URL / Class */}
                    <div className="w-full">
                        <label
                            htmlFor="skill-icon"
                            className="text-body-sm font-medium text-on-surface block mb-1.5"
                        >
                            Icon URL / Class (Optional)
                        </label>
                        <input
                            id="skill-icon"
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="e.g. https://example.com/icon.svg or devicon-react-original"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Description */}
                    <div className="w-full">
                        <label
                            htmlFor="skill-description"
                            className="text-body-sm font-medium text-on-surface block mb-1.5"
                        >
                            Description (Optional)
                        </label>
                        <textarea
                            id="skill-description"
                            maxLength={500}
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description about this skill..."
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/30">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer font-medium"
                        >
                            {isEdit ? "Update Skill" : "Save Skill"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}