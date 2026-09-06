"use client";

import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import SelectField, { Option } from "../ui/SelectFeild";
import { ICreateProfileSkillDto, IProfileSkill } from "@/services/profileSkill.service";
import { skillService } from "@/services/skill.service";
import { SkillLevel } from "@/utils/enums.utils";

interface SkillModalProps {
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    selectedSkill?: IProfileSkill | null;
    isOpen: boolean;
    profileId: string;
    onClose: () => void;
    onSubmit: (payload: ICreateProfileSkillDto) => void;
    onEdit: (id: string, payload: ICreateProfileSkillDto) => void;
}

const LEVEL_OPTIONS: Option[] = [
    { value: SkillLevel.BEGINNER, label: "Beginner" },
    { value: SkillLevel.INTERMEDIATE, label: "Intermediate" },
    { value: SkillLevel.ADVANCED, label: "Advanced" },
    { value: SkillLevel.EXPERT, label: "Expert" },
];

export default function SkillProfileModal({
    selectedSkill,
    isEdit,
    setIsEdit,
    isOpen,
    profileId,
    onClose,
    onSubmit,
    onEdit,
}: SkillModalProps) {
    const [skillOptions, setSkillOptions] = useState<Option[]>([]);
    const [isLoadingSkills, setIsLoadingSkills] = useState<boolean>(false);

    const [skill, setSkill] = useState<string>("");
    const [level, setLevel] = useState<SkillLevel>(SkillLevel.INTERMEDIATE);
    const [yearsOfExperience, setYearsOfExperience] = useState<number>(1);
    const [isPrimary, setIsPrimary] = useState<boolean>(false);

    // 1. Fetch available skills when the modal opens
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;

        const fetchSkills = async () => {
            setIsLoadingSkills(true);
            try {
                const response = await skillService.getAllSkills();
                if (isMounted) {
                    const fetchedSkills = response.data.skills.map((s) => ({
                        value: s._id,
                        label: s.name,
                    }));
                    setSkillOptions(fetchedSkills);

                    // Set default skill if none selected yet
                    if (!selectedSkill && fetchedSkills.length > 0) {
                        setSkill(fetchedSkills[0].value);
                    }
                }
            } catch (err) {
                console.error("Failed to load skills:", err);
            } finally {
                if (isMounted) {
                    setIsLoadingSkills(false);
                }
            }
        };

        fetchSkills();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // 2. Sync state for edit vs create mode
    useEffect(() => {
        if (isOpen) {
            if (isEdit && selectedSkill) {
                const skillId =
                    typeof selectedSkill.skill === "object" && selectedSkill.skill !== null
                        ? (selectedSkill.skill as { _id: string })._id
                        : (selectedSkill.skill as string);

                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSkill(skillId || "");
                setLevel(selectedSkill.level || SkillLevel.INTERMEDIATE);
                setYearsOfExperience(selectedSkill.yearsOfExperience ?? 1);
                setIsPrimary(!!selectedSkill.isPrimary);
            } else if (!isEdit) {
                setSkill(skillOptions[0]?.value || "");
                setLevel(SkillLevel.INTERMEDIATE);
                setYearsOfExperience(1);
                setIsPrimary(false);
            }
        }
    }, [isOpen, isEdit, selectedSkill, skillOptions]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!skill) return;

        const payload: ICreateProfileSkillDto = {
            profile: profileId,
            skill,
            level,
            yearsOfExperience,
            isPrimary,
        };

        if (isEdit && selectedSkill?._id) {
            onEdit(selectedSkill._id, payload);
            setIsEdit(false);
        } else {
            onSubmit(payload);
            setSkill(skillOptions[0]?.value || "");
            setLevel(SkillLevel.INTERMEDIATE);
            setYearsOfExperience(1);
            setIsPrimary(false);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="card min-w-100! space-y-4 relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h3 className="text-title-medium font-semibold text-on-surface">
                        {isEdit ? "Edit Skill" : "Add Skill"}
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
                    {/* Dynamic Skill Selector */}
                    <div className="relative">
                        <SelectField
                            id="skill-select"
                            label="Skill"
                            name="skill"
                            value={skill}
                            onChange={(_name, value) => setSkill(value)}
                            options={skillOptions}
                            placeholder={
                                isLoadingSkills
                                    ? "Loading skills..."
                                    : skillOptions.length === 0
                                        ? "No skills available"
                                        : "Select skill..."
                            }
                            disabled={isLoadingSkills || skillOptions.length === 0}
                        />
                        {isLoadingSkills && (
                            <div className="absolute right-3 top-9 flex items-center">
                                <Loader2 size={16} className="animate-spin text-primary" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 items-start">
                        {/* Level Selector */}
                        <div className="w-full">
                            <SelectField
                                id="level-select"
                                label="Level"
                                name="level"
                                value={level}
                                onChange={(_name, value) => setLevel(value as SkillLevel)}
                                options={LEVEL_OPTIONS}
                                placeholder="Select level..."
                            />
                        </div>

                        {/* Years of Experience */}
                        <div className="w-full">
                            <label
                                htmlFor="yearsOfExperience"
                                className="text-body-sm font-medium text-on-surface block mb-2"
                            >
                                Years of Experience
                            </label>
                            <input
                                id="yearsOfExperience"
                                min={0}
                                max={50}
                                value={yearsOfExperience}
                                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                                placeholder="Experience"
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                                type="number"
                            />
                        </div>
                    </div>

                    {/* Primary Skill Checkbox */}
                    <div className="flex items-center justify-start gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="isPrimary"
                            checked={isPrimary}
                            onChange={(e) => setIsPrimary(e.target.checked)}
                            className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary cursor-pointer"
                        />
                        <label
                            htmlFor="isPrimary"
                            className="text-body-sm font-medium text-on-surface cursor-pointer select-none"
                        >
                            Is Primary Skill
                        </label>
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
                            disabled={isLoadingSkills || !skill}
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