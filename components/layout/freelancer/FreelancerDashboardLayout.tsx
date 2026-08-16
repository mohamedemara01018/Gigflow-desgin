import React from 'react'
import Navbar from './navbar/Navbar'
import Footer from './footer/Footer'

function FreelancerDashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen bg-background text-on-surface font-['Inter']">
            <Navbar />
            <main className="wrapper py-8 space-y-8">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default FreelancerDashboardLayout