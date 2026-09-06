'use client'
import SettingsNav from '@/components/features/freelancer/freelancer-settings/SettingsNav';
import { selectMeSlice } from '@/store/slices/auth/authSlice';
import { UserRole } from '@/utils/enums.utils';
import React from 'react';
import { useSelector } from 'react-redux';

interface SettingLayoutProps {
    children: React.ReactNode;
    title?: string;
    desc?: string;
    onSaveChange?: () => void;
    onCancelChange?: () => void;
    isAnyLoading?: boolean;
    isUnchanged?: boolean;
    loading?: boolean;
}

export default function SettingLayout({
    children,
    title,
    desc,
    onSaveChange,
    onCancelChange,
    isAnyLoading = false,
    isUnchanged = false,
    loading = false,
}: Readonly<SettingLayoutProps>) {
    const hasActions = Boolean(onSaveChange || onCancelChange);
    const { me } = useSelector(selectMeSlice);
    const isFreelancer = me?.role == UserRole.FREELANCER
    return (
        <div className="wrapper">
            <div className={`grid grid-cols-1 ${!isFreelancer ? '' : 'lg:grid-cols-[240px_1fr]'} gap-6 mt-6`}>

                <aside className="flex flex-col gap-6">
                    {
                        isFreelancer && <SettingsNav />
                    }

                </aside>

                <main className="flex flex-col gap-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            {title && <h1 className="text-headline-lg text-on-surface">{title}</h1>}
                            {desc && (
                                <p className="text-body-md text-on-surface-variant mt-2">
                                    {desc}
                                </p>
                            )}
                        </div>

                        {/* Only render the actions wrapper if at least one handler function is passed */}
                        {hasActions && (
                            <div className="flex items-center gap-3">
                                {onCancelChange && (
                                    <button
                                        type="button"
                                        onClick={onCancelChange}
                                        disabled={isAnyLoading || isUnchanged}
                                        className="bg-surface-container-high text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Discard Changes
                                    </button>
                                )}
                                {onSaveChange && (
                                    <button
                                        type="button"
                                        onClick={onSaveChange}
                                        disabled={isAnyLoading || isUnchanged}
                                        className="bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : 'Save Preferences'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {children}
                </main>
            </div>
        </div >
    );
}