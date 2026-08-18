import React from 'react';
import { ProfileVisibility } from '@/utils/enums.utils';
import { CheckCircle2, EyeOff, Globe, Users } from 'lucide-react';
import SelectField from '@/components/ui/SelectFeild';
import { Field } from './Field';

const VISIBILITY_OPTIONS: {
    id: ProfileVisibility;
    icon: typeof Globe;
    title: string;
    description: string;
}[] = [
        { id: ProfileVisibility.PUBLIC, icon: Globe, title: "Public", description: "Visible to everyone" },
        { id: ProfileVisibility.CLIENTS_ONLY, icon: Users, title: "Clients Only", description: "Visible to registered clients" },
        { id: ProfileVisibility.PRIVATE, icon: EyeOff, title: "Private", description: "Hidden from search results" },
    ];

interface ProfessionalProfileSectionProps {
    overview: string;
    setOverview: (overview: string) => void;
    visibility: string;
    setVisibility: (visibility: ProfileVisibility) => void;
}

export default function ProfessionalProfileSection({
    overview,
    setOverview,
    visibility,
    setVisibility,
}: ProfessionalProfileSectionProps) {
    return (
        <section className="card">
            <h2 className="text-headline-md text-on-surface">
                Professional Profile
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
                How clients see you in search results and on your public page.
            </p>

            <div className="mt-5">
                <Field
                    label="Professional Title"
                    defaultValue="Senior Full-Stack Engineer & UX Architect"
                />
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between">
                    <label className="text-body-sm font-medium text-on-surface">
                        Detailed Overview
                    </label>
                    <span className="text-label-sm text-on-surface-variant">
                        {overview.length}/5000
                    </span>
                </div>
                <textarea
                    value={overview}
                    onChange={(e) => setOverview(e.target.value.slice(0, 5000))}
                    rows={5}
                    className="w-full mt-2 bg-surface-container-low border border-outline-variant rounded-md p-3.5 text-body-md text-on-surface outline-none focus:border-primary resize-none"
                />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-5">
                <div>
                    <label className="text-body-sm font-medium text-on-surface block mb-2">
                        Hourly Rate
                    </label>
                    <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-md px-3.5">
                        <span className="text-body-md text-on-surface-variant">$</span>
                        <input
                            defaultValue={85}
                            type="number"
                            className="w-full bg-transparent py-2.5 px-2 text-body-md text-on-surface outline-none"
                        />
                        <span className="text-body-sm text-on-surface-variant">/hr</span>
                    </div>
                </div>
                {/* <SelectField label="Experience" id='experience' name='experience' options={[]} />
                <SelectField label="Availability" id='availability' name='availability' options={[]} /> */}
            </div>

            <div className="mt-6">
                <label className="text-body-sm font-medium text-on-surface block mb-3">
                    Profile Visibility
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                    {VISIBILITY_OPTIONS.map(({ id, icon: Icon, title, description }) => {
                        const isSelected = visibility === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setVisibility(id)}
                                className={`text-left rounded-md p-4 border-2 transition-colors ${isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-outline-variant hover:border-outline"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <Icon size={20} className="text-primary" />
                                    {isSelected && (
                                        <CheckCircle2 size={16} className="text-primary" />
                                    )}
                                </div>
                                <p className="text-body-md font-medium text-on-surface mt-2">
                                    {title}
                                </p>
                                <p className="text-body-sm text-on-surface-variant mt-0.5">
                                    {description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}