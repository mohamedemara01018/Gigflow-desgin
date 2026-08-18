"use client";

import { getInitials } from "@/utils/functions.utils";
import {
    User,
    LayoutDashboard,
    Settings,
    HelpCircle,
    LogOut,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UserImage from "./UserImage";

interface UserMenuProps {
    firstName: string
    lastName: string
    role: string;
    id: string
    avatarUrl?: string;
    onLogout: () => void;
    loading: boolean
}

const MENU_ITEMS = (id: string) => [
    { href: `/profile/${id}`, label: "My Profile", icon: User },
    // { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/settings/personal-info", label: "Settings", icon: Settings },
    { href: "/contact-supportF", label: "Help & Support", icon: HelpCircle },
];

function UserMenu({ firstName, lastName, role, id, avatarUrl, onLogout, loading }: UserMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Open account menu"
                aria-expanded={open}
                className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-primary/30 transition-all"
            >
                <UserImage avatarUrl={String(avatarUrl)} firstName={firstName} lastName={lastName} className="w-9 h-9" />
            </button>

            {open && (
                <>
                    <button
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-10"
                    />

                    <div className="absolute right-0 top-full mt-2 z-20 w-64 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[var(--shadow-level-3)] overflow-hidden">
                        <div className="px-4 py-3.5 border-b border-outline-variant">
                            <p className="text-body-md font-semibold text-on-surface">
                                {firstName + ' ' + lastName}
                            </p>
                            <p className="text-body-sm text-on-surface-variant">{role}</p>
                        </div>

                        <div className="py-1.5">
                            {MENU_ITEMS(id).map(({ href, label, icon: Icon }, i) => {
                                const isActive = i === 0;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-body-sm transition-colors ${isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-on-surface hover:bg-surface-container-low"
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="border-t border-outline-variant py-1.5">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onLogout();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-error hover:bg-error/10 transition-colors"
                            >
                                {
                                    loading ? <Loader2 />
                                        : <>
                                            <LogOut size={16} />
                                            Logout
                                        </>
                                }
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default UserMenu;