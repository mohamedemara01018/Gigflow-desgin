import React from 'react';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

export default function ClientDashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-on-surface font-['Inter']">
            <Navbar />
            <main className="flex-1 wrapper w-full mx-auto px-4 md:px-6 py-6 space-y-6">
                {children}
            </main>
            <Footer />
        </div>
    );
}