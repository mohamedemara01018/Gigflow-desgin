"use client";

import {
    LayoutDashboard,
    Users,
    UserCheck,
    Building2,
    UserX,
    Briefcase,
    FolderOpen,
    CheckCircle2,
    Flag,
    FileText,
    FileSignature,
    Receipt,
    Wallet,
    IdCard,
    AlertTriangle,
    LayoutGrid,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";

interface NavItem {
    href: string;
    label: string;
    icon: typeof Users;
}

interface NavSection {
    label: string | null;
    items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
    {
        label: null,
        items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
        label: "Users",
        items: [
            { href: "/admin/users", label: "All Users", icon: Users },
            { href: "/admin/users/freelancers", label: "Freelancers", icon: UserCheck },
            { href: "/admin/users/clients", label: "Clients", icon: Building2 },
            { href: "/admin/users/suspended", label: "Suspended", icon: UserX },
        ],
    },
    {
        label: "Jobs",
        items: [
            { href: "/admin/jobs", label: "All Jobs", icon: Briefcase },
            { href: "/admin/jobs/open", label: "Open Jobs", icon: FolderOpen },
            { href: "/admin/jobs/completed", label: "Completed", icon: CheckCircle2 },
            { href: "/admin/jobs/reported", label: "Reported", icon: Flag },
        ],
    },
    {
        label: null,
        items: [
            { href: "/admin/proposals", label: "Proposals", icon: FileText },
            { href: "/admin/contracts", label: "Contracts", icon: FileSignature },
        ],
    },
    {
        label: "Finance",
        items: [
            { href: "/admin/transactions", label: "Transactions", icon: Receipt },
            { href: "/admin/withdrawals", label: "Withdrawals", icon: Wallet },
        ],
    },
    {
        label: null,
        items: [
            { href: "/admin/verifications", label: "Verification Requests", icon: IdCard },
            { href: "/admin/reports", label: "Reports", icon: AlertTriangle },
            { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
        ],
    },
];

interface AdminProfile {
    name: string;
    email: string;
}

function Sidebar({
    HEADER_HIGH,
    SIDEBAR_WIDTH,
    admin = { name: "Admin Central", email: "admin@gigflow.com" },
}: {
    HEADER_HIGH: number;
    SIDEBAR_WIDTH: number;
    admin?: AdminProfile;
}) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await authService.logout();
        window.location.reload();
    };

    const initials = admin.name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <aside
            className="fixed bottom-0 left-0 z-50"
            style={{
                top: `${HEADER_HIGH}px`,
                width: `${SIDEBAR_WIDTH}px`,
            }}
        >
            <div className="flex flex-col justify-between bg-surface-container border-r border-outline-variant h-full w-full overflow-y-auto">
                <nav className="flex flex-col gap-1 px-4 py-6">
                    {NAV_SECTIONS.map((section, sectionIndex) => (
                        <div key={sectionIndex} className={sectionIndex > 0 ? "mt-2" : ""}>
                            {section.label && (
                                <p className="text-label-sm uppercase tracking-wide text-on-surface-variant px-4 pt-3 pb-1.5">
                                    {section.label}
                                </p>
                            )}
                            {section.items.map(({ href, label, icon: Icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-md text-body-md transition-colors border-l-4 ${isActive
                                            ? "bg-primary/10 border-primary text-primary font-medium"
                                            : "border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="border-t border-outline-variant px-4 py-4 flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <span className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-md font-semibold shrink-0">
                            {initials}
                        </span>
                        <div className="min-w-0">
                            <p className="text-body-sm font-medium text-on-surface truncate">
                                {admin.name}
                            </p>
                            <p className="text-label-sm text-on-surface-variant truncate">
                                {admin.email}
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/settings/profile"
                        className="px-2 py-2 rounded-md text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                    >
                        Profile Settings
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="text-left px-2 py-2 rounded-md text-body-sm text-error hover:bg-error/10 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;