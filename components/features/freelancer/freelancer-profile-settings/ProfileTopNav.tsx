"use client";

import { UserCog, Award, LayoutGrid, Link2, LucideIcon } from "lucide-react";

export type ProfileTabId = "settings" | "skills" | "portfolio" | "credentials";

const TABS: { id: ProfileTabId; label: string; icon: LucideIcon }[] = [
    { id: "settings", label: "Profile Settings", icon: UserCog },
    { id: "skills", label: "Skills & Experience", icon: Award },
    { id: "portfolio", label: "Portfolio", icon: LayoutGrid },
    { id: "credentials", label: "External Links & Credentials", icon: Link2 },
];

interface ProfileTopNavProps {
    activeTab: ProfileTabId;
    onChange: (tab: ProfileTabId) => void;
}

export default function ProfileTopNav({ activeTab, onChange }: ProfileTopNavProps) {
    return (
        <div className="flex items-center gap-2 border-b border-outline-variant overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                    <button
                        key={id}
                        onClick={() => onChange(id)}
                        className={`flex items-center gap-2 px-4 py-3 text-body-sm font-medium whitespace-nowrap border-b-2 transition-colors ${isActive
                                ? "border-primary text-primary"
                                : "border-transparent text-on-surface-variant hover:text-on-surface"
                            }`}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                );
            })}
        </div>
    );
}