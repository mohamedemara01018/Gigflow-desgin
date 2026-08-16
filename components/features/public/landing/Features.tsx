/* eslint-disable react-hooks/refs */
'use client';

import { useInView } from '../../../../hooks/Useinview';
import { ArrowRight } from './Icons';
import { features } from './Data';

export default function Features() {
    const featureAnim = useInView();

    return (
        <section id="features" className="py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why GigFlow</p>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-on-surface tracking-tight">
                        Built for Professional Excellence
                    </h2>
                    <p className="mt-4 text-lg text-on-surface-variant max-w-2xl mx-auto">
                        We&apos;ve stripped away the noise of traditional freelancing platforms to focus on what
                        matters: quality work and seamless transactions.
                    </p>
                </div>

                <div
                    ref={featureAnim.ref}
                    className={`grid md:grid-cols-3 gap-8 transition-all duration-700 ${featureAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    {features.map((f, i) => (
                        <div
                            key={f.title}
                            style={{ transitionDelay: `${i * 100}ms` }}
                            className="group flex flex-col gap-4 p-8 rounded-2xl border border-outline-variant hover:border-primary/30 bg-surface hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-default"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-on-surface">{f.title}</h3>
                            <p className="text-on-surface-variant leading-relaxed text-sm">{f.desc}</p>
                            <span className="mt-auto text-sm font-semibold text-primary flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                Learn more <ArrowRight cls="w-3.5 h-3.5" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}