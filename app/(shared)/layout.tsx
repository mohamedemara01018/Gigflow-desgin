'use client'

import { selectMeSlice } from '@/store/slices/auth/authSlice';
import { UserRole } from '@/utils/enums.utils';
import React from 'react';
import { useSelector } from 'react-redux';
import FreelancerDashboardLayout from '@/components/layout/freelancer/FreelancerDashboardLayout';
import ClientDashboardLayout from '@/components/layout/client/ClientDashboardLayout';
import AdminDashboardLayout from '@/components/layout/admin/AdminDashboardLayout';
import PublicDashboardLayout from '@/components/layout/public/PublicDashboardLayout';

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const { me } = useSelector(selectMeSlice);

    switch (me?.role) {
        case UserRole.FREELANCER:
            return (
                <FreelancerDashboardLayout>
                    {children}
                </FreelancerDashboardLayout>
            )
        case UserRole.CLIENT:
            return (
                <ClientDashboardLayout>
                    {children}
                </ClientDashboardLayout>
            )
        case UserRole.ADMIN:
            return (
                <AdminDashboardLayout>
                    {children}
                </AdminDashboardLayout>
            )

        default:
            return (
                <PublicDashboardLayout>
                    {children}
                </PublicDashboardLayout>
            )

    }

}