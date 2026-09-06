"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { formatDateTime } from "@/utils/functions.utils";
import {
    employmentHistoryService,
    ICreateEmploymentDto,
    IEmploymentHistory,
    IUpdateEmploymentDto,
} from "@/services/employmentHistory.service";
import EmploymentHistoryModal from "@/components/modals/EmploymentHistoryModal";
import { AppDispatch } from "@/store/store";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import EmptyState from "@/components/ui/Emptystate";
import SmallLoading from "@/components/ui/SmallLoading";

interface EmploymentHistorySectionProps {
    profileId: string;
}

export default function EmploymentHistorySection({ profileId }: EmploymentHistorySectionProps) {
    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const [employmentHistories, setEmploymentHistories] = useState<IEmploymentHistory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedEmployment, setSelectedEmployment] = useState<IEmploymentHistory | null>(null);

    // Fetch employment histories on component mount / profileId change
    const fetchEmploymentHistories = useCallback(async () => {
        try {
            setIsLoading(true);
            const employmentRes = await employmentHistoryService.getAllEmploymentHistories(profileId);
            setEmploymentHistories(employmentRes.data.employmentHistories);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load employment histories";
            handleAddToastification(message, "error", DURATION);
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId])
    useEffect(() => {

        if (profileId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchEmploymentHistories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    console.log('employmentHistories', employmentHistories)

    const handleOpenAddModal = () => {
        setIsEdit(false);
        setSelectedEmployment(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (exp: IEmploymentHistory) => {
        setIsEdit(true);
        setSelectedEmployment(exp);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEmployment(null);
    };

    const handleSubmit = async (payload: ICreateEmploymentDto) => {
        try {
            const response = await employmentHistoryService.createEmploymentHistory(payload);
            fetchEmploymentHistories();
            handleAddToastification(response.message || "Employment history added successfully", "success");
            handleCloseModal();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create employment record";
            handleAddToastification(message, "error");
        }
    };

    const handleEdit = async (id: string, payload: IUpdateEmploymentDto) => {
        try {
            const response = await employmentHistoryService.editEmploymentHistory(id, payload);
            fetchEmploymentHistories();
            handleAddToastification(response.message || "Employment history updated successfully", "success");
            handleCloseModal();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update employment record";
            handleAddToastification(message, "error");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await employmentHistoryService.deleteEmploymentHistory(id);
            fetchEmploymentHistories();
            handleAddToastification(response.message || "Employment history deleted successfully", "success");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to delete employment record";
            handleAddToastification(message, "error");
        }
    };

    return (
        <>
            <section className="card p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-headline-md font-semibold text-on-surface">
                        <Briefcase size={20} className="text-primary" />
                        Employment History
                    </span>
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-1.5 bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors"
                    >
                        <Plus size={16} />
                        Add Role
                    </button>
                </div>

                {/* Loading State & Employment List */}
                <div className="flex flex-col mt-5">
                    {isLoading ? (
                        <SmallLoading />
                    ) : employmentHistories.length === 0 ? (
                        <EmptyState title={'No work experience records found.'} size="compact" />
                    ) : (
                        employmentHistories.map((exp, i) => {
                            const dateRange = `${exp.startDate ? formatDateTime(String(exp.startDate)).date : ""
                                } - ${exp.currentlyWorking
                                    ? "Present"
                                    : exp.endDate
                                        ? formatDateTime(String(exp.endDate)).date
                                        : ""
                                }`;

                            return (
                                <div key={exp._id} className="flex gap-4">
                                    {/* Timeline indicator */}
                                    <div className="flex flex-col items-center">
                                        <span className="w-3 h-3 rounded-full border-2 border-primary bg-surface-container-lowest shrink-0 mt-1.5" />
                                        {i < employmentHistories.length - 1 && (
                                            <span className="w-0.5 flex-1 bg-outline-variant my-1" />
                                        )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="pb-6 flex-1">
                                        <div className="group bg-surface-container-low rounded-lg p-4 relative">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <p className="text-body-lg font-semibold text-on-surface">
                                                    {exp.position}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full uppercase">
                                                        {dateRange}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(exp)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-primary transition-opacity"
                                                        aria-label="Edit employment"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(exp._id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error transition-opacity"
                                                        aria-label="Delete employment"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-body-sm text-primary font-medium mt-0.5">
                                                {exp.company}{" "}
                                                {exp.employmentType && (
                                                    <span className="text-on-surface-variant font-normal">
                                                        • {exp.employmentType}
                                                    </span>
                                                )}
                                            </p>
                                            {exp.description && (
                                                <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section >

            {/* Employment History Modal */}
            < EmploymentHistoryModal
                isOpen={isModalOpen}
                isEdit={isEdit}
                selectedEmployment={selectedEmployment}
                profileId={profileId}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onEdit={handleEdit}
            />
        </>
    );
}