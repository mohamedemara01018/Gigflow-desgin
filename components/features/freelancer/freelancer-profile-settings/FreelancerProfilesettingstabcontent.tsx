"use client";

import { FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IProfile, profileService } from "@/services/profile.service";
import { AvailabilityStatus, ExperienceLevel, ProfileVisibility } from "@/utils/enums.utils";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { DURATION } from "@/utils/constant.utils";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { BasicInfoSection } from "./freelancer-profile-settings-tap-content/BasicInfoSection";
import { RatesAndExperienceSection } from "./freelancer-profile-settings-tap-content/RatesAndExperienceSection";
import { ProfileStrengthCard } from "./freelancer-profile-settings-tap-content/ProfileStrengthCard";
import { VisibilityAndStatusCard } from "./freelancer-profile-settings-tap-content/VisibilityAndStatusCard";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/core";

interface ProfileSettingsTabContentProps {
    profile?: IProfile;
    onProfileUpdated?: (updatedProfile: IProfile) => void;
}

export default function ProfileSettingsTabContent({
    profile,
    onProfileUpdated,
}: ProfileSettingsTabContentProps) {
    const { me } = useSelector(selectMeSlice);
    const [title, setTitle] = useState(profile?.title ?? "");
    const [bio, setBio] = useState(profile?.bio ?? "");

    // Store HTML string in state for comparison and payload, track TipTap instance separately
    const [overviewHtml, setOverviewHtml] = useState<string>(profile?.overview ?? "");
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

    const [hourlyRate, setHourlyRate] = useState<number | "">(profile?.hourlyRate ?? 0);
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
        profile?.experienceLevel ?? ExperienceLevel.EXPERT
    );
    const [visibility, setVisibility] = useState<ProfileVisibility>(
        profile?.visibility ?? ProfileVisibility.PUBLIC
    );
    const [availability, setAvailability] = useState<AvailabilityStatus>(
        profile?.availability ?? AvailabilityStatus.AVAILABLE
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    useEffect(() => {
        if (profile) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(profile.title ?? "");
            setBio(profile.bio ?? "");
            const initialOverview = profile.overview ?? "";
            setOverviewHtml(initialOverview);
            if (editorInstance) {
                editorInstance.commands.setContent(initialOverview);
            }
            setHourlyRate(profile.hourlyRate ?? 0);
            setExperienceLevel(profile.experienceLevel ?? ExperienceLevel.EXPERT);
            setVisibility(profile.visibility ?? ProfileVisibility.PUBLIC);
            setAvailability(profile.availability ?? AvailabilityStatus.AVAILABLE);
        }
    }, [profile, editorInstance]);

    // Handle initial dynamic editor callback setup
    const handleEditorReady = (editor: Editor) => {
        setEditorInstance(editor);
        setOverviewHtml(editor.getHTML());

        editor.on("update", () => {
            setOverviewHtml(editor.getHTML());
        });
    };

    const isUnchanged =
        title === (profile?.title ?? "") &&
        bio === (profile?.bio ?? "") &&
        overviewHtml === (profile?.overview ?? "") &&
        hourlyRate === (profile?.hourlyRate ?? 0) &&
        experienceLevel === (profile?.experienceLevel ?? ExperienceLevel.EXPERT) &&
        visibility === (profile?.visibility ?? ProfileVisibility.PUBLIC) &&
        availability === (profile?.availability ?? AvailabilityStatus.AVAILABLE);

    const handleDiscard = () => {
        const resetOverview = profile?.overview ?? "";
        setTitle(profile?.title ?? "");
        setBio(profile?.bio ?? "");
        setOverviewHtml(resetOverview);
        if (editorInstance) {
            editorInstance.commands.setContent(resetOverview);
        }
        setHourlyRate(profile?.hourlyRate ?? 0);
        setExperienceLevel(profile?.experienceLevel ?? ExperienceLevel.EXPERT);
        setVisibility(profile?.visibility ?? ProfileVisibility.PUBLIC);
        setAvailability(profile?.availability ?? AvailabilityStatus.AVAILABLE);
    };

    const handleSave = async () => {
        if (!me?._id) return;
        setIsSubmitting(true);
        try {
            const finalOverview = editorInstance ? editorInstance.getHTML() : overviewHtml;

            const response = await profileService.updateProfile(
                {
                    title,
                    bio,
                    overview: finalOverview,
                    hourlyRate: hourlyRate === "" ? 0 : Number(hourlyRate),
                    experienceLevel,
                    visibility,
                    availability,
                },
                me._id
            );

            handleAddToastification("Profile updated successfully!", "success", DURATION);

            if (onProfileUpdated && response.data?.profile) {
                onProfileUpdated(response.data.profile);
            }
        } catch (err: unknown) {
            const error = err as Error;
            const message = error.message || "Something went wrong while saving changes.";
            handleAddToastification(message, "error", DURATION);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">Profile Settings</h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Manage your professional presence and availability.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleDiscard}
                        disabled={isSubmitting || isUnchanged}
                        className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSubmitting || isUnchanged}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                        {isSubmitting ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <BasicInfoSection
                        title={title}
                        bio={bio}
                        onTitleChange={setTitle}
                        onBioChange={setBio}
                    />

                    {/* Professional Overview */}
                    <section className="card">
                        <span className="flex items-center gap-2 text-headline-md text-on-surface">
                            <span className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                                <FileText size={16} />
                            </span>
                            Professional Overview
                        </span>
                        <div className="mt-5">
                            <label className="text-body-sm font-medium text-on-surface block mb-2">
                                Detailed Overview
                            </label>
                            <SimpleEditor
                                maxWidth="37vw"
                                tabletWidth='83vw'
                                isEdit={true}
                                content={profile?.overview ?? ""}
                                onEditReady={handleEditorReady}
                            />
                        </div>
                    </section>
                </div>

                <aside className="flex flex-col gap-6">
                    <VisibilityAndStatusCard
                        visibility={visibility}
                        availability={availability}
                        onVisibilityChange={setVisibility}
                        onAvailabilityChange={setAvailability}
                    />
                    <RatesAndExperienceSection
                        hourlyRate={hourlyRate}
                        experienceLevel={experienceLevel}
                        onHourlyRateChange={setHourlyRate}
                        onExperienceLevelChange={setExperienceLevel}
                    />
                </aside>
            </div>
        </div>
    );
}