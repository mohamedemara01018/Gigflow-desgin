
import AdminDashboardLayout from '@/components/layout/admin/AdminDashboardLayout'
import React from 'react'

function layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AdminDashboardLayout>
            {children}
        </AdminDashboardLayout>
    )
}

export default layout