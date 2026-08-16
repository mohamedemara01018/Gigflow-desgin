'use client'
import PersonalInformationSection from '@/components/features/freelancer/profile-settings/PersonalInformationSection';
import ProfessionalProfileSection from '@/components/features/freelancer/profile-settings/ProfessionalProfileSection';
import SettingLayout from '@/components/layout/public/SettingLayout';
import { ProfileVisibility } from '@/utils/enums.utils';
import { useState } from 'react';



export default function FreelancerProfileSettingsPage() {
    const [visibility, setVisibility] = useState<ProfileVisibility>(ProfileVisibility.PUBLIC);
    const [overview, setOverview] = useState(
        "I specialize in building scalable, performant web applications using modern React ecosystems (Next.js, Tailwind, TypeScript). With over 8 years of experience bridging the gap between design and engineering, I deliver products that not only work flawlessly but feel intuitive to the end user."
    );
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">Account Settings</h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Manage your personal information and professional profile.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors">
                        Cancel
                    </button>
                    <button className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                </div>
            </div>
            <PersonalInformationSection />
            <ProfessionalProfileSection
                overview={overview}
                setOverview={setOverview}
                visibility={visibility}
                setVisibility={setVisibility}
            />
        </div>
    );
}