"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import SelectField, { Option } from "../ui/SelectFeild";
import { ICreateLanguageDto, ILanguage } from "@/services/language.service";
import { LanguageLevel } from "@/utils/enums.utils";

interface LanguageModalProps {
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    selectedLanguage?: ILanguage | null;
    isOpen: boolean;
    profileId: string;
    onClose: () => void;
    onSubmit: (payload: ICreateLanguageDto) => void;
    onEdit: (id: string, payload: ICreateLanguageDto) => void;
}

const LEVEL_OPTIONS: Option[] = Object.values(LanguageLevel).map((lvl) => ({
    value: lvl,
    label: lvl.charAt(0).toUpperCase() + lvl.slice(1).toLowerCase(),
}));

export default function LanguageModal({
    selectedLanguage,
    isEdit,
    setIsEdit,
    isOpen,
    profileId,
    onClose,
    onSubmit,
    onEdit,
}: LanguageModalProps) {
    const [name, setName] = useState<string>("");
    const [level, setLevel] = useState<LanguageLevel>(LanguageLevel.BASIC);

    // Sync modal state whenever opening or switching between create/edit modes
    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedLanguage) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setName(selectedLanguage.name || "");
                setLevel((selectedLanguage.level as LanguageLevel) || LanguageLevel.BASIC);
            } else {
                // Reset form fields for create mode
                setName("");
                setLevel(LanguageLevel.BASIC);
            }
        }
    }, [isOpen, isEdit, selectedLanguage]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: ICreateLanguageDto = {
            profile: profileId,
            name,
            level,
        };

        if (isEdit && selectedLanguage?._id) {
            onEdit(selectedLanguage._id, payload);
            setIsEdit(false);
        } else {
            onSubmit(payload);
            setName("");
            setLevel(LanguageLevel.BASIC);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! space-y-4 relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit Language" : "Add Language"}
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
                    {/* Language Name Input */}
                    <div className="w-full">
                        <label
                            htmlFor="language-name"
                            className="text-body-sm font-medium text-on-surface block mb-2"
                        >
                            Language Name
                        </label>
                        <input
                            id="language-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. English, Arabic, German"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                        />
                    </div>

                    {/* Level Enum Dropdown */}
                    <div className="w-full">
                        <SelectField
                            id="level-select"
                            label="Proficiency Level"
                            name="level"
                            value={level}
                            onChange={(_name, value) => setLevel(value as LanguageLevel)}
                            options={LEVEL_OPTIONS}
                            placeholder="Select proficiency level..."
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