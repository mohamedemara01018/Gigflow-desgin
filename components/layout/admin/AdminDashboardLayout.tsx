"use client";

import React, { useState } from "react";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";


const HEADER_HIGH = 70;
const SIDEBAR_WIDTH = 256;

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-dvh bg-surface text-on-surface">
            {/* Top Navigation Bar */}
            <Navbar
                HEADER_HIGH={HEADER_HIGH}
                onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
            />

            {/* Sidebar Navigation */}
            <Sidebar
                HEADER_HIGH={HEADER_HIGH}
                SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                isOpenMobile={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content Workspace Offset for Desktop */}
            <main
                style={{
                    paddingTop: `${HEADER_HIGH}px`,
                }}
                className="min-h-dvh transition-all duration-200 pl-0 lg:pl-64"
            >
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}