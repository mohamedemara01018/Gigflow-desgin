import React, { ChangeEvent, useRef } from 'react';
import SelectField from '../../../ui/SelectFeild';
import { IUserListItem } from '@/services/user.service';
import { ICountry } from '@/services/country.service';
import { ICity } from '@/services/city.service';
import UserImage from '@/components/ui/UserImage';
import { Field } from '../../../ui/Field';

export interface PersonalInfoState {
    firstName: string;
    lastName: string;
    phone?: string;
    country?: string;
    city?: string;
}

interface PersonalInformationSectionProps {
    me: IUserListItem | null;
    personalInfo: PersonalInfoState;
    countries?: ICountry[];
    cities?: ICity[];
    isFetchingCountries?: boolean;
    isFetchingCities?: boolean;
    onFieldChange: (field: string, value: string) => void;
    avatarUrl?: string;
    onAvatarChange: (file: File) => void;
    onAvatarRemove: () => void;
    changeLoading?: boolean;
    removeLoading?: boolean;
}

export default function PersonalInformationSection({
    me,
    personalInfo,
    countries = [],
    cities = [],
    isFetchingCountries = false,
    isFetchingCities = false,
    onFieldChange,
    onAvatarChange,
    onAvatarRemove,
    changeLoading = false,
    removeLoading = false,
}: PersonalInformationSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Native inputs change handler
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onFieldChange(name, value);
    };

    // Custom Select component change handler
    const handleSelectChange = (name: string, value: string) => {
        onFieldChange(name, value);
    };

    // Trigger file browser when clicking "Change Photo"
    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    // Forward selected file to parent handler
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onAvatarChange(file);
            e.target.value = ''; // Reset input so re-selecting the same file works
        }
    };

    const isAvatarBusy = changeLoading || removeLoading;

    // Transform API responses into options format required by SelectField
    const countryOptions = countries.map((country) => ({
        label: `${country.name}${country.dialCode ? ` (${country.dialCode})` : ''}`,
        value: country._id,
    }));

    const cityOptions = cities.map((city) => ({
        label: city.name,
        value: city._id,
    }));

    return (
        <section className="card">
            <h2 className="text-headline-md text-on-surface">
                Personal Information
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
                Basic info to identify you on the platform.
            </p>

            <div className="flex items-center gap-4 mt-5 pb-5 border-b border-outline-variant">
                <UserImage
                    avatarUrl={String(me?.avatar || '')}
                    firstName={me?.firstName || ''}
                    lastName={me?.lastName || ''}
                    className="w-16 h-16"
                />
                <div>
                    <div className="flex items-center gap-4">
                        {/* Hidden native file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/jpg"
                            className="hidden"
                            disabled={isAvatarBusy}
                        />
                        <button
                            type="button"
                            onClick={handleFileButtonClick}
                            disabled={isAvatarBusy}
                            className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                        >
                            {changeLoading ? 'Uploading...' : 'Change Photo'}
                        </button>
                        <button
                            type="button"
                            onClick={onAvatarRemove}
                            disabled={isAvatarBusy}
                            className="text-label-md text-error hover:underline disabled:opacity-50"
                        >
                            {removeLoading ? 'Removing...' : 'Remove'}
                        </button>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-2">
                        JPG or PNG. Max size of 5MB
                    </p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <Field
                    label="First Name"
                    placeholder="first name"
                    name="firstName"
                    value={personalInfo.firstName}
                    onChange={handleInputChange}
                />
                <Field
                    label="Last Name"
                    placeholder="last name"
                    name="lastName"
                    value={personalInfo.lastName}
                    onChange={handleInputChange}
                />
                <Field
                    label="Email Address"
                    badge="Verified"
                    value={me?.email || ''}
                    readOnly
                />
                <Field
                    label="Phone Number"
                    name="phone"
                    placeholder="your phone"
                    value={personalInfo.phone || ''}
                    onChange={handleInputChange}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-outline-variant">
                <SelectField
                    label={isFetchingCountries ? "Country (Loading...)" : "Country"}
                    id="country"
                    name="country"
                    value={personalInfo.country || ''}
                    options={countryOptions}
                    disabled={isFetchingCountries}
                    onChange={handleSelectChange}
                />
                <SelectField
                    label={
                        isFetchingCities
                            ? "City (Loading...)"
                            : !personalInfo.country
                                ? "City (Select a country first)"
                                : "City"
                    }
                    id="city"
                    name="city"
                    value={personalInfo.city || ''}
                    options={cityOptions}
                    disabled={!personalInfo.country || isFetchingCities}
                    onChange={handleSelectChange}
                />
            </div>
        </section>
    );
}