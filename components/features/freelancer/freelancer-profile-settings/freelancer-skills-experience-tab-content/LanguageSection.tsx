"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Globe, Pencil, Plus, Trash2 } from "lucide-react";
import {
    languageService,
    ICreateLanguageDto,
    ILanguage,
    IUpdateLanguageDto,
} from "@/services/language.service"; // Adjust import path
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import LanguageModal from "@/components/modals/LanguageModal";
import SmallLoading from "@/components/ui/SmallLoading";
import EmptyState from "@/components/ui/Emptystate";

interface LanguagesSectionProps {
    profileId: string;
}

export default function LanguagesSection({ profileId }: LanguagesSectionProps) {
    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const [languages, setLanguages] = useState<ILanguage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<ILanguage | null>(null);

    // Fetch languages on mount / profileId change
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setIsLoading(true);
                const response = await languageService.getAllLanguages(profileId);
                setLanguages(response.data.languages);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load languages";
                handleAddToastification(message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (profileId) {
            fetchLanguages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    const handleOpenAddModal = () => {
        setIsEdit(false);
        setSelectedLanguage(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lang: ILanguage) => {
        setIsEdit(true);
        setSelectedLanguage(lang);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLanguage(null);
    };

    const handleSubmit = async (payload: ICreateLanguageDto) => {
        try {
            const response = await languageService.createLanguage(payload);
            setLanguages((prev) => [response.data.language, ...prev]);
            handleAddToastification(response.message || "Language added successfully", "success");
            handleCloseModal();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to add language";
            handleAddToastification(message, "error");
        }
    };

    const handleEdit = async (id: string, payload: IUpdateLanguageDto) => {
        try {
            const response = await languageService.editLanguage(id, payload);
            setLanguages((prev) =>
                prev.map((item) => (item._id === id ? response.data.language : item))
            );
            handleAddToastification(response.message || "Language updated successfully", "success");
            handleCloseModal();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update language";
            handleAddToastification(message, "error");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await languageService.deleteLanguage(id);
            setLanguages((prev) => prev.filter((item) => item._id !== id));
            handleAddToastification(response.message || "Language deleted successfully", "success");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to delete language";
            handleAddToastification(message, "error");
        }
    };

    return (
        <>
            <section className="card p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-headline-md font-semibold text-on-surface">
                        <Globe size={20} className="text-primary" />
                        Languages
                    </span>
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-1.5 bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Loading State & Language Grid */}
                <div className="mt-5">
                    {isLoading ? (
                        <SmallLoading />
                    ) : languages.length === 0 ? (
                        <EmptyState title="No languages added yet." size="compact" />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {languages.map((lang) => (
                                <div
                                    key={lang._id}
                                    className="group flex items-center justify-between bg-surface-container-low border border-outline-variant rounded-lg p-3 hover:border-primary transition-colors"
                                >
                                    <div>
                                        <p className="text-body-md font-semibold text-on-surface">
                                            {lang.name}
                                        </p>
                                        <p className="text-label-sm text-on-surface-variant capitalize">
                                            {lang.level}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(lang)}
                                            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                                            aria-label="Edit language"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(lang._id)}
                                            className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                                            aria-label="Delete language"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Language Modal */}
            <LanguageModal
                setIsEdit={setIsEdit}
                isOpen={isModalOpen}
                isEdit={isEdit}
                selectedLanguage={selectedLanguage}
                profileId={profileId}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onEdit={handleEdit}
            />
        </>
    );
}