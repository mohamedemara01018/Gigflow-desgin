/* eslint-disable react-hooks/refs */
'use client';

import { useInView } from '../../../../hooks/Useinview'
import { StarIcon } from './Icons';

export default function Testimonial() {
    const testimonialAnim = useInView();

    return (
        <section className="py-24 bg-surface-container-low">
            <div
                ref={testimonialAnim.ref}
                className={`max-w-4xl mx-auto px-6 text-center transition-all duration-700 ${testimonialAnim.inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                {/* Quote mark */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-serif mx-auto mb-8 select-none">
                    &quot;
                </div>
                <blockquote className="text-2xl md:text-3xl font-display font-bold text-on-surface leading-snug tracking-tight">
                    &quot;The quality of talent on GigFlow is incomparable. We&apos;ve filled critical senior engineering roles in days that used to take us months. The precision of their matching algorithm is a game-changer for high-growth tech teams.&quot;
                </blockquote>
                <div className="mt-8 flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-bold text-base">
                        JC
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-on-surface text-sm">Julia Chen</p>
                        <p className="text-on-surface-variant text-xs">CTO of HyperSyntax</p>
                    </div>
                </div>
                {/* Stars */}
                <div className="flex justify-center gap-1 mt-6">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400">
                            <StarIcon />
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}