import Logo from '@/components/ui/Logo';
import Link from 'next/link';


const footerLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Help Center', href: '/contact-support' },
];

function Footer() {
    return (
        <footer className="bg-surface-container-lowest border-t border-outline-variant mt-8">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                    <Logo />
                    <p className="text-on-surface-variant text-[14px] leading-5 font-['Inter'] mt-2">
                        © {new Date().getFullYear()} GigFlow Global Inc. All rights reserved.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-on-surface-variant hover:text-primary transition-colors text-[12px] leading-4 font-['Geist'] font-semibold uppercase tracking-wide"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}

export default Footer;