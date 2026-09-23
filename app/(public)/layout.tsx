import PublicDashboardLayout from '@/components/layout/public/PublicDashboardLayout'
import React from 'react'

function layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <PublicDashboardLayout>
            {children}
        </PublicDashboardLayout>
    )
}

export default layout