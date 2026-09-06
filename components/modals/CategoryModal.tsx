// src/components/modals/CategoryModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
    ICategory,
    ICreateCategoryDto,
    IUpdateCategoryDto,
} from "@/services/category.service";

interface CategoryModalProps {
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    selectedCategory?: ICategory | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: ICreateCategoryDto) => void;
    onEdit: (id: string, payload: IUpdateCategoryDto) => void;
}

export default function CategoryModal({
    selectedCategory,
    isEdit,
    setIsEdit,
    isOpen,
    onClose,
    onSubmit,
    onEdit,
}: CategoryModalProps) {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // Sync modal state whenever opening or switching between create/edit modes
    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedCategory) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setName(selectedCategory.name || "");
                setDescription(selectedCategory.description || "");
            } else {
                // Reset form fields for create mode
                setName("");
                setDescription("");
            }
        }
    }, [isOpen, isEdit, selectedCategory]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: ICreateCategoryDto = {
            name: name.trim(),
            description: description.trim(),
        };

        if (isEdit && selectedCategory?._id) {
            onEdit(selectedCategory._id, payload);
            setIsEdit(false);
        } else {
            onSubmit(payload);
            setName("");
            setDescription("");
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! space-y-4 relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit Category" : "Add Category"}
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Name Input */}
                    <div className="w-full">
                        <label
                            htmlFor="category-name"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Category Name
                        </label>
                        <input
                            id="category-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Frontend Development, Design"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Category Description Input */}
                    <div className="w-full">
                        <label
                            htmlFor="category-description"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="category-description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description..."
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}