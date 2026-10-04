import Logo from '@/components/ui/Logo';
import { ArrowRight } from '../../../features/public/landing/Icons';

const connectLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Help Center', href: '/contact-support' },
];

const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookies' },
];

const bottomLinks = [
    { label: 'Privacy', href: '/privacy-policy' },
    { label: 'Terms', href: '/terms-of-service' },
    { label: 'Cookies', href: '/cookies' },
];

export default function Footer() {
    return (
        <footer className="bg-inverse-surface border-t border-inverse-on-surface/10">
            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
                {/* Brand */}
                <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                    <Logo />
                    <p className="text-sm text-inverse-on-surface/60 leading-relaxed">
                        The elite talent marketplace for building the future of work, one project at a time.
                    </p>
                </div>

                {/* Connect */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-inverse-on-surface/50">Connect</p>
                    {connectLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Legal */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-inverse-on-surface/50">Legal</p>
                    {legalLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

            </div>

            {/* Bottom bar */}
            <div className="border-t border-inverse-on-surface/10 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-inverse-on-surface/50">© 2025 GigFlow. All rights reserved.</p>
                <div className="flex gap-4">
                    {bottomLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-xs text-inverse-on-surface/50 hover:text-inverse-on-surface/80 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}