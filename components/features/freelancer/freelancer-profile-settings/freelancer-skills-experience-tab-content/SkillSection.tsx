/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SkillProfileModal from '@/components/models/SkillProfileModal';
import EmptyState from '@/components/ui/Emptystate';
import SmallLoading from '@/components/ui/SmallLoading';
import { ICreateProfileSkillDto, IProfileSkill, profileSkillService } from '@/services/profileSkill.service';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';
import { AppDispatch } from '@/store/store';
import { DURATION } from '@/utils/constant.utils';
import { SkillLevel } from '@/utils/enums.utils';
import { Award, Edit2, Plus, Star, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const SKILL_LEVEL_CLASSES: Record<string, string> = {
    [SkillLevel.BEGINNER]: "bg-surface-container-high text-on-surface-variant",
    [SkillLevel.INTERMEDIATE]: "bg-tertiary/20 text-tertiary font-medium",
    [SkillLevel.ADVANCED]: "bg-secondary/15 text-secondary font-medium",
    [SkillLevel.EXPERT]: "bg-primary text-on-primary font-medium",
};

const SKILL_BAR_WIDTH: Record<string, string> = {
    [SkillLevel.BEGINNER]: "25%",
    [SkillLevel.INTERMEDIATE]: "50%",
    [SkillLevel.ADVANCED]: "75%",
    [SkillLevel.EXPERT]: "100%",
};

function SkillSection({ profileId }: { profileId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [skills, setSkills] = useState<IProfileSkill[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [selectedSkill, setSelectedSkill] = useState<IProfileSkill | null>(null)
    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const fetchSkills = useCallback(async () => {
        try {
            setLoading(true);
            const skillRes = await profileSkillService.getProfileSkills({ profileId });
            setSkills(skillRes.data.profileSkills);
        } catch (error: any) {
            handleAddToastification(error?.response?.data?.message || error.message, 'error', DURATION);
        } finally {
            setLoading(false);
        }
    }, [profileId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSkills();
    }, [fetchSkills]);

    const handleCreateSkill = async (payload: ICreateProfileSkillDto) => {
        try {
            await profileSkillService.createProfileSkill(payload);
            handleAddToastification('Skill added successfully', 'success', DURATION);
            setIsOpen(false);
            fetchSkills();
        } catch (error: any) {
            handleAddToastification(error?.response?.data?.message || error.message, 'error', DURATION);
        }
    };

    const handleDeleteSkill = async (id: string) => {
        try {
            await profileSkillService.deleteProfileSkill(id);
            handleAddToastification('Skill removed', 'success', DURATION);
            fetchSkills();
        } catch (error: any) {
            handleAddToastification(error?.response?.data?.message || error.message, 'error', DURATION);
        }
    };


    const handleEditSkill = async (id: string, payload: ICreateProfileSkillDto) => {
        try {
            const profileSkillRes = await profileSkillService.editProfileSkill(id, payload);
            handleAddToastification(profileSkillRes.message || 'skill edited', 'success', DURATION);
            fetchSkills();
        } catch (error: any) {
            handleAddToastification(error?.response?.data?.message || error.message, 'error', DURATION);
        }
    };



    return (
        <>
            <section className="card p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-headline-md font-semibold text-on-surface">
                        <Award size={20} className="text-primary" />
                        Core Skills
                    </span>
                    <button
                        onClick={() => setIsOpen(true)}
                        aria-label="Add Skill"
                        className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Skills List */}
                <div className="flex flex-col gap-4 mt-4">
                    {loading ? (
                        <SmallLoading />
                    ) : skills.length === 0 ? (
                        <EmptyState title="No skills added yet." size="compact" />
                    ) : (
                        skills.map((item) => {
                            // Guard against null/unpopulated references
                            const skillName =
                                typeof item?.skill === "object" && item?.skill !== null
                                    ? item.skill.name
                                    : "Unknown Skill";

                            const level = item?.level || SkillLevel.BEGINNER;
                            const barWidth = SKILL_BAR_WIDTH[level] || "25%";
                            const levelClass =
                                SKILL_LEVEL_CLASSES[level] || SKILL_LEVEL_CLASSES[SkillLevel.BEGINNER];

                            return (
                                <div
                                    key={item._id}
                                    className="group relative border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-body-md font-medium text-on-surface">
                                            {skillName}
                                            {item.isPrimary && (
                                                <Star size={13} className="text-primary fill-primary" />
                                            )}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-label-sm px-2.5 py-0.5 rounded-full ${levelClass}`}
                                            >
                                                {level}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSelectedSkill(item)
                                                    setIsEdit(true)
                                                    setIsOpen(true)
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-primary transition-opacity"
                                                aria-label="edit Skill"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSkill(item._id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error transition-opacity"
                                                aria-label="Delete Skill"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                        </div>
                                    </div>
                                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                                        {item.yearsOfExperience}{" "}
                                        {item.yearsOfExperience === 1 ? "Year" : "Years"} of Experience
                                    </p>
                                    <div className="h-1.5 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{ width: barWidth }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            <SkillProfileModal
                selectedSkill={selectedSkill!}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false)
                    setIsEdit(false)
                }}
                onSubmit={handleCreateSkill}
                onEdit={handleEditSkill}
                profileId={profileId}
            />
        </>
    );
}

export default SkillSection;