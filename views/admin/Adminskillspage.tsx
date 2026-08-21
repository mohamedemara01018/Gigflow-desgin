/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { Plus } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ICreateSkillDto, ISkill, skillService } from "@/services/skill.service";
import AdminSkillFilters, { SkillFilterState } from "@/components/features/admin/admin-skills-page/Adminskillfilters";
import AdminSkillTable from "@/components/features/admin/admin-skills-page/Adminskilltable";
import { Option } from "@/components/ui/SelectFeild";
import SkillModal from "@/components/models/skillModal";

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<ISkill[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
    const [filters, setFilters] = useState<SkillFilterState>({
        search: "",
        category: "",
    });

    // Modal state management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null);

    const pageSize = 8;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = useCallback(
        (message: string, type: IToastificationType, duration?: number) => {
            dispatch(toastify({ message, type, duration }));
        },
        [dispatch]
    );

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput }));
            setPage(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    // Fetch skills from API endpoint
    const fetchSkills = useCallback(async () => {
        try {
            setLoading(true);

            const queryParams: Record<string, any> = {
                page,
                limit: pageSize,
            };
            if (filters.search) queryParams.search = filters.search;
            if (filters.category) queryParams.categoryId = filters.category;

            const response = await skillService.getAllSkills(queryParams);
            const fetchedSkills: ISkill[] = response.data?.skills || [];
            const count: number = response.data?.total || fetchedSkills.length;

            setTotalItems(count);
            setSkills(fetchedSkills);
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to fetch skills", "error", DURATION);
        } finally {
            setLoading(false);
        }
    }, [filters, page, pageSize, handleAddToastification]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSkills();
    }, [fetchSkills]);

    const handleFilter = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "search") {
            setSearchInput(value);
            return;
        }

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
        setPage(1);
    };

    const handleDelete = async (id: string) => {
        try {
            await skillService.deleteSkill(id);
            handleAddToastification("Skill deleted successfully", "success", DURATION);
            fetchSkills();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to delete skill", "error", DURATION);
        }
    };

    // Modal trigger handlers
    const handleOpenCreateModal = () => {
        setIsEdit(false);
        setSelectedSkill(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (skill: ISkill) => {
        setIsEdit(true);
        setSelectedSkill(skill);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setSelectedSkill(null);
    };

    // Modal action handlers
    const handleCreateSkill = async (payload: ICreateSkillDto) => {
        try {
            await skillService.createSkill(payload);
            handleAddToastification("Skill created successfully", "success", DURATION);
            fetchSkills();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to create skill", "error", DURATION);
        }
    };

    const handleUpdateSkill = async (id: string, payload: ICreateSkillDto) => {
        try {
            await skillService.editSkill(id, payload);
            handleAddToastification("Skill updated successfully", "success", DURATION);
            fetchSkills();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to update skill", "error", DURATION);
        }
    };

    return (
        <>
            <div className="wrapper py-6">
                <div className="space-y-8">
                    {/* Header Action Bar */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-headline-lg text-on-surface font-semibold">
                                Skills Directory
                            </h2>
                            <p className="text-body-md text-on-surface-variant mt-1">
                                Manage and categorize the taxonomy of technical skills across the platform.
                            </p>
                        </div>
                        <button
                            onClick={handleOpenCreateModal}
                            className="flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 cursor-pointer hover:opacity-90 duration-150 rounded-md text-label-md font-medium"
                        >
                            <Plus size={16} />
                            Add New Skill
                        </button>
                    </div>

                    {/* Filter Toolbar */}
                    <AdminSkillFilters
                        filters={filters}
                        searchInput={searchInput}
                        onFilterChange={handleFilter}
                    />

                    {/* Skills Table */}
                    <AdminSkillTable
                        skills={skills}
                        loading={loading}
                        page={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        onPageChange={setPage}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* Render Skill Modal */}
            <SkillModal
                isOpen={isModalOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedSkill={selectedSkill}
                categoryOptions={categoryOptions}
                onClose={handleCloseModal}
                onSubmit={handleCreateSkill}
                onEdit={handleUpdateSkill}
            />
        </>
    );
}