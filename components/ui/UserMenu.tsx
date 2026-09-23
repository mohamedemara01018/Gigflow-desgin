"use client";

import {
    User,
    Settings,
    HelpCircle,
    LogOut,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import UserImage from "./UserImage";
import { usePathname } from "next/navigation";
import { UserRole } from "@/utils/enums.utils";

interface UserMenuProps {
    firstName: string;
    lastName: string;
    role: string;
    id: string;
    avatarUrl?: string;
    onLogout: () => void;
    loading: boolean;
}

export default function UserMenu({
    firstName,
    lastName,
    role,
    id,
    avatarUrl,
    onLogout,
    loading,
}: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    const isFreelancer = role === UserRole.FREELANCER;

    // Build dynamic menu items
    const menuItems = [
        ...(isFreelancer ? [{ href: `/profile/${id}`, label: "My Profile", icon: User }] : []),
        { href: "/settings/personal-info", label: "Settings", icon: Settings },
        { href: "/contact-support", label: "Help & Support", icon: HelpCircle },
    ];

    // Close menu when pressing Escape or clicking outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Open account menu"
                aria-expanded={open}
                className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-primary/30 transition-all cursor-pointer"
            >
                <UserImage
                    avatarUrl={avatarUrl ? String(avatarUrl) : ""}
                    firstName={firstName}
                    lastName={lastName}
                    className="w-9 h-9"
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* User Info Header */}
                    <div className="px-4 py-3.5 border-b border-outline-variant">
                        <p className="text-body-md font-semibold text-on-surface truncate">
                            {`${firstName} ${lastName}`.trim() || "User"}
                        </p>
                        <p className="text-body-sm text-on-surface-variant capitalize">{role}</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="py-1.5">
                        {menuItems.map(({ href, label, icon: Icon }) => {
                            const baseSegment = href.split("/")[1];
                            const isActive = pathname.startsWith(`/${baseSegment}`);

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
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Logout Action */}
                    <div className="border-t border-outline-variant py-1.5">
                        <button
                            disabled={loading}
                            onClick={() => {
                                setOpen(false);
                                onLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-error hover:bg-error/10 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Logging out...</span>
                                </>
                            ) : (
                                <>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}