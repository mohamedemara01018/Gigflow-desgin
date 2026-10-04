/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
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
    Wrench,
    LogOut,
    Settings,
    ChevronDown,
    X,
    LucideIcon,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { selectMeSlice } from "@/store/slices/auth/authSlice";
import UserImage from "@/components/ui/UserImage";

interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface NavSection {
    id: string;
    label: string | null;
    items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
    {
        id: "main",
        label: null,
        items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
        id: "users",
        label: "Users Management",
        items: [
            { href: "/admin/users", label: "All Users", icon: Users },
            { href: "/admin/users/freelancers", label: "Freelancers", icon: UserCheck },
            { href: "/admin/users/clients", label: "Clients", icon: Building2 },
            { href: "/admin/users/suspended", label: "Suspended", icon: UserX },
        ],
    },
    {
        id: "jobs",
        label: "Jobs & Marketplace",
        items: [
            { href: "/admin/jobs", label: "All Jobs", icon: Briefcase },
            { href: "/admin/jobs/open", label: "Open Jobs", icon: FolderOpen },
            { href: "/admin/jobs/completed", label: "Completed", icon: CheckCircle2 },
            { href: "/admin/jobs/reported", label: "Reported", icon: Flag },
        ],
    },
    {
        id: "contracts",
        label: "Workflows",
        items: [
            { href: "/admin/proposals", label: "Proposals", icon: FileText },
            { href: "/admin/contracts", label: "Contracts", icon: FileSignature },
        ],
    },
    {
        id: "finance",
        label: "Finance",
        items: [
            { href: "/admin/transactions", label: "Transactions", icon: Receipt },
            { href: "/admin/withdrawals", label: "Withdrawals", icon: Wallet },
        ],
    },
    {
        id: "management",
        label: "Platform Setup",
        items: [
            { href: "/admin/verifications", label: "Verifications", icon: IdCard },
            { href: "/admin/contact-support", label: "Contacts suppport", icon: AlertTriangle },
            { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
            { href: "/admin/skills", label: "Skills", icon: Wrench },
            { href: "/admin/regions", label: "Regions", icon: Building2 },
        ],
    },
];

interface SidebarProps {
    HEADER_HIGH: number;
    SIDEBAR_WIDTH: number;
    isOpenMobile?: boolean;
    onCloseMobile?: () => void;
}

export default function Sidebar({
    HEADER_HIGH,
    SIDEBAR_WIDTH,
    isOpenMobile = false,
    onCloseMobile,
}: SidebarProps) {
    const pathname = usePathname();
    const { me } = useSelector(selectMeSlice);

    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isOpenMobile && onCloseMobile) {
            onCloseMobile();
        }
    }, [pathname]);

    const toggleSection = (sectionId: string) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            window.location.reload();
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    const sidebarContent = (
        <div className="flex flex-col justify-between h-full w-full bg-surface-container border-r border-outline-variant">
            {/* Scrollable Navigation Area */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 select-none scrollbar-thin scrollbar-thumb-outline-variant">
                {NAV_SECTIONS.map((section) => {
                    const isCollapsed = collapsedSections[section.id];

                    return (
                        <div key={section.id} className="flex flex-col gap-1">
                            {section.label && (
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="flex items-center justify-between w-full px-3 py-1.5 text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant/70 hover:text-on-surface transition-colors rounded-md"
                                >
                                    <span>{section.label}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : "rotate-0"
                                            }`}
                                    />
                                </button>
                            )}

                            {!isCollapsed && (
                                <div className="flex flex-col gap-0.5 mt-0.5">
                                    {section.items.map(({ href, label, icon: Icon }) => {
                                        const isActive = pathname === href;

                                        return (
                                            <Link
                                                key={href}
                                                href={href}
                                                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md transition-all duration-150 ${isActive
                                                    ? "bg-primary/10 text-primary font-semibold"
                                                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                                                    }`}
                                            >
                                                <Icon
                                                    size={19}
                                                    className={`shrink-0 transition-transform duration-150 group-hover:scale-110 ${isActive
                                                        ? "text-primary"
                                                        : "text-on-surface-variant group-hover:text-on-surface"
                                                        }`}
                                                />
                                                <span className="truncate">{label}</span>

                                                {isActive && (
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Profile Details */}
            <div className="p-3 border-t border-outline-variant bg-surface-container-lowest/50 backdrop-blur-xs flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-low/60 border border-outline-variant/40">
                    <UserImage
                        avatarUrl={String(me?.avatar || "")}
                        firstName={String(me?.firstName || "")}
                        lastName={String(me?.lastName || "")}
                        className="w-9 h-9 rounded-full ring-2 ring-primary/20 shrink-0 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-body-sm font-semibold text-on-surface truncate leading-tight">
                            {me?.firstName ? `${me.firstName} ${me.lastName || ""}` : "Admin User"}
                        </p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                            {me?.email || "admin@gigflow.com"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-1">
                    <Link
                        href="/admin/settings"
                        className="flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                    >
                        <Settings size={15} />
                        <span>Settings</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-md text-label-md font-medium text-error hover:bg-error/10 transition-colors"
                    >
                        <LogOut size={15} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Persistent Sidebar */}
            <aside
                className="hidden lg:block fixed left-0 bottom-0 z-40 transition-all duration-200"
                style={{
                    top: `${HEADER_HIGH}px`,
                    width: `${SIDEBAR_WIDTH}px`,
                }}
            >
                {sidebarContent}
            </aside>

            {/* Mobile / Tablet Drawer */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isOpenMobile
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
            >
                <div
                    className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
                    onClick={onCloseMobile}
                />

                <aside
                    className={`absolute top-0 left-0 bottom-0 w-70 max-w-[85vw] bg-surface-container transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpenMobile ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex items-center justify-between p-4 border-b border-outline-variant">
                        <span className="text-title-sm font-semibold text-on-surface">
                            Navigation
                        </span>
                        <button
                            onClick={onCloseMobile}
                            aria-label="Close navigation"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden">{sidebarContent}</div>
                </aside>
            </div>
        </>
    );
}