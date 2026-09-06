/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { fetchMe, selectMeSlice } from '@/store/slices/auth/authSlice';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';
import { DURATION } from '@/utils/constant.utils';
import { userService } from '@/services/user.service';
import { countryService, ICountry } from '@/services/country.service';
import { cityService, ICity } from '@/services/city.service';
import PersonalInformationSection from '@/components/features/freelancer/freelancer-personal-info-settings/PersonalInformationSection';
import SettingLayout from '@/components/layout/public/SettingLayout';

// Helper to normalize string IDs or populated objects
const getEntityId = (entity: any): string => {
    if (!entity) return '';
    return typeof entity === 'object' ? entity._id || '' : entity;
};

export default function FreelancerPersonalInfoSettings() {
    const { me } = useSelector(selectMeSlice);
    const dispatch: AppDispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);

    // Country & City options state
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const [isFetchingCountries, setIsFetchingCountries] = useState(false);
    const [isFetchingCities, setIsFetchingCities] = useState(false);

    const [personalInfo, setPersonalInfo] = useState({
        firstName: me?.firstName || '',
        lastName: me?.lastName || '',
        phone: me?.phone || '',
        country: getEntityId(me?.country),
        city: getEntityId(me?.city)
    });

    // 1. Fetch available active countries on component mount
    useEffect(() => {
        let isMounted = true;
        const loadCountries = async () => {
            try {
                setIsFetchingCountries(true);
                const res = await countryService.getAllCountries({ isActive: true, limit: 250 });
                if (isMounted) {
                    setCountries(res.data?.countries || []);
                }
            } catch (error: any) {
                // eslint-disable-next-line react-hooks/immutability
                handleAddToastification(error?.message || "Failed to load countries", "error", DURATION);
            } finally {
                if (isMounted) setIsFetchingCountries(false);
            }
        };

        loadCountries();
        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Fetch cities whenever the selected country changes
    useEffect(() => {
        const countryId = personalInfo.country;
        if (!countryId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCities([]);
            return;
        }

        let isMounted = true;
        const loadCities = async () => {
            try {
                setIsFetchingCities(true);
                const res = await cityService.getCitiesByCountry(countryId, { limit: 250 });
                if (isMounted) {
                    setCities(res.data?.cities || []);
                }
            } catch (error: any) {
                if (isMounted) setCities([]);
                handleAddToastification(error?.message || "Failed to load cities", "error", DURATION);
            } finally {
                if (isMounted) setIsFetchingCities(false);
            }
        };

        loadCities();
        return () => {
            isMounted = false;
        };
    }, [personalInfo.country]);

    // Sync form state when `me` updates from Redux store
    useEffect(() => {
        if (me) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPersonalInfo({
                firstName: me.firstName || '',
                lastName: me.lastName || '',
                phone: me.phone || '',
                country: getEntityId(me.country),
                city: getEntityId(me.city)
            });
        }
    }, [me]);

    // Check if current form values match original Redux user data
    const isUnchanged = useMemo(() => {
        return (
            personalInfo.firstName === (me?.firstName || '') &&
            personalInfo.lastName === (me?.lastName || '') &&
            personalInfo.phone === (me?.phone || '') &&
            personalInfo.country === getEntityId(me?.country) &&
            personalInfo.city === getEntityId(me?.city)
        );
    }, [personalInfo, me]);

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo((prev) => {
            // Clear selected city if the country is changed
            if (field === 'country' && prev.country !== value) {
                return { ...prev, country: value, city: '' };
            }
            return { ...prev, [field]: value };
        });
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
                country: getEntityId(me.country),
                city: getEntityId(me.city)
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
                countries={countries}
                cities={cities}
                isFetchingCountries={isFetchingCountries}
                isFetchingCities={isFetchingCities}
                onFieldChange={handlePersonalInfoChange}
                onAvatarChange={handleAvatarChange}
                onAvatarRemove={handleAvatarRemove}
                changeLoading={changeLoading}
                removeLoading={removeLoading}
            />
        </SettingLayout>
    );
}