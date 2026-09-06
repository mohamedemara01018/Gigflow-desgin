/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { Plus } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ICategory, ICreateCategoryDto, IUpdateCategoryDto, categoryService } from "@/services/category.service";
import AdminCategoryFilters, { CategoryFilterState } from "@/components/features/admin/admin-categories-page/AdminCategoryFilters";
import AdminCategoryTable from "@/components/features/admin/admin-categories-page/AdminCategoryTable";
import CategoryModal from "@/components/modals/CategoryModal";

export default function AdminCategoryPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState<CategoryFilterState>({
        search: "",
    });

    // Modal state management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

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

    // Fetch categories from API endpoint
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);

            const queryParams: Record<string, any> = {
                page,
                limit: pageSize,
            };
            if (filters.search) queryParams.search = filters.search;

            const response = await categoryService.getAllCategories(queryParams);
            const fetchedCategories: ICategory[] = response.data?.categories || [];
            const count: number = response.data?.total || fetchedCategories.length;

            setTotalItems(count);
            setCategories(fetchedCategories);
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to fetch categories", "error", DURATION);
        } finally {
            setLoading(false);
        }
    }, [filters, page, pageSize, handleAddToastification]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "search") {
            setSearchInput(value);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await categoryService.deleteCategory(id);
            handleAddToastification("Category deleted successfully", "success", DURATION);
            fetchCategories();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to delete category", "error", DURATION);
        }
    };

    // Modal trigger handlers
    const handleOpenCreateModal = () => {
        setIsEdit(false);
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category: ICategory) => {
        setIsEdit(true);
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setSelectedCategory(null);
    };

    // Modal action handlers
    const handleCreateCategory = async (payload: ICreateCategoryDto) => {
        try {
            await categoryService.createCategory(payload);
            handleAddToastification("Category created successfully", "success", DURATION);
            fetchCategories();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to create category", "error", DURATION);
        }
    };

    const handleUpdateCategory = async (id: string, payload: IUpdateCategoryDto) => {
        try {
            await categoryService.editCategory(id, payload);
            handleAddToastification("Category updated successfully", "success", DURATION);
            fetchCategories();
        } catch (error: any) {
            handleAddToastification(error.message || "Failed to update category", "error", DURATION);
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
                                Category Directory
                            </h2>
                            <p className="text-body-md text-on-surface-variant mt-1">
                                Manage and define high-level taxonomy classifications across the platform.
                            </p>
                        </div>
                        <button
                            onClick={handleOpenCreateModal}
                            className="flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 cursor-pointer hover:opacity-90 duration-150 rounded-md text-label-md font-medium"
                        >
                            <Plus size={16} />
                            Add New Category
                        </button>
                    </div>

                    {/* Filter Toolbar */}
                    <AdminCategoryFilters
                        filters={filters}
                        searchInput={searchInput}
                        onFilterChange={handleFilter}
                    />

                    {/* Categories Table */}
                    <AdminCategoryTable
                        categories={categories}
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

            {/* Render Category Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedCategory={selectedCategory}
                onClose={handleCloseModal}
                onSubmit={handleCreateCategory}
                onEdit={handleUpdateCategory}
            />
        </>
    );
}