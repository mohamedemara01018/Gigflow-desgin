/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Search, TextAlignJustify, X, Plus } from 'lucide-react';

import Logo from '@/components/ui/Logo';
import NotificationBell from '@/components/ui/NotificationBell';
import ToggleTheme from '@/components/ui/ToggleTheme';
import UserMenu from '@/components/ui/UserMenu';
import { authService } from '@/services/auth.service';
import { selectMeSlice } from '@/store/slices/auth/authSlice';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';
import { AppDispatch } from '@/store/store';
import { UserRole } from '@/utils/enums.utils';
import { DURATION } from '@/utils/constant.utils';

interface NavLink {
    label: string;
    href: string;
}

const CLIENT_NAV_LINKS: NavLink[] = [
    { label: 'My Jobs', href: '/client/jobs' },
    { label: 'Find Talent', href: '/client/talent' },
    { label: 'Messages', href: '/messages' },
    { label: 'Reports', href: '/client/reports' },
];

const FREELANCER_NAV_LINKS: NavLink[] = [
    { label: 'Browse Jobs', href: '/' },
    { label: 'Proposals', href: '/freelancer/proposals' },
    { label: 'Saved Jobs', href: '/freelancer/saved-jobs' },
    { label: 'Messages', href: '/messages' },
];

const DEFAULT_NAV_LINKS: NavLink[] = [
    { label: 'Browse', href: '/' },
    { label: 'Messages', href: '/messages' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const { me } = useSelector(selectMeSlice);

    const handleToast = (message: string, type: IToastificationType, duration = DURATION) => {
        dispatch(toastify({ message, type, duration }));
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            window.location.reload();
        } catch (error: any) {
            handleToast(error?.message || 'Failed to logout. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        const targetPath = me?.role === UserRole.CLIENT ? '/client/talent' : '/jobs';
        router.push(`${targetPath}?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    // Determine navigation links dynamically based on user role
    const navLinks = me?.role === UserRole.CLIENT
        ? CLIENT_NAV_LINKS
        : me?.role === UserRole.FREELANCER
            ? FREELANCER_NAV_LINKS
            : DEFAULT_NAV_LINKS;

    const isClient = me?.role === UserRole.CLIENT;

    return (
        <>
            <nav className="bg-surface border-b border-outline-variant shadow-xs sticky top-0 z-50 w-full">
                <div className="wrapper flex justify-between items-center w-full px-6 mx-auto h-16">
                    {/* Left Section: Brand & Navigation */}
                    <div className="flex items-center gap-8">
                        <button
                            type="button"
                            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                            aria-label="Toggle navigation menu"
                        >
                            {menuOpen ? <X size={22} /> : <TextAlignJustify size={22} />}
                        </button>

                        <Logo />

                        <div className="hidden md:flex gap-6 items-center">
                            {navLinks.map(({ label, href }) => {
                                const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
                                return (
                                    <Link
                                        key={label}
                                        href={href}
                                        className={`text-body-md font-medium transition-colors duration-200 ${isActive
                                                ? 'text-primary font-semibold'
                                                : 'text-on-surface hover:text-primary'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Section: Actions & Profile */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isClient ? "Search talent..." : "Search jobs..."}
                                className="pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-[14px] leading-5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 w-56 md:w-64 transition-all"
                            />
                        </form>

                        {/* Post Job Action for Clients */}
                        {isClient && (
                            <Link
                                href="/client/jobs/create"
                                className="hidden sm:flex items-center gap-1.5 bg-primary text-on-primary text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity shrink-0"
                            >
                                <Plus size={18} />
                                <span>Post a Job</span>
                            </Link>
                        )}

                        <ToggleTheme />

                        <NotificationBell />

                        <UserMenu
                            firstName={me?.firstName || ''}
                            lastName={me?.lastName || ''}
                            role={me?.role || ''}
                            id={me?._id || ''}
                            avatarUrl={me?.avatar || ''}
                            onLogout={handleLogout}
                            loading={loading}
                        />
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {menuOpen && (
                <div
                    id="mobile-navigation"
                    className="md:hidden bg-surface px-6 pb-6 pt-4 flex flex-col gap-1 fixed left-0 right-0 top-16 z-40 shadow-xl border-b border-outline-variant"
                >
                    {navLinks.map(({ label, href }) => {
                        const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`py-2.5 text-body-md font-medium transition-colors border-b border-outline-variant/30 last:border-b-0 ${isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        );
                    })}

                    {/* Mobile Post Job Action for Clients */}
                    {isClient && (
                        <div className="pt-3 border-t border-outline-variant mt-2">
                            <Link
                                href="/client/jobs/create"
                                className="flex justify-center items-center gap-2 bg-primary text-on-primary text-sm font-medium py-2.5 rounded-lg w-full transition-opacity hover:opacity-90"
                                onClick={() => setMenuOpen(false)}
                            >
                                <Plus size={18} />
                                <span>Post a Job</span>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}