import React from "react";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

const HEADER_HIGH = 70;
const SIDEBAR_WIDTH = 256;

function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh bg-surface">
            <Navbar HEADER_HIGH={HEADER_HIGH} />

            <Sidebar
                HEADER_HIGH={HEADER_HIGH}
                SIDEBAR_WIDTH={SIDEBAR_WIDTH}
            />

            <main
                style={{
                    marginLeft: `${SIDEBAR_WIDTH}px`,
                    paddingTop: `${HEADER_HIGH}px`,
                }}
                className="min-h-dvh"
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboardLayout;