"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toastify, IToastificationType } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { profileService, ISocialLinks, IProfile } from "@/services/profile.service";
import {
    certificationService,
    ICertification,
    ICreateCertificationDto,
} from "@/services/certification.service";
import { IUserListItem } from "@/services/user.service";
import CertificationModal from "@/components/modals/CertificationModal";
import { TrendingUp } from "lucide-react";
import { DigitalPresenceSection } from "./freelancer-credentials-tab-content/DigitalPresenceSection";
import { CertificationsSection } from "./freelancer-credentials-tab-content/CertificationsSection";


const INITIAL_SOCIAL_LINKS: ISocialLinks = {
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    portfolio: "",
};

interface CredentialsTabContentProps {
    profile: IProfile;
    me: IUserListItem;
}

export default function CredentialsTabContent({ profile, me }: CredentialsTabContentProps) {
    const dispatch: AppDispatch = useDispatch();
    const [socialLinks, setSocialLinks] = useState<ISocialLinks>(INITIAL_SOCIAL_LINKS);
    const [saving, setSaving] = useState<boolean>(false);

    // Certifications State
    const [certifications, setCertifications] = useState<ICertification[]>([]);
    const [loadingCerts, setLoadingCerts] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedCertification, setSelectedCertification] = useState<ICertification | null>(null);

    const handleToastify = (message: string, type: IToastificationType) => {
        dispatch(toastify({ message, type, duration: DURATION }));
    };

    const isUnchanged =
        socialLinks.facebook === (profile?.socialLinks?.facebook ?? "") &&
        socialLinks.github === (profile?.socialLinks?.github ?? "") &&
        socialLinks.linkedin === (profile?.socialLinks?.linkedin ?? "") &&
        socialLinks.portfolio === (profile?.socialLinks?.portfolio ?? "") &&
        socialLinks.twitter === (profile?.socialLinks?.twitter ?? "") &&
        socialLinks.website === (profile?.socialLinks?.website ?? "");

    // Fetch Certifications
    const fetchCertifications = useCallback(async () => {
        if (!profile?._id) return;
        try {
            setLoadingCerts(true);
            const response = await certificationService.getAllCertifications(profile._id);
            setCertifications(response.data.certifications);
        } catch (error: any) {
            handleToastify(error?.message || "Failed to fetch certifications", "error");
        } finally {
            setLoadingCerts(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?._id]);

    useEffect(() => {
        if (profile?.socialLinks) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSocialLinks({
                website: profile.socialLinks.website || "",
                github: profile.socialLinks.github || "",
                linkedin: profile.socialLinks.linkedin || "",
                twitter: profile.socialLinks.twitter || "",
                facebook: profile.socialLinks.facebook || "",
                portfolio: profile.socialLinks.portfolio || "",
            });
        }
        fetchCertifications();
    }, [profile, fetchCertifications]);

    const handleInputChange = (key: keyof ISocialLinks, value: string) => {
        setSocialLinks((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSaveSocialLinks = async () => {
        if (!profile?._id) {
            handleToastify("Profile ID not found", "error");
            return;
        }

        try {
            setSaving(true);
            await profileService.updateProfile({ socialLinks }, me._id);
            handleToastify("Social links updated successfully", "success");
        } catch (error: any) {
            handleToastify(error?.message || "Failed to update social links", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        if (profile?.socialLinks) {
            setSocialLinks({
                facebook: profile.socialLinks.facebook || "",
                github: profile.socialLinks.github || "",
                linkedin: profile.socialLinks.linkedin || "",
                portfolio: profile.socialLinks.portfolio || "",
                twitter: profile.socialLinks.twitter || "",
                website: profile.socialLinks.website || "",
            });
        }
    };

    // Modal Handlers
    const handleOpenAddModal = () => {
        setIsEdit(false);
        setSelectedCertification(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (cert: ICertification) => {
        setIsEdit(true);
        setSelectedCertification(cert);
        setIsModalOpen(true);
    };

    const handleCreateCertification = async (payload: ICreateCertificationDto) => {
        try {
            await certificationService.createCertification(payload);
            handleToastify("Certification added successfully", "success");
            fetchCertifications();
        } catch (error: any) {
            handleToastify(error?.message || "Failed to add certification", "error");
        }
    };

    const handleEditCertification = async (id: string, payload: ICreateCertificationDto) => {
        try {
            await certificationService.editCertification(id, payload);
            handleToastify("Certification updated successfully", "success");
            fetchCertifications();
        } catch (error: any) {
            handleToastify(error?.message || "Failed to update certification", "error");
        }
    };

    const handleDeleteCertification = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certification?")) return;
        try {
            await certificationService.deleteCertification(id);
            handleToastify("Certification deleted successfully", "success");
            fetchCertifications();
        } catch (error: any) {
            handleToastify(error?.message || "Failed to delete certification", "error");
        }
    };

    return (
        <div className="pt-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface font-semibold">
                        External Links &amp; Credentials
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Manage your digital footprint and verified qualifications.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDiscard}
                        disabled={saving || isUnchanged}
                        className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={handleSaveSocialLinks}
                        disabled={saving || isUnchanged}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
                <div className="flex flex-col gap-6">
                    <DigitalPresenceSection
                        socialLinks={socialLinks}
                        onInputChange={handleInputChange}
                    />

                    <section className="bg-primary text-on-primary rounded-lg p-5 flex items-center justify-between shadow-sm">
                        <div>
                            <span className="text-label-sm uppercase tracking-wide opacity-90">
                                Profile Strength
                            </span>
                            <p className="text-display-lg text-[36px]! leading-none! font-bold mt-1">
                                92%
                            </p>
                        </div>
                        <span className="w-14 h-14 rounded-full border-2 border-on-primary/40 flex items-center justify-center">
                            <TrendingUp size={22} />
                        </span>
                    </section>
                </div>

                <CertificationsSection
                    certifications={certifications}
                    loadingCerts={loadingCerts}
                    onOpenAddModal={handleOpenAddModal}
                    onOpenEditModal={handleOpenEditModal}
                    onDeleteCertification={handleDeleteCertification}
                />
            </div>

            <CertificationModal
                isOpen={isModalOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedCertification={selectedCertification}
                profileId={profile?._id}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCertification}
                onEdit={handleEditCertification}
            />
        </div>
    );
}