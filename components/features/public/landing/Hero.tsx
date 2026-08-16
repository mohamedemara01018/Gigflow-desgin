import Link from 'next/link';
import { CheckIcon, ArrowRight, BoltIcon } from './Icons';

const proofPoints = [
    'No subscription fees — pay only per project',
    'Funds guaranteed via milestone escrow',
    'Matched to clients in under 60 seconds',
];

const talentPreview = [
    { name: 'Alex Rivera', role: 'Full-Stack Engineer', rate: '$95/hr', score: 98 },
    { name: 'Sara Okafor', role: 'UI/UX Designer', rate: '$75/hr', score: 96 },
];

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-surface">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl" />
                <div className="absolute top-60 -left-32 w-[400px] h-[400px] rounded-full bg-primary-container/10 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Copy */}
                <div className="flex flex-col gap-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 w-fit">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-semibold text-primary">Trusted by 50,000+ companies</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-black leading-[1.08] tracking-tight text-on-surface">
                        Scale your <br className="hidden sm:block" />
                        freelance career{' '}
                        <span className="text-gradient">with precision.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-lg">
                        The elite marketplace for elite independent talent. Connect with
                        top-tier companies through AI-driven matching and secure,
                        guaranteed payments.
                    </p>

                    {/* Bullet proof points */}
                    <ul className="flex flex-col gap-2.5 text-on-surface-variant text-sm font-medium">
                        {proofPoints.map((p) => (
                            <li key={p} className="flex items-center gap-2.5">
                                <span className="text-primary"><CheckIcon /></span>
                                {p}
                            </li>
                        ))}
                    </ul>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <Link
                            href="/signup"
                            className=" inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary font-semibold text-base text-on-primary"
                        >
                            Get Started <ArrowRight />
                        </Link>
                        <Link
                            href="#workflow"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-on-surface-variant font-semibold text-base border border-outline-variant hover:bg-surface-container-low transition-colors duration-200"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </div>

                {/* Right: Hero visual card */}
                <div className="relative hidden lg:flex justify-center items-center">
                    {/* Floating main card */}
                    <div className="glass-card border border-outline-variant rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
                        {/* Card header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <BoltIcon cls="w-4 h-4 text-on-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant">GigFlow</p>
                                    <p className="text-sm font-bold text-on-surface">Premium Hiring Platform</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">Live</span>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-outline-variant" />

                        {/* Talent match cards */}
                        {talentPreview.map((t) => (
                            <div key={t.name} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-on-surface">{t.name}</p>
                                        <p className="text-xs text-on-surface-variant">{t.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">{t.rate}</p>
                                    <p className="text-xs text-on-surface-variant">Match: {t.score}%</p>
                                </div>
                            </div>
                        ))}

                        {/* Action row */}
                        <button className="btn-primary w-full py-3 rounded-xl text-on-primary text-sm font-semibold flex items-center justify-center gap-2">
                            View 24 Matched Freelancers <ArrowRight />
                        </button>
                    </div>

                    {/* Floating stat badge */}
                    <div className="absolute -bottom-6 -left-8 bg-surface-container-lowest rounded-2xl px-4 py-3 shadow-xl border border-outline-variant flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Projects Launched</p>
                            <p className="text-base font-black text-on-surface">+1,240 this week</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}