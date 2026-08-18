"use client";

import CredentialsTabContent from "@/components/features/freelancer/freelancer-profile-settings/Credentialstabcontent";
import PortfolioTabContent from "@/components/features/freelancer/freelancer-profile-settings/Portfoliotabcontent";
import ProfileSettingsTabContent from "@/components/features/freelancer/freelancer-profile-settings/FreelancerProfilesettingstabcontent";
import ProfileTopNav, { ProfileTabId } from "@/components/features/freelancer/freelancer-profile-settings/ProfileTopNav";
import SkillsExperienceTabContent from "@/components/features/freelancer/freelancer-profile-settings/Skillsexperiencetabcontent";
import SettingLayout from "@/components/layout/public/SettingLayout";
import Loading from "@/components/ui/Loading";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import { fetchUserProfileById, selectUserProfileSlice } from "@/store/slices/profile/getUserProfileSlice";
import { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProfilePageContent() {
    const [activeTab, setActiveTab] = useState<ProfileTabId>("settings");

    const dispatch: AppDispatch = useDispatch();
    const { me } = useSelector(selectMeSlice);
    const { profile, isLoading } = useSelector(selectUserProfileSlice);

    useEffect(() => {
        if (me?._id) {
            dispatch(fetchUserProfileById(me._id));
        }
    }, [dispatch, me?._id]);

    if (isLoading || !profile) {
        return <Loading />;
    }

    return (
        <SettingLayout>
            <div>
                <ProfileTopNav activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === "settings" && <ProfileSettingsTabContent profile={profile} />}
                {activeTab === "skills" && <SkillsExperienceTabContent />}
                {activeTab === "portfolio" && <PortfolioTabContent />}
                {activeTab === "credentials" && <CredentialsTabContent />}
            </div>
        </SettingLayout>
    );
}