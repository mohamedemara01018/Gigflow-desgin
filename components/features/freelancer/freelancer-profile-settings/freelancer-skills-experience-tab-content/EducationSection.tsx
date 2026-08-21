"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GraduationCap, Landmark, Pencil, Plus, Trash2 } from "lucide-react";
import {
    educationService,
    ICreateEducationDto,
    IEducation,
    IUpdateEducationDto,
} from "@/services/education.service";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import EducationModal from "@/components/models/EducationModal";
import SmallLoading from "@/components/ui/SmallLoading";
import EmptyState from "@/components/ui/Emptystate";

interface EducationSectionProps {
    profileId: string;
}

export default function EducationSection({ profileId }: EducationSectionProps) {
    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const [educations, setEducations] = useState<IEducation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<IEducation | null>(null);

    // Fetch education history on mount / profileId change

    const fetchEducations = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await educationService.getAllEducations(profileId);
            setEducations(response.data.educations);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load education records";
            handleAddToastification(message, "error");
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId])
    useEffect(() => {
        if (profileId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchEducations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    const handleOpenAddModal = () => {
        setIsEdit(false);
        setSelectedEducation(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (edu: IEducation) => {
        setIsEdit(true);
        setSelectedEducation(edu);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEducation(null);
    };

    const handleSubmit = async (payload: ICreateEducationDto) => {
        try {
            const response = await educationService.createEducation(payload);
            fetchEducations();
            handleAddToastification(response.message || "Education record added successfully", "success");
            handleCloseModal();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create education record";
            handleAddToastification(message, "error");
        }
    };

    const handleEdit = async (id: string, payload: IUpdateEducationDto) => {
        try {
            const response = await educationService.editEducation(id, payload);
            fetchEducations();
            handleAddToastification(response.message || "Education record updated successfully", "success");
            handleCloseModal();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update education record";
            handleAddToastification(message, "error");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await educationService.deleteEducation(id);
            fetchEducations();
            handleAddToastification(response.message || "Education record deleted successfully", "success");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to delete education record";
            handleAddToastification(message, "error");
        }
    };

    return (
        <>
            <section className="card p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-headline-md font-semibold text-on-surface">
                        <GraduationCap size={20} className="text-tertiary" />
                        Education
                    </span>
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-1.5 bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors"
                    >
                        <Plus size={16} />
                        Add Education
                    </button>
                </div>

                {/* List Container */}
                <div className="flex flex-col gap-3 mt-4">
                    {isLoading ? (
                        <SmallLoading />
                    ) : educations.length === 0 ? (
                        <EmptyState title="No education records provided." size="compact" />
                    ) : (
                        educations.map((edu) => {
                            const yearsDisplay =
                                edu.startYear || edu.endYear
                                    ? `${edu.startYear || ""} - ${edu.endYear || "Present"}`
                                    : null;

                            return (
                                <div
                                    key={edu._id}
                                    className="group flex items-start justify-between gap-4 bg-surface-container-low border border-outline-variant rounded-lg p-4 hover:border-tertiary transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="w-11 h-11 rounded-md bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                                            <Landmark size={20} />
                                        </span>
                                        <div>
                                            <p className="text-body-lg font-semibold text-on-surface">
                                                {edu.degree}
                                                {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                                            </p>
                                            <p className="text-body-sm font-medium text-on-surface-variant">
                                                {edu.school}
                                            </p>
                                            {yearsDisplay && (
                                                <p className="text-label-sm text-on-surface-variant mt-1">
                                                    {yearsDisplay}
                                                </p>
                                            )}
                                            {edu.description && (
                                                <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(edu)}
                                            className="p-1.5 text-on-surface-variant hover:text-tertiary transition-colors"
                                            aria-label="Edit education record"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(edu._id)}
                                            className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                                            aria-label="Delete education record"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Education Modal */}
            <EducationModal
                isOpen={isModalOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedEducation={selectedEducation}
                profileId={profileId}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onEdit={handleEdit}
            />
        </>
    );
}