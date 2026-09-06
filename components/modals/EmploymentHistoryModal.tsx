"use client";

import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { EmploymentType } from "@/utils/enums.utils";
import { ICreateEmploymentDto, IEmploymentHistory } from "@/services/employmentHistory.service";



interface EmploymentModalProps {
    isEdit: boolean;
    selectedEmployment?: IEmploymentHistory | null;
    isOpen: boolean;
    profileId: string;
    onClose: () => void;
    onSubmit: (payload: ICreateEmploymentDto) => void;
    onEdit: (id: string, payload: ICreateEmploymentDto) => void;
}

function fieldClasses() {
    return "w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary";
}

export default function EmploymentHistoryModal({
    isEdit,
    selectedEmployment,
    isOpen,
    profileId,
    onClose,
    onSubmit,
    onEdit,
}: EmploymentModalProps) {

    console.log('profileId', profileId)
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState("");
    const [employmentType, setEmploymentType] = useState<string>(
        Object.values(EmploymentType)[0] || "Full-time"
    );
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentlyWorking, setCurrentlyWorking] = useState(false);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedEmployment) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setPosition(selectedEmployment.position || "");
                setCompany(selectedEmployment.company || "");
                setEmploymentType(
                    selectedEmployment.employmentType || Object.values(EmploymentType)[0]
                );
                setStartDate(
                    selectedEmployment.startDate
                        ? selectedEmployment.startDate.split("T")[0]
                        : ""
                );
                setEndDate(
                    selectedEmployment.endDate
                        ? selectedEmployment.endDate.split("T")[0]
                        : ""
                );
                setCurrentlyWorking(!!selectedEmployment.currentlyWorking);
                setDescription(selectedEmployment.description || "");
            } else {
                // Reset form fields for create mode
                setPosition("");
                setCompany("");
                setEmploymentType(Object.values(EmploymentType)[0] || "Full-time");
                setStartDate("");
                setEndDate("");
                setCurrentlyWorking(false);
                setDescription("");
            }
        }
    }, [isOpen, isEdit, selectedEmployment]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: ICreateEmploymentDto = {
            profile: profileId,
            company,
            position,
            employmentType,
            startDate,
            endDate: currentlyWorking ? undefined : endDate,
            currentlyWorking,
            description,
        };

        if (isEdit && selectedEmployment?._id) {
            onEdit(selectedEmployment._id, payload);
        } else {
            onSubmit(payload);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! space-y-4 relative bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit Employment" : "Add Employment"}
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Position */}
                    <div>
                        <label
                            htmlFor="position"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Position / Title
                        </label>
                        <input
                            id="position"
                            type="text"
                            required
                            placeholder="e.g. Senior Frontend Developer"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className={fieldClasses()}
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label
                            htmlFor="company"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Company
                        </label>
                        <input
                            id="company"
                            type="text"
                            required
                            placeholder="e.g. Acme Corp"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className={fieldClasses()}
                        />
                    </div>

                    {/* Employment Type */}
                    <div>
                        <label
                            htmlFor="employmentType"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Employment Type
                        </label>
                        <select
                            id="employmentType"
                            value={employmentType}
                            onChange={(e) => setEmploymentType(e.target.value)}
                            className={fieldClasses()}
                        >
                            {Object.values(EmploymentType).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="startDate"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                Start Date
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={fieldClasses()}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="endDate"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                End Date
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                disabled={currentlyWorking}
                                required={!currentlyWorking}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={`${fieldClasses()} disabled:opacity-50`}
                            />
                        </div>
                    </div>

                    {/* Currently Working Checkbox */}
                    <label className="flex items-center gap-2.5 text-body-sm text-on-surface cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={currentlyWorking}
                            onChange={(e) => {
                                setCurrentlyWorking(e.target.checked);
                                if (e.target.checked) setEndDate("");
                            }}
                            className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                        I currently work here
                    </label>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            placeholder="Describe your responsibilities and achievements..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`${fieldClasses()} resize-none`}
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
                            className="flex items-center gap-1.5 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Check size={16} />
                            {isEdit ? "Update Role" : "Save Role"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}