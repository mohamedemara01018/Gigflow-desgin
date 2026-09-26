'use client';

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { categoryService, ICategory } from "@/services/category.service";
import { IGetJobsQueryParams } from "@/services/jobs.service";
import { onClose, selectToggleSidebar } from "@/store/slices/toggleSidebarSlice";
import { ChevronDown, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface FilterSidebarProps {
    onFilterChange?: (filters: IGetJobsQueryParams) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <>
            {isMobile ? (
                <MobileFilterSiderbar isMobile={isMobile} onFilterChange={onFilterChange} />
            ) : (
                <aside className="card h-fit flex flex-col gap-6">
                    <FilterItems isMobile={isMobile} onFilterChange={onFilterChange} />
                </aside>
            )}
        </>
    );
}

function MobileFilterSiderbar({
    isMobile,
    onFilterChange,
}: {
    isMobile: boolean;
    onFilterChange?: (filters: IGetJobsQueryParams) => void;
}) {
    const isOpen = useSelector(selectToggleSidebar).isOpen;
    const dispatch = useDispatch();

    return (
        <>
            {isOpen && (
                <>
                    <div
                        onClick={() => dispatch(onClose())}
                        className="fixed inset-0 z-10 bg-surface/10 backdrop-blur-sm"
                    />
                    <aside className="card rounded-none fixed top-12 bottom-0 left-0 z-20 overflow-auto w-72">
                        <div className="h-fit flex flex-col justify-start gap-6">
                            <FilterItems
                                isMobile={isMobile}
                                onClose={() => dispatch(onClose())}
                                onFilterChange={onFilterChange}
                            />
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}

function FilterItems({
    isMobile,
    onClose,
    onFilterChange,
}: {
    isMobile: boolean;
    onClose?: () => void;
    onFilterChange?: (filters: IGetJobsQueryParams) => void;
}) {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [jobType, setJobType] = useState<string>("");
    const [experience, setExperience] = useState<string>("");
    const [minBudget, setMinBudget] = useState<string>("");
    const [maxBudget, setMaxBudget] = useState<string>("");

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAllCategories();
                if (res?.data?.categories) {
                    setCategories(res.data.categories);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleApplyFilters = () => {
        const filters: IGetJobsQueryParams = {};

        if (selectedCategory) filters.category = selectedCategory;
        if (jobType) filters.type = jobType;
        if (experience) filters.experienceLevel = experience;
        if (minBudget) filters.minBudget = Number(minBudget);
        if (maxBudget) filters.maxBudget = Number(maxBudget);

        if (onFilterChange) {
            onFilterChange(filters);
        }

        if (isMobile && onClose) {
            onClose();
        }
    };

    const handleResetFilters = () => {
        setSelectedCategory("");
        setJobType("");
        setExperience("");
        setMinBudget("");
        setMaxBudget("");

        if (onFilterChange) {
            onFilterChange({});
        }
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-on-surface">
                    {!isMobile && <SlidersHorizontal size={20} />}
                    <h2 className="text-headline-md">Filters</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleResetFilters}
                        title="Reset Filters"
                        className="text-on-surface-variant hover:text-primary transition-colors p-1"
                    >
                        <RotateCcw size={16} />
                    </button>
                    {isMobile && (
                        <div
                            onClick={onClose}
                            className="bg-surface-container-highest w-fit p-2 rounded-sm text-on-surface cursor-pointer"
                        >
                            <SlidersHorizontal size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <label className="text-label-md text-on-surface-variant block mb-2">
                    Category
                </label>
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none bg-surface-container-low border border-outline-variant rounded-md px-4 py-2.5 text-body-md text-on-surface pr-10"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                    />
                </div>
            </div>

            {/* Job Type Filter */}
            <div>
                <p className="text-label-md text-on-surface-variant mb-2">
                    Job Type
                </p>
                <div className="flex flex-col gap-2.5">
                    {[
                        { label: "All Types", value: "" },
                        { label: "Fixed Price", value: "fixed" },
                        { label: "Hourly Rate", value: "hourly" },
                    ].map((item) => (
                        <label
                            key={item.value}
                            className="flex items-center gap-2.5 text-body-md text-on-surface cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="jobType"
                                value={item.value}
                                checked={jobType === item.value}
                                onChange={(e) => setJobType(e.target.value)}
                                className="h-4 w-4 accent-primary"
                            />
                            {item.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Experience Level Filter */}
            <div>
                <p className="text-label-md text-on-surface-variant mb-2">
                    Experience Level
                </p>
                <div className="flex flex-col gap-2.5">
                    {[
                        { label: "All Levels", value: "" },
                        { label: "Entry Level", value: "entry" },
                        { label: "Intermediate", value: "intermediate" },
                        { label: "Expert", value: "expert" },
                    ].map((item) => (
                        <label
                            key={item.value}
                            className="flex items-center gap-2.5 text-body-md text-on-surface cursor-pointer capitalize"
                        >
                            <input
                                type="radio"
                                name="experience"
                                value={item.value}
                                checked={experience === item.value}
                                onChange={(e) => setExperience(e.target.value)}
                                className="h-4 w-4 accent-primary"
                            />
                            {item.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Budget Range Filter */}
            <div>
                <p className="text-label-md text-on-surface-variant mb-2">
                    Budget Range ($)
                </p>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant"
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={handleApplyFilters}
                className="bg-primary text-on-primary text-label-md rounded-md py-3 mt-1 hover:opacity-90 transition-opacity font-medium"
            >
                Apply Filters
            </button>

            <div className="bg-inverse-surface text-inverse-on-surface rounded-lg p-5">
                <h3 className="text-headline-md text-[16px]! leading-6!">
                    Weekly Pulse
                </h3>
                <p className="text-body-sm mt-2 opacity-80">
                    Tech jobs increased by 14% this week. Refresh for more.
                </p>
            </div>
        </>
    );
}