'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ToggleTheme from '@/components/ui/ToggleTheme';
import Logo from '@/components/ui/Logo';
import { useSelector } from 'react-redux';
import { selectMeSlice } from '@/store/slices/authSlice';
import { authService } from '@/services/auth.service';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { me } = useSelector(selectMeSlice)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.reload();
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <nav className="wrapper mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {[
            { label: 'Home', href: '/' },
            { label: 'Find Offers', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
          ].map(({ label, href }) => (
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

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <ToggleTheme />
          {
            me ?

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors duration-200">
                Logout
              </button>
              : <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/role"
                  className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface"
                >
                  Join Now
                </Link>
              </>
          }

        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface-container-low transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface px-6 pb-4 flex flex-col gap-2">
          {[
            { label: 'Home', href: '/' },
            { label: 'Find Offers', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-2 border-t border-outline-variant">

            {
              me ?
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors duration-200">
                  Logout
                </button>
                : <>
                  <Link href="/login" className="flex-1 text-center py-2 text-sm font-semibold text-on-surface-variant border border-outline-variant rounded-xl">
                    Sign In
                  </Link>
                  <Link href="/role" className="flex-1 text-center py-2 text-sm font-semibold text-on-surface-variant border border-outline-variant rounded-xl">
                    Join Now
                  </Link>
                </>
            }

            <ToggleTheme />
          </div>
        </div>
      )}
    </header>
  );
}