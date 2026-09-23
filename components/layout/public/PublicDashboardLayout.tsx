

import React from 'react'
import Navbar from './navbar/Navbar'


function PublicDashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <Navbar />
            <main className='pt-20'>
                {children}
            </main>
        </div>
    )
}

export default PublicDashboardLayout