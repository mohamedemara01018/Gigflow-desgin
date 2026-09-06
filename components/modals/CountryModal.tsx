"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import {
    ICountry,
    ICreateCountryDto,
    IUpdateCountryDto,
} from "@/services/country.service";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    badge?: string;
}

export const Field: React.FC<FieldProps> = ({ label, badge, ...props }) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-body-sm font-medium text-on-surface">
                    {label}
                </label>
                {badge && (
                    <span className="flex items-center gap-1 text-label-sm text-primary font-medium">
                        <CheckCircle2 size={12} />
                        {badge.toUpperCase()}
                    </span>
                )}
            </div>
            <input
                {...props}
                disabled={!!badge || props.disabled}
                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
            />
        </div>
    );
};

interface CountryModalProps {
    isOpen: boolean;
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    selectedCountry?: ICountry | null;
    onClose: () => void;
    onSubmit: (formData: ICreateCountryDto) => void;
    onEdit: (id: string, formData: IUpdateCountryDto) => void;
}

export default function CountryModal({
    isOpen,
    isEdit,
    setIsEdit,
    selectedCountry,
    onClose,
    onSubmit,
    onEdit,
}: CountryModalProps) {
    const [name, setName] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [dialCode, setDialCode] = useState<string>("");
    const [flagFile, setFlagFile] = useState<File | null>(null);
    const [flagPreview, setFlagPreview] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedCountry) {
                setName(selectedCountry.name || "");
                setCode(selectedCountry.code || "");
                setDialCode(selectedCountry.dialCode || "");

                const initialFlag = selectedCountry.flag?.image || "";
                setFlagPreview(initialFlag);
                setFlagFile(null);
            } else {
                setName("");
                setCode("");
                setDialCode("");
                setFlagFile(null);
                setFlagPreview("");
            }
        }
    }, [isOpen, isEdit, selectedCountry]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (flagPreview && flagPreview.startsWith("blob:")) {
                URL.revokeObjectURL(flagPreview);
            }
            setFlagFile(file);
            setFlagPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && selectedCountry?._id) {
            const payload: IUpdateCountryDto = {
                name: name.trim(),
                code: code.trim().toUpperCase(),
                ...(dialCode && { dialCode: dialCode.trim() }),
                ...(flagFile && { flag: flagFile }),
            };

            onEdit(selectedCountry._id, payload);
            setIsEdit(false);
        } else {
            if (!flagFile) return;

            const payload: ICreateCountryDto = {
                name: name.trim(),
                code: code.trim().toUpperCase(),
                flag: flagFile,
                ...(dialCode && { dialCode: dialCode.trim() }),
                isActive: true
            };

            onSubmit(payload);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card max-w-lg w-full space-y-4 relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit Country" : "Add Country"}
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
                    {/* Country Name */}
                    <Field
                        id="country-name"
                        label="Country Name"
                        type="text"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. United States, Egypt"
                    />

                    {/* ISO Code & Dial Code Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            id="country-code"
                            label="ISO Code"
                            type="text"
                            required
                            minLength={2}
                            maxLength={3}
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="e.g. US, EG"
                            className="uppercase"
                        />

                        <Field
                            id="dial-code"
                            label="Dial Code"
                            type="text"
                            value={dialCode}
                            onChange={(e) => setDialCode(e.target.value)}
                            placeholder="e.g. +1, +20"
                        />
                    </div>

                    {/* Flag Upload Field */}
                    <div>
                        <label className="text-body-sm font-medium text-on-surface block mb-2">
                            Flag Image
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-14 bg-surface-container-low border border-dashed border-outline-variant rounded-md flex items-center justify-center overflow-hidden shrink-0">
                                {flagPreview ? (
                                    <Image
                                        src={flagPreview}
                                        alt="Flag preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <ImageIcon
                                        className="text-on-surface-variant/50"
                                        size={24}
                                    />
                                )}
                            </div>

                            <label
                                htmlFor="flag-upload"
                                className="flex items-center gap-2 cursor-pointer bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-md px-4 py-2.5 rounded-md transition-colors"
                            >
                                <Upload size={16} />
                                {flagPreview ? "Change Image" : "Upload Flag"}
                            </label>
                            <input
                                id="flag-upload"
                                type="file"
                                accept="image/*"
                                required={!isEdit && !flagPreview}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}