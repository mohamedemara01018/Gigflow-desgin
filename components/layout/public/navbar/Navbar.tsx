'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';

import ToggleTheme from '@/components/ui/ToggleTheme';
import Logo from '@/components/ui/Logo';
import NotificationBell from '@/components/ui/NotificationBell';
import { selectMeSlice } from '@/store/slices/auth/authSlice';
import { authService } from '@/services/auth.service';
import { toastify } from '@/store/slices/toastificationSlice';
import { AppDispatch } from '@/store/store';
import { UserRole } from '@/utils/enums.utils';

interface NavItem {
  label: string;
  href: string;
}

const LANDING_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Find Offers', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  const { me } = useSelector(selectMeSlice);
  const dispatch: AppDispatch = useDispatch();
  // const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(
        toastify({
          message: error?.message || 'Failed to logout. Please try again.',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const dashboardHref = me?.role === UserRole.CLIENT ? '/client/jobs' : '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-xs'
        : 'bg-transparent'
        }`}
    >
      <nav className="wrapper mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {LANDING_NAV_ITEMS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-low transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Right Controls */}
        <div className="hidden md:flex items-center gap-3">
          <ToggleTheme />

          {me ? (
            <>
              <NotificationBell />
              <Link
                href={dashboardHref}
                className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/role"
                className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-surface border-b border-outline-variant px-6 pb-6 pt-2 flex flex-col gap-2 shadow-xl"
        >
          {LANDING_NAV_ITEMS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}

          <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant mt-1">
            {me ? (
              <>
                <Link
                  href={dashboardHref}
                  className="w-full text-center py-2 text-sm font-semibold text-primary border border-primary/30 rounded-xl"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={loading}
                  className="w-full text-center py-2 text-sm font-semibold text-on-surface-variant border border-outline-variant rounded-xl disabled:opacity-50"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 text-sm font-semibold text-on-surface-variant border border-outline-variant rounded-xl"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/role"
                  className="flex-1 text-center py-2 text-sm font-semibold bg-primary text-on-primary rounded-xl"
                  onClick={() => setMenuOpen(false)}
                >
                  Join Now
                </Link>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-on-surface-variant">Theme</span>
              <ToggleTheme />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}