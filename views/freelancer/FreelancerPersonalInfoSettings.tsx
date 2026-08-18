/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { fetchMe, selectMeSlice } from '@/store/slices/auth/authSlice';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';
import { DURATION } from '@/utils/constant.utils';
import { userService } from '@/services/user.service';
import PersonalInformationSection from '@/components/features/freelancer/freelancer-personal-info-settings/PersonalInformationSection';
import SettingLayout from '@/components/layout/public/SettingLayout';

export default function FreelancerPersonalInfoSettings() {
    const { me } = useSelector(selectMeSlice);
    const dispatch: AppDispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        firstName: me?.firstName || '',
        lastName: me?.lastName || '',
        phone: me?.phone || '',
        country: me?.country || '',
        city: me?.city || ''
    });

    // Sync form state when `me` updates from Redux store
    useEffect(() => {
        if (me) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPersonalInfo({
                firstName: me.firstName || '',
                lastName: me.lastName || '',
                phone: me.phone || '',
                country: me.country || '',
                city: me.city || ''
            });
        }
    }, [me]);

    // Check if current form values match original Redux user data
    const isUnchanged = useMemo(() => {
        return (
            personalInfo.firstName === (me?.firstName || '') &&
            personalInfo.lastName === (me?.lastName || '') &&
            personalInfo.phone === (me?.phone || '') &&
            personalInfo.country === (me?.country || '') &&
            personalInfo.city === (me?.city || '')
        );
    }, [personalInfo, me]);

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateUser = async () => {
        try {
            setLoading(true);
            const res = await userService.updateUser(personalInfo);
            handleAddToastification(res.message || "Profile updated successfully", "success", DURATION);
            dispatch(fetchMe());
        } catch (error: any) {
            handleAddToastification(error?.message || "Failed to update profile", "error", DURATION);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (file: File) => {
        try {
            setChangeLoading(true);
            const res = await userService.changeAvatar(file);
            handleAddToastification(res.message || "Avatar updated successfully", "success", DURATION);
            dispatch(fetchMe());
        } catch (error: any) {
            handleAddToastification(error?.message || "Failed to update avatar", "error", DURATION);
        } finally {
            setChangeLoading(false);
        }
    };

    const handleAvatarRemove = async () => {
        try {
            setRemoveLoading(true);
            const res = await userService.removeAvatar();
            handleAddToastification(res.message || "Avatar removed successfully", "success", DURATION);
            dispatch(fetchMe());
        } catch (error: any) {
            handleAddToastification(error?.message || "Failed to remove avatar", "error", DURATION);
        } finally {
            setRemoveLoading(false);
        }
    };

    const handleCancel = () => {
        if (me) {
            setPersonalInfo({
                firstName: me.firstName || '',
                lastName: me.lastName || '',
                phone: me.phone || '',
                country: me.country || '',
                city: me.city || ''
            });
        }
    };

    const isAnyLoading = loading || changeLoading || removeLoading;

    return (
        <SettingLayout
            title="Personal Info Settings"
            desc="Manage your personal information."
            onSaveChange={updateUser}
            onCancelChange={handleCancel}
            isAnyLoading={isAnyLoading}
            isUnchanged={isUnchanged}
            loading={loading}
        >
            <PersonalInformationSection
                me={me}
                personalInfo={personalInfo}
                onFieldChange={handlePersonalInfoChange}
                onAvatarChange={handleAvatarChange}
                onAvatarRemove={handleAvatarRemove}
                changeLoading={changeLoading}
                removeLoading={removeLoading}
            />
        </SettingLayout>
    );
}