/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Field from '@/components/features/freelancer/profile-settings/Field';
import SelectField from '@/components/features/freelancer/profile-settings/SelectField';

interface PersonalInformationSectionProps {
    avatarUrl?: string;
    onAvatarChange?: () => void;
    onAvatarRemove?: () => void;
}

export default function PersonalInformationSection({
    avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBnQJOVzDpn4HRUQ995oDK8vNKEldnD0Vb_ZKIOFY-5251x_rTcJi3UMcPejacZ6ha9vAvgsnoW77j0mfzWS5-A5LkmhDKDHbynaLIPourfV2xS9bn2CdCZhFvwV91CcMAGbQKV_iMxq_9UcSMXqIxCcxf7jZu-SuWIc0KLd2FJu2cJHwd3uFonwt8Gzqizy9w9tBiuwlyef-4kXv_YtQ1tfeh2W2NmQHcRVZSyMXA3HtxRDHWznYSvknNbzV5N6aol7B-Ghwdf82c",
    onAvatarChange,
    onAvatarRemove,
}: PersonalInformationSectionProps) {
    return (
        <section className="card">
            <h2 className="text-headline-md text-on-surface">
                Personal Information
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
                Basic info to identify you on the platform.
            </p>

            <div className="flex items-center gap-4 mt-5 pb-5 border-b border-outline-variant">
                <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onAvatarChange}
                            className="bg-surface-container-high text-on-surface text-label-md rounded-md px-4 py-2 hover:bg-surface-container-highest transition-colors"
                        >
                            Change Photo
                        </button>
                        <button
                            onClick={onAvatarRemove}
                            className="text-label-md text-error hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-2">
                        JPG, GIF or PNG. Max size of 800K
                    </p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <Field label="First Name" defaultValue="Alex" />
                <Field label="Last Name" defaultValue="Rivera" />
                <Field label="Username" defaultValue="@arivera_pro" />
                <Field
                    label="Email Address"
                    defaultValue="alex.rivera@example.com"
                    badge="Verified"
                />
                <Field label="Phone Number" defaultValue="+1 (415) 555-0132" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-outline-variant">
                <SelectField label="Country" defaultValue="United States" />
                <Field label="City" defaultValue="San Francisco" />
                <SelectField label="Timezone" defaultValue="PST (UTC-8)" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <SelectField label="Language" defaultValue="English (US)" />
            </div>
        </section>
    );
}