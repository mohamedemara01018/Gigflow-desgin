"use client";

import { IdCard } from "lucide-react";
import { Field } from "../Field";


interface BasicInfoSectionProps {
    title: string;
    bio: string;
    onTitleChange: (value: string) => void;
    onBioChange: (value: string) => void;
}

export function BasicInfoSection({
    title,
    bio,
    onTitleChange,
    onBioChange,
}: BasicInfoSectionProps) {
    return (
        <section className="card">
            <span className="flex items-center gap-2 text-headline-md text-on-surface">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <IdCard size={16} />
                </span>
                Basic Info
            </span>

            <div className="flex flex-col gap-4 mt-5">
                <Field
                    label="Professional Title"
                    placeholder="Professional Title"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                />
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-body-sm font-medium text-on-surface">
                            Short Bio
                        </label>
                        <span className="text-label-sm text-on-surface-variant">
                            {bio.length}/160
                        </span>
                    </div>
                    <textarea
                        placeholder="Short Bio"
                        value={bio}
                        onChange={(e) => onBioChange(e.target.value.slice(0, 160))}
                        rows={2}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary resize-none"
                    />
                </div>
            </div>
        </section>
    );
}