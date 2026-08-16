import Link from 'next/link';
import { ArrowRight } from './Icons';

export default function CtaBanner() {
    return (
        <section id="pricing" className="py-24 bg-inverse-surface relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-inverse-primary/20 rounded-full blur-3xl" />
            </div>
            <div className="relative max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
                <div className="inline-flex items-center gap-2 bg-inverse-primary/20 border border-inverse-primary/30 rounded-full px-4 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-inverse-primary animate-pulse" />
                    <span className="text-sm font-semibold text-inverse-primary">No credit card required</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black text-inverse-on-surface leading-tight tracking-tight">
                    Ready to find your <br className="hidden sm:block" />
                    next expert?
                </h2>
                <p className="text-lg text-inverse-on-surface/70 max-w-xl">
                    Join thousands of companies and freelancers building the future of work today.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                    <Link
                        href="/signup"
                        className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-on-primary font-bold text-base"
                    >
                        Join Now <ArrowRight />
                    </Link>
                    <Link
                        href="#features"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-inverse-on-surface font-bold text-base border border-inverse-on-surface/20 hover:bg-inverse-on-surface/10 transition-colors duration-200"
                    >
                        Contact Sales
                    </Link>
                </div>
            </div>
        </section>
    );
}