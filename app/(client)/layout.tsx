
import ClientDashboardLayout from '@/components/layout/client/ClientDashboardLayout'
import React from 'react'

function layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClientDashboardLayout>
            {children}
        </ClientDashboardLayout>
    )
}

export default layout