'use client'

import {
    User,
    UserCog,
    Briefcase,
    Lock,
    CreditCard,
    Bell,
    LucideIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export interface SettingsNavItem {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
}

const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
    { id: "profile", href: "/settings/profile", label: "Profile", icon: User },
    { id: "account", href: "/settings/account", label: "Account Info", icon: UserCog },
    { id: "skills", href: "/settings/skills", label: "Skills & Exp", icon: Briefcase },
    { id: "security", href: "/settings/security", label: "Security", icon: Lock },
    { id: "payments", href: "/settings/payments", label: "Payments", icon: CreditCard },
    { id: "notifications", href: "/settings/notifications", label: "Notifications", icon: Bell },
];

export default function SettingsNav() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <nav className="card p-2! flex flex-col gap-1">
            {SETTINGS_NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => router.push(href)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-body-md text-left transition-colors ${isActive
                                ? "bg-primary text-on-primary font-medium"
                                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                            }`}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                );
            })}
        </nav>
    );
}