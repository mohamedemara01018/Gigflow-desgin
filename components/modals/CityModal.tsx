/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ICity, ICreateCityDto, IUpdateCityDto } from "@/services/city.service";

interface CityModalProps {
    isOpen: boolean;
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    selectedCity?: ICity | null;
    countryId: string;
    onClose: () => void;
    onSubmit: (payload: ICreateCityDto) => void;
    onEdit: (id: string, payload: IUpdateCityDto) => void;
}

export default function CityModal({
    isOpen,
    isEdit,
    setIsEdit,
    selectedCity,
    countryId,
    onClose,
    onSubmit,
    onEdit,
}: CityModalProps) {
    const [name, setName] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedCity) {
                setName(selectedCity.name || "");
            } else {
                setName("");
            }
        }
    }, [isOpen, isEdit, selectedCity]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && selectedCity?._id) {
            const payload: IUpdateCityDto = {
                name: name.trim(),
            };
            onEdit(selectedCity._id, payload);
            setIsEdit(false);
        } else {
            const payload: ICreateCityDto = {
                country: countryId,
                name: name.trim(),
            };
            onSubmit(payload);
            setName("");
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! space-y-4 relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit City" : "Add City"}
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
                    {/* City Name Input */}
                    <div className="w-full">
                        <label
                            htmlFor="city-name"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            City Name
                        </label>
                        <input
                            id="city-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Cairo, Alexandria, Giza"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
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
                            disabled={!name.trim()}
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