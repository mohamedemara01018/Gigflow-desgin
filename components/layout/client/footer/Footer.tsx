import Logo from '@/components/ui/Logo';

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
                    {["Sitemap", "Privacy Policy", "Terms of Service", "Cookie Settings"].map((link) => (
                        <a
                            key={link}
                            className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-semibold uppercase tracking-wider"
                            href="#"
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}