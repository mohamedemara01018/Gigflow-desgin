'use client'

import { IUserListItem } from "@/services/user.service";
import { UserRole } from "@/utils/enums.utils";
import {
    User,
    UserCog,
    Briefcase,
    Lock,
    CreditCard,
    Bell,
    LucideIcon,
    UserPen,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export interface SettingsNavItem {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
}



export default function SettingsNav({ me }: { me: IUserListItem }) {
    const pathname = usePathname();
    const router = useRouter();

    const isFreelancer = me.role == UserRole.FREELANCER
    const isAdmin = me.role == UserRole.ADMIN
    const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
        { id: "personal-info", href: "/settings/personal-info", label: "Personal Info", icon: User },
        ...(isFreelancer ? [{ id: "profile", href: "/settings/profile", label: "Profile", icon: UserPen }] : []),
        { id: "account", href: "/settings/account", label: "Account Info", icon: UserCog },
        { id: "security", href: "/settings/security", label: "Security", icon: Lock },
        ...(!isAdmin ? [{ id: "payments", href: "/settings/payments", label: "Payments", icon: CreditCard }] : []),
        { id: "notifications", href: "/settings/notifications", label: "Notifications", icon: Bell },
    ];
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