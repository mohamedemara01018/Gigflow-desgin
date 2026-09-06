"use client";

import { useState } from "react";
import { Globe, Search, Plus, Edit2, Trash2, AlertTriangle, X } from "lucide-react";
import Image from "next/image";
import { ICountry, ICreateCountryDto, IUpdateCountryDto } from "@/services/country.service";
import CountryModal from "@/components/modals/CountryModal";
import SmallLoading from "@/components/ui/SmallLoading";
import EmptyState from "@/components/ui/Emptystate";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    tone?: "danger" | "default";
    confirmingCount?: number;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    tone = "danger",
    confirmingCount,
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <button
                aria-label="Close dialog"
                onClick={onCancel}
                className="absolute inset-0 bg-inverse-surface/40"
            />

            <div className="relative bg-surface-container-high rounded-lg shadow-(--shadow-level-3) w-full max-w-110 p-6">
                <button
                    onClick={onCancel}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    <X size={18} />
                </button>

                <span
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${tone === "danger"
                        ? "bg-error-container text-on-error-container"
                        : "bg-primary/10 text-primary"
                        }`}
                >
                    <AlertTriangle size={22} />
                </span>

                <h2 className="text-headline-md text-on-surface mt-4">{title}</h2>
                <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
                    {description}
                    {confirmingCount && confirmingCount > 1 && (
                        <span className="block mt-1 font-medium text-on-surface">
                            This will affect {confirmingCount} selected users.
                        </span>
                    )}
                </p>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="text-label-md text-on-surface border border-outline-variant rounded-md px-5 py-2.5 hover:bg-surface-container-low transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`text-label-md rounded-md px-5 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-60 ${tone === "danger"
                            ? "bg-error text-on-error"
                            : "bg-primary text-on-primary"
                            }`}
                    >
                        {isLoading ? "Please wait…" : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface CountriesPanelProps {
    countries: ICountry[];
    selectedId?: string | null;
    query: string;
    onQueryChange: (query: string) => void;
    onSelect: (country: ICountry) => void;
    onToggleEnabled: (idOrCode: string) => void;
    onSubmitCountry: (formData: ICreateCountryDto) => void;
    onEditCountry: (id: string, formData: IUpdateCountryDto) => void;
    onDeleteCountry: (id: string) => void;
    isLoadingCountries: boolean
    totalCount: number;
}

export default function CountriesPanel({
    countries,
    selectedId,
    query,
    onQueryChange,
    onSelect,
    onToggleEnabled,
    onSubmitCountry,
    onEditCountry,
    onDeleteCountry,
    isLoadingCountries,
    totalCount,
}: CountriesPanelProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

    // State for tracking country pending deletion
    const [countryToDelete, setCountryToDelete] = useState<ICountry | null>(null);

    const handleOpenAdd = () => {
        setIsEdit(false);
        setSelectedCountry(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (e: React.MouseEvent, country: ICountry) => {
        e.stopPropagation();
        setIsEdit(true);

        const flagImage = country.flag?.image;
        const flagPublicId = country.flag?.publicId;

        setSelectedCountry({
            _id: country._id,
            name: country.name,
            code: country.code,
            dialCode: country.dialCode,
            flag: { image: flagImage, publicId: flagPublicId },
            isActive: country.isActive,
        } as ICountry);

        setIsModalOpen(true);
    };

    const handleRequestDelete = (e: React.MouseEvent, country: ICountry) => {
        e.stopPropagation();
        setCountryToDelete(country);
    };

    const handleConfirmDelete = () => {
        if (countryToDelete && onDeleteCountry) {
            onDeleteCountry(countryToDelete._id);
        }
        setCountryToDelete(null);
    };

    return (
        <section className="card p-0! overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-4">
                <span className="flex items-center gap-2 text-headline-md text-on-surface">
                    <Globe size={20} className="text-primary" />
                    Countries
                    <span className="text-label-md bg-secondary/15 text-secondary px-2.5 py-1 rounded-full">
                        {totalCount}
                    </span>
                </span>
                <button
                    onClick={handleOpenAdd}
                    aria-label="Add country"
                    className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="px-5 pb-4">
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search by name, code or dial..."
                        className="w-full bg-surface-container-low rounded-md pl-9 pr-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
            </div>

            {/* Country List */}
            <div className="flex flex-col divide-y divide-outline-variant border-t border-outline-variant overflow-y-auto max-h-150">
                {isLoadingCountries ?
                    <SmallLoading />
                    : countries.length === 0 ? (
                        <EmptyState title="No countries found." size="compact" />
                    ) : (
                        countries.map((country) => {
                            const isSelected = country._id === selectedId || country.code === selectedId;
                            const flagUrl = typeof country.flag === "string" ? country.flag : country.flag?.image;
                            const isImageUrl = flagUrl?.startsWith("http") || flagUrl?.startsWith("blob:");

                            return (
                                <button
                                    key={country._id}
                                    onClick={() => onSelect(country)}
                                    className={`flex items-center justify-between px-5 py-3.5 text-left transition-colors ${isSelected
                                        ? "bg-primary text-on-primary"
                                        : "hover:bg-surface-container-low text-on-surface"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isImageUrl ? (
                                            <div className="relative w-7 h-5 overflow-hidden rounded-sm shrink-0 bg-surface-container-high">
                                                <Image
                                                    src={flagUrl}
                                                    alt={`${country.name} flag`}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-2xl leading-none shrink-0">
                                                {flagUrl || "🌐"}
                                            </span>
                                        )}

                                        <div>
                                            <p className="text-body-md font-medium">{country.name}</p>
                                            <p
                                                className={`text-body-sm ${isSelected ? "opacity-80" : "text-on-surface-variant"
                                                    }`}
                                            >
                                                {country.dialCode || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => handleOpenEdit(e, country)}
                                            className={`p-1.5 rounded-full transition-colors ${isSelected
                                                ? "hover:bg-on-primary/20 text-on-primary"
                                                : "hover:bg-surface-container-high text-on-surface-variant"
                                                }`}
                                            title="Edit Country"
                                        >
                                            <Edit2 size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => handleRequestDelete(e, country)}
                                            className={`p-1.5 rounded-full transition-colors ${isSelected
                                                ? "hover:bg-error-container/30 text-error-container"
                                                : "hover:bg-error-container/20 text-error"
                                                }`}
                                            title="Delete Country"
                                        >
                                            <Trash2 size={15} />
                                        </button>

                                        <span
                                            className={`text-label-sm font-semibold ml-1 ${isSelected ? "opacity-90" : "text-on-surface-variant"
                                                }`}
                                        >
                                            {country.code}
                                        </span>

                                        {/* Enable/Disable Toggle */}
                                        <span
                                            role="switch"
                                            aria-checked={country.isActive}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleEnabled(country._id);
                                            }}
                                            className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${country.isActive
                                                ? isSelected
                                                    ? "bg-on-primary/30"
                                                    : "bg-primary"
                                                : "bg-surface-container-high"
                                                } ${country.isActive ? "justify-end" : "justify-start"}`}
                                        >
                                            <span className="w-4 h-4 rounded-full bg-surface-container-lowest shadow-(--shadow-level-2)" />
                                        </span>
                                    </div>
                                </button>
                            );
                        })
                    )}
            </div>

            {/* Country Form Modal */}
            <CountryModal
                isOpen={isModalOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedCountry={selectedCountry}
                onClose={() => setIsModalOpen(false)}
                onSubmit={onSubmitCountry}
                onEdit={onEditCountry}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={Boolean(countryToDelete)}
                title="Delete Country"
                description={`Are you sure you want to delete "${countryToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                tone="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => setCountryToDelete(null)}
            />
        </section>
    );
}