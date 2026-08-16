import Logo from '@/components/ui/Logo';
import { ArrowRight, BoltIcon } from '../../../features/public/landing/Icons';

const connectLinks = ['About Us', 'Careers', 'Help Center'];
const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];
const bottomLinks = ['Privacy', 'Terms', 'Cookies'];

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
                    {connectLinks.map((l) => (
                        <a key={l} href="#" className="text-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors">{l}</a>
                    ))}
                </div>

                {/* Legal */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-inverse-on-surface/50">Legal</p>
                    {legalLinks.map((l) => (
                        <a key={l} href="#" className="text-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors">{l}</a>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-inverse-on-surface/50">Newsletter</p>
                    <p className="text-sm text-inverse-on-surface/60">Get the latest gigs and talent trends.</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="you@company.com"
                            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-inverse-on-surface/10 border border-inverse-on-surface/20 text-sm text-inverse-on-surface placeholder:text-inverse-on-surface/40 focus:outline-none focus:border-inverse-primary transition-colors"
                        />
                        <button className="btn-primary p-2.5 rounded-xl text-on-primary flex-shrink-0">
                            <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-inverse-on-surface/10 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-inverse-on-surface/50">© 2025 GigFlow. All rights reserved.</p>
                <div className="flex gap-4">
                    {bottomLinks.map((t) => (
                        <a key={t} href="#" className="text-xs text-inverse-on-surface/50 hover:text-inverse-on-surface/80 transition-colors">{t}</a>
                    ))}
                </div>
            </div>
        </footer>
    );
}