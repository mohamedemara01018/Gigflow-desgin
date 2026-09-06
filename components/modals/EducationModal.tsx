"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ICreateEducationDto, IEducation } from "@/services/education.service";

interface EducationModalProps {
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    selectedEducation?: IEducation | null;
    isOpen: boolean;
    profileId: string;
    onClose: () => void;
    onSubmit: (payload: ICreateEducationDto) => void;
    onEdit: (id: string, payload: ICreateEducationDto) => void;
}

export default function EducationModal({
    selectedEducation,
    isEdit,
    setIsEdit,
    isOpen,
    profileId,
    onClose,
    onSubmit,
    onEdit,
}: EducationModalProps) {
    const [school, setSchool] = useState<string>("");
    const [degree, setDegree] = useState<string>("");
    const [fieldOfStudy, setFieldOfStudy] = useState<string>("");
    const [startYear, setStartYear] = useState<number | "">("");
    const [endYear, setEndYear] = useState<number | "">("");
    const [description, setDescription] = useState<string>("");

    // Sync modal state when opening or switching between modes
    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedEducation) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSchool(selectedEducation.school || "");
                setDegree(selectedEducation.degree || "");
                setFieldOfStudy(selectedEducation.fieldOfStudy || "");
                setStartYear(selectedEducation.startYear ?? "");
                setEndYear(selectedEducation.endYear ?? "");
                setDescription(selectedEducation.description || "");
            } else {
                // Reset form fields
                setSchool("");
                setDegree("");
                setFieldOfStudy("");
                setStartYear("");
                setEndYear("");
                setDescription("");
            }
        }
    }, [isOpen, isEdit, selectedEducation]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: ICreateEducationDto = {
            profile: profileId,
            school,
            degree,
            fieldOfStudy,
            startYear: startYear === "" ? undefined : Number(startYear),
            endYear: endYear === "" ? undefined : Number(endYear),
            description,
        };

        if (isEdit && selectedEducation?._id) {
            onEdit(selectedEducation._id, payload);
            setIsEdit(false);
        } else {
            onSubmit(payload);
            setSchool("");
            setDegree("");
            setFieldOfStudy("");
            setStartYear("");
            setEndYear("");
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
                        {isEdit ? "Edit Education" : "Add Education"}
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
                    {/* School / Institution Input */}
                    <div className="w-full">
                        <label
                            htmlFor="school"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            School / University
                        </label>
                        <input
                            id="school"
                            type="text"
                            required
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            placeholder="e.g. Cairo University"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-tertiary"
                        />
                    </div>

                    {/* Degree & Field of Study */}
                    <div className="flex gap-4 items-start">
                        <div className="w-full">
                            <label
                                htmlFor="degree"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                Degree
                            </label>
                            <input
                                id="degree"
                                type="text"
                                value={degree}
                                onChange={(e) => setDegree(e.target.value)}
                                placeholder="e.g. Bachelor's"
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-tertiary"
                            />
                        </div>

                        <div className="w-full">
                            <label
                                htmlFor="fieldOfStudy"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                Field of Study
                            </label>
                            <input
                                id="fieldOfStudy"
                                type="text"
                                value={fieldOfStudy}
                                onChange={(e) => setFieldOfStudy(e.target.value)}
                                placeholder="e.g. Computer Science"
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-tertiary"
                            />
                        </div>
                    </div>

                    {/* Start Year & End Year */}
                    <div className="flex gap-4 items-start">
                        <div className="w-full">
                            <label
                                htmlFor="startYear"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                Start Year
                            </label>
                            <input
                                id="startYear"
                                type="number"
                                min={1950}
                                max={2100}
                                value={startYear}
                                onChange={(e) => setStartYear(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="2020"
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-tertiary"
                            />
                        </div>

                        <div className="w-full">
                            <label
                                htmlFor="endYear"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                End Year (or Expected)
                            </label>
                            <input
                                id="endYear"
                                type="number"
                                min={1950}
                                max={2100}
                                value={endYear}
                                onChange={(e) => setEndYear(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="2024"
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-tertiary"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="w-full">
                        <label
                            htmlFor="description"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add achievements, coursework, or grade..."
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-tertiary resize-none"
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