'use client';

import Logo from '@/components/ui/Logo';
import NotificationBell from '@/components/ui/NotificationBell';
import ToggleTheme from '@/components/ui/ToggleTheme';
import UserMenu from '@/components/ui/UserMenu';
import { authService } from '@/services/auth.service';
import { selectMeSlice } from '@/store/slices/auth/authSlice';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';
import { AppDispatch } from '@/store/store';
import { DURATION } from '@/utils/constant.utils';
import { Search, TextAlignJustify, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { me } = useSelector(selectMeSlice);
    const [loading, setLoading] = useState(false);

    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            window.location.reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            handleAddToastification(error.message || 'Failed to logout', 'error', DURATION);
        } finally {
            setLoading(false);
        }
    };

    const navLinks = [
        { label: 'My Jobs', href: '/client/jobs' },
        { label: 'Find Talent', href: '/client/talent' },
        { label: 'Messages', href: '/messages' },
        { label: 'Reports', href: '/client/reports' },
    ];

    return (
        <>
            <nav className="bg-surface border-b border-outline-variant shadow-sm docked w-full top-0 sticky z-50">
                <div className="flex justify-between items-center wrapper w-full px-6 mx-auto h-16">
                    {/* Left Section */}
                    <div className="flex items-center gap-8">
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={22} /> : <TextAlignJustify size={22} />}
                        </button>

                        <Logo />

                        <div className="hidden md:flex gap-6 items-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-on-surface font-['Inter'] hover:text-primary transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative hidden sm:block">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                                <Search size={20} />
                            </span>
                            <input
                                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-[14px] leading-5 font-['Inter'] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                                placeholder="Search freelancers, proposals, jobs..."
                                type="text"
                            />
                        </div>

                        {/* Create New Job Button */}
                        <Link
                            href="/client/jobs/create"
                            className="hidden sm:flex items-center gap-1.5 bg-primary text-on-primary text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                        >
                            <Plus size={18} />
                            <span>Post a Job</span>
                        </Link>

                        <ToggleTheme />

                        <NotificationBell />


                        <UserMenu
                            firstName={String(me?.firstName || '')}
                            lastName={String(me?.lastName || '')}
                            role={String(me?.role || '')}
                            id={String(me?._id || '')}
                            avatarUrl={String(me?.avatar || '')}
                            onLogout={handleLogout}
                            loading={loading}
                        />
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {menuOpen && (
                <div className="md:hidden bg-surface px-6 pb-6 pt-6 flex flex-col gap-3 fixed left-0 right-0 top-16 z-30 shadow-xl border-b border-outline-variant">
                    {navLinks.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}

                    {/* Mobile Create Job Action */}
                    <div className="pt-2 border-t border-outline-variant mt-1">
                        <Link
                            href="/client/jobs/create"
                            className="flex justify-center items-center gap-2 bg-primary text-on-primary text-sm font-medium py-2.5 rounded-lg w-full transition-opacity hover:opacity-90"
                            onClick={() => setMenuOpen(false)}
                        >
                            <Plus size={18} />
                            <span>Post a Job</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}