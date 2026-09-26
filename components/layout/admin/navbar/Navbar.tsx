"use client";

import { Menu, ShieldCheck } from "lucide-react";
import ToggleTheme from "@/components/ui/ToggleTheme";

interface NavbarProps {
    HEADER_HIGH: number;
    onToggleMobileSidebar?: () => void;
}

export default function Navbar({ HEADER_HIGH, onToggleMobileSidebar }: NavbarProps) {
    return (
        <header
            className="fixed top-0 right-0 left-0 z-50 bg-surface-container/90 backdrop-blur-md border-b border-outline-variant"
            style={{ height: `${HEADER_HIGH}px` }}
        >
            <div className="flex h-full items-center justify-between px-4 sm:px-6">
                {/* Left side: Mobile Toggle & Brand Logo */}
                <div className="flex items-center gap-3">
                    {/* Mobile Sidebar Trigger Toggle Button */}
                    <button
                        type="button"
                        onClick={onToggleMobileSidebar}
                        aria-label="Toggle navigation menu"
                        className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                        <Menu size={22} />
                    </button>

                    {/* Logo & Admin Branding */}
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-on-primary shadow-xs">
                            <ShieldCheck size={20} />
                        </span>
                        <span className="text-title-lg font-bold text-primary tracking-tight">
                            Admin Panel
                        </span>
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <ToggleTheme />

                    {/* System Status Pill */}
                    <span className="hidden sm:flex items-center gap-2 rounded-full bg-surface-container-high px-3.5 py-1.5 text-label-md font-medium text-on-surface">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        System Active
                    </span>

                    {/* Security Badge Indicator */}
                    <button
                        type="button"
                        aria-label="Admin settings"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-opacity hover:bg-primary/20"
                    >
                        <ShieldCheck size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}