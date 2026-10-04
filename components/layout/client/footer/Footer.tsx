import Logo from '@/components/ui/Logo';
import Link from 'next/link';

const footerLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Help Center', href: '/contact-support' },
];

export default function Footer() {
    return (
        <footer className="bg-surface-container-lowest border-t border-outline-variant mt-12">
            <div className="wrapper mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <Logo />
                    <span className="hidden md:inline text-outline-variant">|</span>
                    <p className="text-on-surface-variant text-body-sm">
                        © {new Date().getFullYear()} GigFlow Global Inc. All rights reserved.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-semibold uppercase tracking-wider"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}