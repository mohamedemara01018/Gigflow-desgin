/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import EmptyState from "@/components/ui/Emptystate";
import {
    MapPin,
    Search,
    Filter,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    Building2,
    AlertTriangle,
    X,
} from "lucide-react";
import { ICity, ICreateCityDto, IUpdateCityDto } from "@/services/city.service";
import CityModal from "@/components/modals/CityModal";
import { ICountry } from "@/services/country.service";
import SmallLoading from "@/components/ui/SmallLoading";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    tone?: "danger" | "default";
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

interface CountryDetailPanelProps {
    country: ICountry;
    cities: ICity[];
    citySearch: string;
    onCitySearchChange: (query: string) => void;
    onAddCity?: () => void;
    onSubmitCity?: (payload: ICreateCityDto) => Promise<void>;
    onEditCity?: (id: string, payload: IUpdateCityDto) => Promise<void>;
    onDeleteCity?: (id: string) => Promise<void>;
    page: number;
    totalPages: number;
    totalCities: number;
    onPageChange: (page: number) => void;
    isLoadingCities: boolean
}

export default function CountryDetailPanel({
    country,
    cities,
    citySearch,
    onCitySearchChange,
    onAddCity,
    onSubmitCity,
    onEditCity,
    onDeleteCity,
    page,
    totalPages,
    totalCities,
    onPageChange,
    isLoadingCities
}: CountryDetailPanelProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

    // State for tracking city pending deletion
    const [cityToDelete, setCityToDelete] = useState<ICity | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const activeCountry = country || cities[0]?.country || null;

    const pageSize = 10;
    const startItem = totalCities === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, totalCities);

    const handleOpenCreateModal = () => {
        setIsEdit(false);
        setSelectedCity(null);
        setIsModalOpen(true);
        if (onAddCity) onAddCity();
    };

    const handleOpenEditModal = (city: ICity) => {
        setIsEdit(true);
        setSelectedCity(city);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCity(null);
        setIsEdit(false);
    };

    const handleSubmit = async (payload: ICreateCityDto) => {
        if (onSubmitCity) {
            await onSubmitCity(payload);
        }
    };

    const handleEdit = async (id: string, payload: IUpdateCityDto) => {
        if (onEditCity) {
            await onEditCity(id, payload);
        }
    };

    const handleRequestDelete = (city: ICity) => {
        setCityToDelete(city);
    };

    const handleConfirmDelete = async () => {
        if (cityToDelete && onDeleteCity) {
            try {
                setIsDeleting(true);
                await onDeleteCity(cityToDelete._id);
            } finally {
                setIsDeleting(false);
                setCityToDelete(null);
            }
        }
    };

    return (
        <section className="card p-0! overflow-hidden relative border border-outline-variant rounded-xl bg-surface">
            {/* Hero Section */}
            <div className="relative bg-surface-container-low px-6 py-6 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-4 relative">
                    <div className="flex items-center gap-4">
                        {activeCountry?.flag ? (
                            <div className="relative w-14 h-10 overflow-hidden rounded-md shrink-0 bg-surface-container-high shadow-sm">
                                <img
                                    src={String(activeCountry.flag.image)}
                                    alt={`${activeCountry.name} flag`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ) : (
                            <span className="text-5xl leading-none shrink-0" role="img" aria-label="Globe">
                                🌐
                            </span>
                        )}

                        <div>
                            <h2 className="text-headline-lg font-bold text-on-surface">
                                {activeCountry?.name || "Country Details"}
                            </h2>
                            <div className="flex items-center gap-3 mt-2">
                                {activeCountry?.code && (
                                    <span className="text-label-md bg-surface-container-high text-on-surface px-3 py-1 rounded-md border border-outline-variant">
                                        {activeCountry.code}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                                    <Building2 size={15} />
                                    {totalCities} {totalCities === 1 ? "City" : "Cities"} Total
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity"
                    >
                        <MapPin size={16} />
                        Add City
                    </button>
                </div>
            </div>

            {/* Search & Action Toolbar */}
            <div className="flex items-center gap-3 px-6 py-4">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                        type="text"
                        value={citySearch}
                        onChange={(e) => onCitySearchChange(e.target.value)}
                        placeholder={`Search cities in ${activeCountry?.name || "selected country"}...`}
                        className="w-full bg-surface-container-low rounded-md pl-9 pr-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant"
                    />
                </div>
                <button
                    aria-label="Filter cities"
                    className="w-10 h-10 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                    <Filter size={16} />
                </button>
                <button
                    aria-label="Sort cities"
                    className="w-10 h-10 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                    <ArrowUpDown size={16} />
                </button>
            </div>

            {/* Cities Table */}
            <div className="overflow-x-auto border-t border-outline-variant">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant bg-surface-container-low/50">
                            <th className="px-6 py-3 text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">
                                City Name
                            </th>
                            <th className="px-6 py-3 text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">
                                Country
                            </th>
                            <th className="px-6 py-3 text-label-sm uppercase tracking-wide text-on-surface-variant text-right font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {isLoadingCities ?
                            <tr>
                                <td colSpan={3} className="py-8">
                                    <SmallLoading />
                                </td>
                            </tr>
                            : cities.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8">
                                        <EmptyState
                                            size="compact"
                                            title="No cities match your search."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                cities.map((city) => (
                                    <tr
                                        key={city._id}
                                        className="hover:bg-surface-container-low transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-2 h-2 rounded-full shrink-0 bg-primary" />
                                                <span className="text-body-md font-semibold text-on-surface">
                                                    {city.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-body-md text-on-surface-variant">
                                            {city.country?.name || activeCountry?.name || "—"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(city)}
                                                    aria-label="Edit city"
                                                    className="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleRequestDelete(city)}
                                                    aria-label="Delete city"
                                                    className="p-1.5 rounded-md hover:bg-error-container text-error transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant bg-surface-container-low/30">
                    <p className="text-body-sm text-on-surface-variant">
                        Showing <span className="font-semibold text-on-surface">{startItem}</span> to{" "}
                        <span className="font-semibold text-on-surface">{endItem}</span> of{" "}
                        <span className="font-semibold text-on-surface">{totalCities}</span> cities
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="p-2 rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-label-md text-on-surface px-2">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="p-2 rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                            aria-label="Next page"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* City Modal Component */}
            <CityModal
                isOpen={isModalOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedCity={selectedCity}
                countryId={activeCountry?._id || ""}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onEdit={handleEdit}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={Boolean(cityToDelete)}
                title="Delete City"
                description={`Are you sure you want to delete "${cityToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                tone="danger"
                isLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setCityToDelete(null)}
            />
        </section>
    );
}